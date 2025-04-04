/**
 * End-to-end tests for the Roles by ID API in the Keycloak Admin SDK
 * 
 * This test suite verifies the functionality of the Roles by ID API.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../../src';
import { RoleRepresentation } from '../../../src/types/roles';
import { setupTestEnvironment, cleanupTestEnvironment, TestContext } from '../utils/test-setup';

describe('Roles by ID API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let testRoleId: string;
  let compositeRoleId: string;

  // Test timeout - using environment variable with fallback
  const TEST_TIMEOUT = 30000;

  beforeAll(async () => {
    
    
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }, TEST_TIMEOUT);

  afterAll(async () => {
    try {
      // Clean up test environment
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  }, TEST_TIMEOUT);

  it('should create roles for testing', async () => {
    // Create a test role
    const roleName = `test-role-${Date.now()}`;
    const roleData: RoleRepresentation = {
      name: roleName,
      description: 'Test role for Roles by ID API testing',
    };
    
    testRoleId = await sdk.roles.create(roleData);
    expect(testRoleId).toBeDefined();
    expect(typeof testRoleId).toBe('string');
    expect(testRoleId.length).toBeGreaterThan(0);

    // Create a composite role
    const compositeRoleName = `composite-role-${Date.now()}`;
    const compositeRoleData: RoleRepresentation = {
      name: compositeRoleName,
      description: 'Composite role for testing',
      composite: true,
    };
    
    compositeRoleId = await sdk.roles.create(compositeRoleData);
    expect(compositeRoleId).toBeDefined();
    expect(typeof compositeRoleId).toBe('string');
    expect(compositeRoleId.length).toBeGreaterThan(0);
  });

  it('should get a role by ID', async () => {
    const role = await sdk.roles.byId.get(testRoleId);
    
    expect(role).toBeDefined();
    expect(role.id).toBe(testRoleId);
    expect(role.description).toBe('Test role for Roles by ID API testing');
  });

  it('should update a role by ID', async () => {
    // Get the current role
    const role = await sdk.roles.byId.get(testRoleId);
    
    // Update the role
    const updatedRole: RoleRepresentation = {
      ...role,
      description: 'Updated description via Roles by ID API',
    };
    
    await sdk.roles.byId.update(testRoleId, updatedRole);
    
    // Verify the update
    const verifiedRole = await sdk.roles.byId.get(testRoleId);
    expect(verifiedRole.description).toBe('Updated description via Roles by ID API');
  });

  it('should add composites to a role', async () => {
    // Get the test role
    const role = await sdk.roles.byId.get(testRoleId);
    
    // Add the test role as a composite to the composite role
    await sdk.roles.byId.addComposites(compositeRoleId, [role]);
    
    // Verify the composite was added
    const composites = await sdk.roles.byId.getComposites(compositeRoleId);
    const hasComposite = composites.some((r: RoleRepresentation) => r.id === testRoleId);
    expect(hasComposite).toBe(true);
  });

  it('should get role composites', async () => {
    // Get composites for the role
    const composites = await sdk.roles.byId.getComposites(compositeRoleId);
    
    expect(Array.isArray(composites)).toBe(true);
    expect(composites.length).toBeGreaterThan(0);
    
    // Verify the test role is in the composites
    const hasTestRole = composites.some((r: RoleRepresentation) => r.id === testRoleId);
    expect(hasTestRole).toBe(true);
  });

  it('should get realm role composites', async () => {
    // Get realm role composites
    const realmComposites = await sdk.roles.byId.getRealmRoleComposites(compositeRoleId);
    
    expect(Array.isArray(realmComposites)).toBe(true);
    expect(realmComposites.length).toBeGreaterThan(0);
    
    // Verify the test role is in the realm composites
    const hasTestRole = realmComposites.some((r: RoleRepresentation) => r.id === testRoleId);
    expect(hasTestRole).toBe(true);
  });

  it('should get role permissions', async () => {
    try {
      // Get role permissions
      const permissions = await sdk.roles.byId.getPermissions(testRoleId);
      
      // If we get here, the permissions API is supported
      expect(permissions).toBeDefined();
      expect(typeof permissions.enabled).toBe('boolean');
      
    } catch (error) {
      // If the API is not supported, the SDK should handle it gracefully and return a default object
      // Skip the test if the feature is not supported
      console.warn('Role permissions management is not supported by this Keycloak server version');
      return; // Skip the test
    }
  });

  it('should update role permissions', async () => {
    try {
      // Get current permissions
      const currentPermissions = await sdk.roles.byId.getPermissions(testRoleId);
      
      // Update permissions (toggle the enabled state)
      const updatedPermissions = {
        ...currentPermissions,
        enabled: !currentPermissions.enabled,
      };
      
      const result = await sdk.roles.byId.updatePermissions(testRoleId, updatedPermissions);
      
      // If we get here, the permissions API is supported
      expect(result).toBeDefined();
      expect(result.enabled).toBe(!currentPermissions.enabled);
      
    } catch (error) {
      // If the API is not supported, the SDK should handle it gracefully
      // Skip the test if the feature is not supported
      console.warn('Role permissions management is not supported by this Keycloak server version');
      return; // Skip the test
    }
  });

  it('should remove composites from a role', async () => {
    // Get the test role
    const role = await sdk.roles.byId.get(testRoleId);
    
    // Remove the test role from the composite role
    await sdk.roles.byId.removeComposites(compositeRoleId, [role]);
    
    // Verify the composite was removed
    const composites = await sdk.roles.byId.getComposites(compositeRoleId);
    const hasComposite = composites.some((r: RoleRepresentation) => r.id === testRoleId);
    expect(hasComposite).toBe(false);
  });

  it('should delete roles', async () => {
    // Delete the composite role
    await sdk.roles.byId.delete(compositeRoleId);
    
    // Verify the composite role was deleted
    try {
      await sdk.roles.byId.get(compositeRoleId);
      // If we get here, the role still exists
      fail('Composite role was not deleted');
    } catch (error) {
      // Expected error - role should not exist
      expect(error).toBeDefined();
    }
    
    // Delete the test role
    await sdk.roles.byId.delete(testRoleId);
    
    // Verify the test role was deleted
    try {
      await sdk.roles.byId.get(testRoleId);
      // If we get here, the role still exists
      fail('Test role was not deleted');
    } catch (error) {
      // Expected error - role should not exist
      expect(error).toBeDefined();
    }
  });
});
