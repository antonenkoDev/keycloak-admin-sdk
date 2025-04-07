/**
 * End-to-end tests for the Roles API
 *
 * These tests verify that the Roles API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 */

import KeycloakClient from '../../../src/index';
import { RoleRepresentation } from '../../../src/types/roles';
import {
  cleanupTestEnvironment,
  createTestUser,
  setupTestEnvironment,
  TestContext
} from '../utils/test-setup';

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Roles API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakClient;
  let roleName: string;
  let roleId: string;
  let compositeRoleName: string;
  let compositeRoleId: string;
  let userId: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;

      // Create a test user for role assignment tests
      const user = await createTestUser(sdk);
      userId = user.id || '';

      if (!userId) {
        throw new Error('Failed to create test user: no ID returned');
      }
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test resources
      if (userId) {
        await sdk.users.delete(userId);
      }

      // Clean up roles if they weren't deleted in tests
      if (compositeRoleName) {
        try {
          await sdk.roles.delete(compositeRoleName);
        } catch (error) {
          console.error(
            `Failed to delete composite role: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      if (roleName) {
        try {
          await sdk.roles.delete(roleName);
        } catch (error) {
          console.error(
            `Failed to delete role: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      // Clean up test realm
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  }, TEST_TIMEOUT);

  /**
   * Test: Creating a role
   *
   * This test verifies that roles can be created and IDs are correctly returned
   */
  test(
    'should create a role and return its ID',
    async () => {
      try {
        // Generate unique role name
        roleName = `test-role-${Date.now()}`;

        // Create role
        const role: RoleRepresentation = {
          name: roleName,
          description: 'A test role for E2E testing',
          attributes: {
            'test-attribute': ['test-value']
          }
        };

        // Create the role and get the ID
        roleId = await sdk.roles.create(role);

        // Verify ID is valid
        expect(roleId).toBeDefined();
        expect(typeof roleId).toBe('string');
        expect(roleId.length).toBeGreaterThan(0);

        // Verify role exists with this ID
        const createdRole = await sdk.roles.getByName(roleName);
        expect(createdRole).toBeDefined();
        expect(createdRole.id).toBe(roleId);
        expect(createdRole.name).toBe(roleName);
        expect(createdRole.description).toBe('A test role for E2E testing');
        expect(createdRole.attributes?.['test-attribute']).toContain('test-value');
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Listing roles
   *
   * This test verifies that roles can be listed with proper filtering
   */
  test(
    'should list roles with filtering',
    async () => {
      // Skip test if no role was created
      if (!roleName) {
        throw new Error('Role name not available');
        return;
      }

      try {
        // List all roles
        const allRoles = await sdk.roles.list();

        // Verify our test role is in the list
        const hasRole = allRoles.some(role => role.id === roleId);
        expect(hasRole).toBe(true);

        // Test pagination
        const firstPage = await sdk.roles.list({ first: 0, max: 5 });
        expect(firstPage.length).toBeLessThanOrEqual(5);

        // Test brief representation
        const briefRoles = await sdk.roles.list({ briefRepresentation: true });
        expect(briefRoles.length).toBeGreaterThan(0);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Updating a role
   *
   * This test verifies that roles can be updated
   */
  test(
    'should update a role',
    async () => {
      // Skip test if no role was created
      if (!roleName) {
        throw new Error('Role name not available');
        return;
      }

      try {
        // Get current role
        const role = await sdk.roles.getByName(roleName);

        // Update role
        const updatedDescription = `Updated role description ${Date.now()}`;
        role.description = updatedDescription;

        // Add a new attribute
        if (!role.attributes) {
          role.attributes = {};
        }
        role.attributes.updated = ['true'];

        // Update the role
        await sdk.roles.update(roleName, role);

        // Verify update was successful
        const updatedRole = await sdk.roles.getByName(roleName);
        expect(updatedRole.description).toBe(updatedDescription);
        expect(updatedRole.attributes?.updated).toContain('true');
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Creating a composite role
   *
   * This test verifies that composite roles can be created and managed
   */
  test(
    'should create a composite role and add composites',
    async () => {
      // Skip test if no role was created
      if (!roleName) {
        throw new Error('Role name not available');
        return;
      }

      try {
        // Generate unique composite role name
        compositeRoleName = `composite-role-${Date.now()}`;

        // Create composite role
        const compositeRole: RoleRepresentation = {
          name: compositeRoleName,
          description: 'A composite test role for E2E testing',
          composite: true
        };

        // Create the composite role and get the ID
        compositeRoleId = await sdk.roles.create(compositeRole);

        // Get the original role
        const role = await sdk.roles.getByName(roleName);

        // Add the original role as a composite
        await sdk.roles.addComposites(compositeRoleName, [role]);

        // Verify composite was added
        const composites = await sdk.roles.getComposites(compositeRoleName);
        expect(composites.length).toBeGreaterThan(0);

        const hasComposite = composites.some(r => r.id === roleId);
        expect(hasComposite).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting role composites
   *
   * This test verifies that role composites can be retrieved
   */
  test(
    'should get role composites',
    async () => {
      // Skip test if no composite role was created
      if (!compositeRoleName) {
        throw new Error('Composite role name not available');
        return;
      }

      try {
        // Get all composites
        const composites = await sdk.roles.getComposites(compositeRoleName);

        expect(composites.length).toBeGreaterThan(0);

        // Get realm role composites
        const realmComposites = await sdk.roles.getRealmRoleComposites(compositeRoleName);

        expect(realmComposites.length).toBeGreaterThan(0);

        // Verify our test role is in the composites
        const hasComposite = realmComposites.some(r => r.id === roleId);
        expect(hasComposite).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Assigning a role to a user
   *
   * This test verifies that roles can be assigned to users
   */
  test(
    'should assign a role to a user and get users with role',
    async () => {
      // Skip test if no role or user was created
      if (!roleName || !userId) {
        throw new Error('Role name or User ID not available');
        return;
      }

      try {
        // Get the role
        const role = await sdk.roles.getByName(roleName);

        // Add role to user
        await sdk.users.addRealmRoles(userId, [role]);

        // Verify role was added to user
        const userRoles = await sdk.users.getRealmRoleMappings(userId);
        const hasRole = userRoles.some((r: RoleRepresentation) => r.id === roleId);
        expect(hasRole).toBe(true);

        // Get users with the role
        const usersWithRole = await sdk.roles.getUsersWithRole(roleName);

        // Verify our test user is in the list
        const hasUser = usersWithRole.some(user => user.id === userId);
        expect(hasUser).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Removing composites from a role
   *
   * This test verifies that composites can be removed from a role
   */
  test(
    'should remove composites from a role',
    async () => {
      // Skip test if no composite role was created
      if (!compositeRoleName || !roleName) {
        throw new Error('Composite role name or role name not available');
        return;
      }

      try {
        // Get the original role
        const role = await sdk.roles.getByName(roleName);

        // Remove the original role from composites
        await sdk.roles.removeComposites(compositeRoleName, [role]);

        // Verify composite was removed
        const composites = await sdk.roles.getComposites(compositeRoleName);
        const hasComposite = composites.some(r => r.id === roleId);
        expect(hasComposite).toBe(false);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Deleting roles
   *
   * This test verifies that roles can be deleted
   */
  test(
    'should delete roles',
    async () => {
      // Skip test if no roles were created
      if (!roleName || !compositeRoleName) {
        throw new Error('Role names not available');
        return;
      }

      try {
        // Remove roles from user first
        if (userId) {
          try {
            const role = await sdk.roles.getByName(roleName);
            await sdk.users.removeRealmRoles(userId, [role]);
          } catch (error) {
            console.error(
              `Error removing role from user: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        }

        // Delete the composite role
        await sdk.roles.delete(compositeRoleName);

        // Verify composite role was deleted
        try {
          await sdk.roles.getByName(compositeRoleName);
          // If we get here, the role still exists
          fail('Composite role should have been deleted');
        } catch (error) {
          // Expected error - role should not exist
          expect(error).toBeDefined();
        }

        // Delete the original role
        await sdk.roles.delete(roleName);

        // Verify role was deleted
        try {
          await sdk.roles.getByName(roleName);
          // If we get here, the role still exists
          fail('Role should have been deleted');
        } catch (error) {
          // Expected error - role should not exist
          expect(error).toBeDefined();
        }

        // Clear the role names since we've deleted them
        roleName = '';
        compositeRoleName = '';
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );
});
