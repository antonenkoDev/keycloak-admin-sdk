/**
 * End-to-end tests for the Client Role Mappings API
 *
 * These tests verify that the Client Role Mappings API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 */

import KeycloakClient from '../../../src';
import { RoleRepresentation } from '../../../src/types/roles';
import {
  cleanupTestEnvironment,
  createTestGroup,
  createTestUser,
  setupTestEnvironment,
  TestContext
} from '../utils/test-setup'; // Test timeout - using environment variable with fallback

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Client Role Mappings API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakClient;
  let userId: string;
  let groupId: string;
  let clientId: string;
  let clientRoleId: string;
  let roleName: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;

      // Explicitly create a test client for role mappings tests
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

      if (groupId) {
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
  test(
    'should add client role mappings to a user',
    async () => {
      // Skip test if setup failed
      if (!clientId || !userId || !clientRoleId || !roleName) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client role using the role name instead of ID
        try {
          const role = await sdk.clients.getRole(clientId, roleName);

          if (!role || !role.id) {
            console.error('Role not found or missing ID');
            throw new Error('Role not found or missing ID');
          }

          // Add client role to user

          await sdk.clients.clientRoleMappings.addUserClientRoleMappings(userId, clientId, [role]);

          // Verify role was added

          const userRoles = await sdk.clients.clientRoleMappings.getUserClientRoleMappings(
            userId,
            clientId
          );

          // Check if role exists in user's role mappings
          const hasRole = userRoles.some(r => r.id === role.id);

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
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting available client role mappings for a user
   *
   * This test verifies that available client roles can be retrieved for a user
   */
  test(
    'should get available client role mappings for a user',
    async () => {
      // Skip test if setup failed
      if (!clientId || !userId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Get available roles
        const availableRoles =
          await sdk.clients.clientRoleMappings.getAvailableUserClientRoleMappings(userId, clientId);

        // Verify response is an array
        expect(Array.isArray(availableRoles)).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting effective client role mappings for a user
   *
   * This test verifies that effective client roles can be retrieved for a user
   */
  test(
    'should get effective client role mappings for a user',
    async () => {
      // Skip test if setup failed
      if (!clientId || !userId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Get effective roles
        const effectiveRoles =
          await sdk.clients.clientRoleMappings.getEffectiveUserClientRoleMappings(userId, clientId);

        // Verify response is an array
        expect(Array.isArray(effectiveRoles)).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Deleting client role mappings from a user
   *
   * This test verifies that client roles can be removed from a user
   */
  test(
    'should delete client role mappings from a user',
    async () => {
      // Skip test if setup failed
      if (!clientId || !userId || !clientRoleId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Create the test role
        const roleRepresentation: RoleRepresentation = {
          name: 'test-role',
          description: 'Test role for client role mappings tests',
          clientRole: true
        };
        await sdk.clients.createRole(clientId, roleRepresentation);
        const role = await sdk.clients.getRole(clientId, 'test-role');
        // Delete role from user
        await sdk.clients.clientRoleMappings.deleteUserClientRoleMappings(userId, clientId, [role]);

        // Verify role was removed
        const userRoles = await sdk.clients.clientRoleMappings.getUserClientRoleMappings(
          userId,
          clientId
        );

        // Check if role no longer exists in user's role mappings
        const hasRole = userRoles.some(r => r.id === role.id);
        expect(hasRole).toBe(false);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Adding client role mappings to a group
   *
   * This test verifies that client roles can be added to a group
   */
  test(
    'should add client role mappings to a group',
    async () => {
      // Skip test if setup failed
      if (!clientId || !groupId || !clientRoleId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Create a group role
        const roleRepresentation: RoleRepresentation = {
          name: 'group-role',
          description: 'Test role for client role mappings tests',
          clientRole: true
        };
        await sdk.clients.createRole(clientId, roleRepresentation);
        const role = await sdk.clients.getRole(clientId, 'group-role');

        // Add client role to group
        await sdk.clients.clientRoleMappings.addGroupClientRoleMappings(groupId, clientId, [role]);

        // Verify role was added
        const groupRoles = await sdk.clients.clientRoleMappings.getGroupClientRoleMappings(
          groupId,
          clientId
        );

        // Check if role exists in group's role mappings
        const hasRole = groupRoles.some(r => r.id === role.id);
        expect(hasRole).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting available client role mappings for a group
   *
   * This test verifies that available client roles can be retrieved for a group
   */
  test(
    'should get available client role mappings for a group',
    async () => {
      // Skip test if setup failed
      if (!clientId || !groupId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Get available roles
        const availableRoles =
          await sdk.clients.clientRoleMappings.getAvailableGroupClientRoleMappings(
            groupId,
            clientId
          );

        // Verify response is an array
        expect(Array.isArray(availableRoles)).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting effective client role mappings for a group
   *
   * This test verifies that effective client roles can be retrieved for a group
   */
  test(
    'should get effective client role mappings for a group',
    async () => {
      // Skip test if setup failed
      if (!clientId || !groupId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Get effective roles
        const effectiveRoles =
          await sdk.clients.clientRoleMappings.getEffectiveGroupClientRoleMappings(
            groupId,
            clientId
          );

        // Verify response is an array
        expect(Array.isArray(effectiveRoles)).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Deleting client role mappings from a group
   *
   * This test verifies that client roles can be removed from a group
   */
  test(
    'should delete client role mappings from a group',
    async () => {
      // Skip test if setup failed
      if (!clientId || !groupId || !clientRoleId) {
        throw new Error('Missing test resources');
      }

      try {
        // Get the client
        const clientId = testContext.clientId || '';
        if (!clientId) {
          throw new Error('Client ID not found in test context');
        }

        // Get the group role
        const role = await sdk.clients.getRole(clientId, 'group-role');

        // Delete role from group
        await sdk.clients.clientRoleMappings.deleteGroupClientRoleMappings(groupId, clientId, [
          role
        ]);

        // Verify role was removed
        const groupRoles = await sdk.clients.clientRoleMappings.getGroupClientRoleMappings(
          groupId,
          clientId
        );

        // Check if role no longer exists in group's role mappings
        const hasRole = groupRoles.some(r => r.id === role.id);
        expect(hasRole).toBe(false);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );
});
