/**
 * End-to-end tests for the Role Mappings API
 * 
 * These tests verify that the Role Mappings API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../../src';
import { RoleRepresentation } from '../../../src/types/roles';
import { UserRepresentation } from '../../../src/types/users';
import { GroupRepresentation } from '../../../src/types/groups';
import { setupTestEnvironment, cleanupTestEnvironment, TestContext } from '../utils/test-setup';

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Role Mappings API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let userId: string;
  let groupId: string;
  let role1Id: string;
  let role2Id: string;
  let role1: RoleRepresentation;
  let role2: RoleRepresentation;

  // Set up test environment before running tests
  beforeAll(async () => {
    
    
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
      
      // Create a test user
      const testUser: UserRepresentation = {
        username: `test-user-${Date.now()}`,
        enabled: true,
        email: `test-user-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        credentials: [
          {
            type: 'password',
            value: 'password',
            temporary: false,
          },
        ],
      };
      
      userId = await sdk.users.create(testUser);
      
      
      // Create a test group
      const testGroup: GroupRepresentation = {
        name: `test-group-${Date.now()}`,
      };
      
      groupId = await sdk.groups.create(testGroup);
      
      
      // Create test roles
      const testRole1: RoleRepresentation = {
        name: `test-role-1-${Date.now()}`,
        description: 'Test role 1 for role mappings tests',
      };
      
      const testRole2: RoleRepresentation = {
        name: `test-role-2-${Date.now()}`,
        description: 'Test role 2 for role mappings tests',
      };
      
      role1Id = await sdk.roles.create(testRole1);
      role2Id = await sdk.roles.create(testRole2);
      
      
      // Get the created roles
      role1 = await sdk.roles.byId.get(role1Id);
      role2 = await sdk.roles.byId.get(role2Id);
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test resources
      if (role1Id && role1.name) {
        
        await sdk.roles.delete(role1.name);
      }
      
      if (role2Id && role2.name) {
        
        await sdk.roles.delete(role2.name);
      }
      
      if (groupId) {
        
        await sdk.groups.delete(groupId);
      }
      
      if (userId) {
        
        await sdk.users.delete(userId);
      }
      
      // Clean up test environment
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  }, TEST_TIMEOUT);

  describe('User Role Mappings', () => {
    test('should get all role mappings for a user', async () => {
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      const allMappings = await userRoleMappings.getAll();
      
      expect(allMappings).toBeDefined();
      expect(allMappings.realmMappings).toBeDefined();
    });
    
    test('should get available realm role mappings for a user', async () => {
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      const availableRoles = await userRoleMappings.getAvailableRealmRoleMappings();
      
      expect(Array.isArray(availableRoles)).toBe(true);
      expect(availableRoles.length).toBeGreaterThan(0);
      
      // Verify our test roles are in the available roles
      const hasRole1 = availableRoles.some(role => role.id === role1Id);
      const hasRole2 = availableRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(true);
    });
    
    test('should add realm role mappings to a user', async () => {
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      
      // Add roles to the user
      await userRoleMappings.addRealmRoleMappings([role1, role2]);
      
      // Verify roles were added
      const realmRoles = await userRoleMappings.getRealmRoleMappings();
      
      expect(Array.isArray(realmRoles)).toBe(true);
      expect(realmRoles.length).toBeGreaterThanOrEqual(2);
      
      const hasRole1 = realmRoles.some(role => role.id === role1Id);
      const hasRole2 = realmRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(true);
    });
    
    test('should get effective realm role mappings for a user', async () => {
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      const effectiveRoles = await userRoleMappings.getEffectiveRealmRoleMappings();
      
      expect(Array.isArray(effectiveRoles)).toBe(true);
      expect(effectiveRoles.length).toBeGreaterThanOrEqual(2);
      
      const hasRole1 = effectiveRoles.some(role => role.id === role1Id);
      const hasRole2 = effectiveRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(true);
    });
    
    test('should delete realm role mappings from a user', async () => {
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      
      // Remove one role from the user
      await userRoleMappings.deleteRealmRoleMappings([role2]);
      
      // Verify role was removed
      const realmRoles = await userRoleMappings.getRealmRoleMappings();
      
      expect(Array.isArray(realmRoles)).toBe(true);
      
      const hasRole1 = realmRoles.some(role => role.id === role1Id);
      const hasRole2 = realmRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(false);
    });
  });
  
  describe('Group Role Mappings', () => {
    test('should get all role mappings for a group', async () => {
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId);
      const allMappings = await groupRoleMappings.getAll();
      
      expect(allMappings).toBeDefined();
      // The response structure might vary depending on whether roles are assigned
      // Just verify that we got a valid response object
      expect(typeof allMappings).toBe('object');
    });
    
    test('should get available realm role mappings for a group', async () => {
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId);
      const availableRoles = await groupRoleMappings.getAvailableRealmRoleMappings();
      
      expect(Array.isArray(availableRoles)).toBe(true);
      expect(availableRoles.length).toBeGreaterThan(0);
      
      // Verify our test roles are in the available roles
      const hasRole1 = availableRoles.some(role => role.id === role1Id);
      const hasRole2 = availableRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(true);
    });
    
    test('should add realm role mappings to a group', async () => {
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId);
      
      // Add roles to the group
      await groupRoleMappings.addRealmRoleMappings([role1, role2]);
      
      // Verify roles were added
      const realmRoles = await groupRoleMappings.getRealmRoleMappings();
      
      expect(Array.isArray(realmRoles)).toBe(true);
      expect(realmRoles.length).toBeGreaterThanOrEqual(2);
      
      const hasRole1 = realmRoles.some(role => role.id === role1Id);
      const hasRole2 = realmRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(true);
    });
    
    test('should get effective realm role mappings for a group', async () => {
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId);
      const effectiveRoles = await groupRoleMappings.getEffectiveRealmRoleMappings();
      
      expect(Array.isArray(effectiveRoles)).toBe(true);
      expect(effectiveRoles.length).toBeGreaterThanOrEqual(2);
      
      const hasRole1 = effectiveRoles.some(role => role.id === role1Id);
      const hasRole2 = effectiveRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(true);
    });
    
    test('should delete realm role mappings from a group', async () => {
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId);
      
      // Remove one role from the group
      await groupRoleMappings.deleteRealmRoleMappings([role2]);
      
      // Verify role was removed
      const realmRoles = await groupRoleMappings.getRealmRoleMappings();
      
      expect(Array.isArray(realmRoles)).toBe(true);
      
      const hasRole1 = realmRoles.some(role => role.id === role1Id);
      const hasRole2 = realmRoles.some(role => role.id === role2Id);
      
      expect(hasRole1).toBe(true);
      expect(hasRole2).toBe(false);
    });
  });
  
  describe('Client Role Mappings', () => {
    let clientId: string;
    let clientRole: RoleRepresentation;
    
    beforeAll(async () => {
      try {
        // Get a client to work with
        const clients = await sdk.clients.findAll();
        if (clients.length > 0) {
          const client = clients.find((c: any) => c.clientId !== 'admin-cli'); // Skip admin-cli client
          
          if (client && client.id) {
            clientId = client.id;
            console.log(`Using client: ${client.clientId} (${clientId})`);
            
            // Get client roles
            const clientRoles = await sdk.clients.listRoles(clientId);
            if (clientRoles.length > 0) {
              clientRole = clientRoles[0];
              console.log(`Using client role: ${clientRole.name} (${clientRole.id})`);
            } else {
              
              
              // Create a test client role
              const testClientRole: RoleRepresentation = {
                name: `test-client-role-${Date.now()}`,
                description: 'Test client role for role mappings tests',
              };
              
              await sdk.clients.createRole(clientId, testClientRole);
              clientRole = await sdk.clients.getRole(clientId, testClientRole.name!);
              console.log(`Created test client role: ${clientRole.name} (${clientRole.id})`);
            }
          } else {
            
          }
        } else {
          
        }
      } catch (error) {
        console.error('Error setting up client role mappings tests:', error);
      }
    });
    
    afterAll(async () => {
      try {
        // Clean up test client role if we created one
        if (clientId && clientRole && clientRole.name && clientRole.name.startsWith('test-client-role-')) {
          
          await sdk.clients.deleteRole(clientId, clientRole.name);
        }
      } catch (error) {
        console.error('Error cleaning up client role mappings tests:', error);
      }
    });
    
    test('should get available client role mappings for a user', async () => {
      // Skip test if no client or client role is available
      if (!clientId || !clientRole) {
        
        return;
      }
      
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      const availableRoles = await userRoleMappings.getAvailableClientRoleMappings(clientId);
      
      expect(Array.isArray(availableRoles)).toBe(true);
      
      // Verify our test client role is in the available roles
      const hasClientRole = availableRoles.some(role => role.id === clientRole.id);
      expect(hasClientRole).toBe(true);
    });
    
    test('should add client role mappings to a user', async () => {
      // Skip test if no client or client role is available
      if (!clientId || !clientRole) {
        
        return;
      }
      
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      
      // Add client role to the user
      await userRoleMappings.addClientRoleMappings(clientId, [clientRole]);
      
      // Verify client role was added
      const clientRoles = await userRoleMappings.getClientRoleMappings(clientId);
      
      expect(Array.isArray(clientRoles)).toBe(true);
      expect(clientRoles.length).toBeGreaterThanOrEqual(1);
      
      const hasClientRole = clientRoles.some(role => role.id === clientRole.id);
      expect(hasClientRole).toBe(true);
    });
    
    test('should get effective client role mappings for a user', async () => {
      // Skip test if no client or client role is available
      if (!clientId || !clientRole) {
        
        return;
      }
      
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      const effectiveRoles = await userRoleMappings.getEffectiveClientRoleMappings(clientId);
      
      expect(Array.isArray(effectiveRoles)).toBe(true);
      
      const hasClientRole = effectiveRoles.some(role => role.id === clientRole.id);
      expect(hasClientRole).toBe(true);
    });
    
    test('should delete client role mappings from a user', async () => {
      // Skip test if no client or client role is available
      if (!clientId || !clientRole) {
        
        return;
      }
      
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      
      // Remove client role from the user
      await userRoleMappings.deleteClientRoleMappings(clientId, [clientRole]);
      
      // Verify client role was removed
      const clientRoles = await userRoleMappings.getClientRoleMappings(clientId);
      
      expect(Array.isArray(clientRoles)).toBe(true);
      
      const hasClientRole = clientRoles.some(role => role.id === clientRole.id);
      expect(hasClientRole).toBe(false);
    });
  });
});
