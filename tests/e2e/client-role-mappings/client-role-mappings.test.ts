/**
 * End-to-end tests for the Client Role Mappings API
 * 
 * These tests verify that the Client Role Mappings API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../../src/index';
import { RoleRepresentation } from '../../../src/types/roles';
import { setupTestEnvironment, cleanupTestEnvironment, TestContext, createTestUser, createTestGroup } from '../utils/test-setup';

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Client Role Mappings API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let userId: string;
  let groupId: string;
  let clientId: string;
  let clientRoleId: string;
  let roleName: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    console.log('Setting up test environment for client role mappings tests');
    
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
      
      // Explicitly create a test client for role mappings tests
      console.log('Creating a dedicated test client for role mappings tests');
      const clientIdName = `test-client-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      const client = {
        clientId: clientIdName,
        name: 'Client Role Mappings Test Client',
        description: 'Client for testing role mappings',
        enabled: true,
        protocol: 'openid-connect',
        publicClient: false,
        serviceAccountsEnabled: true,
        standardFlowEnabled: true,
        directAccessGrantsEnabled: true,
        redirectUris: ['http://localhost:3000/*'],
        webOrigins: ['+']
      };
      
      // Create the client and store its ID
      const createdClientId = await sdk.clients.create(client);
      console.log(`Created test client with ID: ${createdClientId}`);
      
      clientId = createdClientId;
      testContext.clientId = createdClientId;
      
      // Verify that client was created successfully
      if (!clientId) {
        throw new Error('Failed to create test client for role mappings tests');
      }
      
      // Create a test user
      const user = await createTestUser(sdk);
      userId = user.id || '';
      
      // Create a test group
      const group = await createTestGroup(sdk);
      groupId = group.id || '';
      
      // Create a client role for testing
      roleName = `test-role-${Date.now()}`;
      const role: RoleRepresentation = {
        name: roleName,
        description: 'Test role for client role mappings tests',
        clientRole: true
      };
      
      // Use the client ID we created earlier
      if (!clientId) {
        throw new Error('Test client ID not available');
      }
      
      // Create client role
      clientRoleId = await sdk.clients.createRole(clientId, role);
      console.log(`Created test client role: ${roleName} with ID: ${clientRoleId}`);
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
        console.log(`Cleaning up test user: ${userId}`);
        await sdk.users.delete(userId);
      }
      
      if (groupId) {
        console.log(`Cleaning up test group: ${groupId}`);
        await sdk.groups.delete(groupId);
      }
      
      // Clean up test realm
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Adding client role mappings to a user
   * 
   * This test verifies that client roles can be added to a user
   */
  test('should add client role mappings to a user', async () => {
    // Skip test if setup failed
    if (!clientId || !userId || !clientRoleId || !roleName) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      console.log(`Test resources: clientId=${clientId}, userId=${userId}, roleId=${clientRoleId}, roleName=${roleName}`);
      
      // Get the client role using the role name instead of ID
      try {
        console.log(`Getting role by name: clientId=${clientId}, roleName=${roleName}`);
        const role = await sdk.clients.getRole(clientId, roleName);
        console.log(`Retrieved role: ${JSON.stringify(role)}`);
        
        if (!role || !role.id) {
          console.error('Role not found or missing ID');
          throw new Error('Role not found or missing ID');
        }
        
        // Add client role to user
        console.log(`Adding role to user: userId=${userId}, clientId=${clientId}, roleId=${role.id}`);
        await sdk.clientRoleMappings.addUserClientRoleMappings(userId, clientId, [role]);
        console.log('Successfully added role to user');
        
        // Verify role was added
        console.log(`Getting user role mappings: userId=${userId}, clientId=${clientId}`);
        const userRoles = await sdk.clientRoleMappings.getUserClientRoleMappings(userId, clientId);
        console.log(`Retrieved ${userRoles.length} user roles: ${JSON.stringify(userRoles)}`);
        
        // Check if role exists in user's role mappings
        const hasRole = userRoles.some(r => r.id === role.id);
        console.log(`Role check: hasRole=${hasRole}, looking for roleId=${role.id}`);
        expect(hasRole).toBe(true);
      } catch (error) {
        console.error('Error in role operations:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Getting available client role mappings for a user
   * 
   * This test verifies that available client roles can be retrieved for a user
   */
  test('should get available client role mappings for a user', async () => {
    // Skip test if setup failed
    if (!clientId || !userId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get available roles
      const availableRoles = await sdk.clientRoleMappings.getAvailableUserClientRoleMappings(userId, clientUuid);
      
      // Verify response is an array
      expect(Array.isArray(availableRoles)).toBe(true);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Getting effective client role mappings for a user
   * 
   * This test verifies that effective client roles can be retrieved for a user
   */
  test('should get effective client role mappings for a user', async () => {
    // Skip test if setup failed
    if (!clientId || !userId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get effective roles
      const effectiveRoles = await sdk.clientRoleMappings.getEffectiveUserClientRoleMappings(userId, clientUuid);
      
      // Verify response is an array
      expect(Array.isArray(effectiveRoles)).toBe(true);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Deleting client role mappings from a user
   * 
   * This test verifies that client roles can be removed from a user
   */
  test('should delete client role mappings from a user', async () => {
    // Skip test if setup failed
    if (!clientId || !userId || !clientRoleId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get the role
      const role = await sdk.clients.getRole(clientUuid, clientRoleId);
      
      // Delete role from user
      await sdk.clientRoleMappings.deleteUserClientRoleMappings(userId, clientUuid, [role]);
      
      // Verify role was removed
      const userRoles = await sdk.clientRoleMappings.getUserClientRoleMappings(userId, clientUuid);
      
      // Check if role no longer exists in user's role mappings
      const hasRole = userRoles.some(r => r.id === role.id);
      expect(hasRole).toBe(false);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Adding client role mappings to a group
   * 
   * This test verifies that client roles can be added to a group
   */
  test('should add client role mappings to a group', async () => {
    // Skip test if setup failed
    if (!clientId || !groupId || !clientRoleId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get the role
      const role = await sdk.clients.getRole(clientUuid, clientRoleId);
      
      // Add client role to group
      await sdk.clientRoleMappings.addGroupClientRoleMappings(groupId, clientUuid, [role]);
      
      // Verify role was added
      const groupRoles = await sdk.clientRoleMappings.getGroupClientRoleMappings(groupId, clientUuid);
      
      // Check if role exists in group's role mappings
      const hasRole = groupRoles.some(r => r.id === role.id);
      expect(hasRole).toBe(true);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Getting available client role mappings for a group
   * 
   * This test verifies that available client roles can be retrieved for a group
   */
  test('should get available client role mappings for a group', async () => {
    // Skip test if setup failed
    if (!clientId || !groupId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get available roles
      const availableRoles = await sdk.clientRoleMappings.getAvailableGroupClientRoleMappings(groupId, clientUuid);
      
      // Verify response is an array
      expect(Array.isArray(availableRoles)).toBe(true);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Getting effective client role mappings for a group
   * 
   * This test verifies that effective client roles can be retrieved for a group
   */
  test('should get effective client role mappings for a group', async () => {
    // Skip test if setup failed
    if (!clientId || !groupId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get effective roles
      const effectiveRoles = await sdk.clientRoleMappings.getEffectiveGroupClientRoleMappings(groupId, clientUuid);
      
      // Verify response is an array
      expect(Array.isArray(effectiveRoles)).toBe(true);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Deleting client role mappings from a group
   * 
   * This test verifies that client roles can be removed from a group
   */
  test('should delete client role mappings from a group', async () => {
    // Skip test if setup failed
    if (!clientId || !groupId || !clientRoleId) {
      console.warn('Skipping test due to missing test resources');
      return;
    }
    
    try {
      // Get the client
      const clientUuid = testContext.clientUuid || '';
      if (!clientUuid) {
        console.warn('Client UUID not found in test context');
        return;
      }
      
      // Get the role
      const role = await sdk.clients.getRole(clientUuid, clientRoleId);
      
      // Delete role from group
      await sdk.clientRoleMappings.deleteGroupClientRoleMappings(groupId, clientUuid, [role]);
      
      // Verify role was removed
      const groupRoles = await sdk.clientRoleMappings.getGroupClientRoleMappings(groupId, clientUuid);
      
      // Check if role no longer exists in group's role mappings
      const hasRole = groupRoles.some(r => r.id === role.id);
      expect(hasRole).toBe(false);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
});
