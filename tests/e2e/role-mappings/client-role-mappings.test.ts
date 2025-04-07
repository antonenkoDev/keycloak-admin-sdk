/**
 * End-to-End Tests for Client Role Mappings API
 *
 * Tests the functionality of the Client Role Mappings API against a running Keycloak instance
 */

import {
  cleanupTestEnvironment,
  createTestClient,
  generateUniqueName,
  setupTestEnvironment,
  TEST_TIMEOUT,
  TestContext
} from '../utils/test-setup';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

describe('Client Role Mappings API E2E Tests', () => {
  let testContext: TestContext;
  let testClientId: string | undefined;
  let testUserId: string | undefined;
  let testGroupId: string | undefined;
  let testRoleId: string | undefined;
  let testRoleName: string | undefined;

  // Setup test environment before all tests
  beforeAll(async () => {
    try {
      testContext = await setupTestEnvironment();

      // Create test client
      testContext = await createTestClient(testContext);
      testClientId = testContext.clientId;

      if (!testClientId) {
        throw new Error('Test client was not created properly');
      }

      // Create a test user
      const username = generateUniqueName('test-user');
      testUserId = await testContext.sdk.users.create({
        username,
        enabled: true,
        email: `${username}@example.com`
      });

      // Create a test group
      const groupName = generateUniqueName('test-group');
      testGroupId = await testContext.sdk.groups.create({
        name: groupName
      });

      // Create a client role
      testRoleName = generateUniqueName('test-role');
      await testContext.sdk.clients.createRole(testClientId, {
        name: testRoleName,
        description: 'Test role for client role mappings'
      });

      // Get the role ID
      const roles = await testContext.sdk.clients.listRoles(testClientId);
      const role = roles.find(r => r.name === testRoleName);
      testRoleId = role?.id;
    } catch (error) {
      console.error(
        `Error in test setup: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test resources
      if (testClientId && testRoleName) {
        try {
          await testContext.sdk.clients.deleteRole(testClientId, testRoleName);
        } catch (error) {
          console.error(
            `Error deleting test role: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      if (testUserId) {
        try {
          await testContext.sdk.users.delete(testUserId);
        } catch (error) {
          console.error(
            `Error deleting test user: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      if (testGroupId) {
        try {
          await testContext.sdk.groups.delete(testGroupId);
        } catch (error) {
          console.error(
            `Error deleting test group: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      // Clean up test environment
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error(
        `Error in test cleanup: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, TEST_TIMEOUT);

  /**
   * Test adding client role mappings to a user
   */
  test('should add client role mappings to a user', async () => {
    // Skip test if required resources are not available
    if (!testClientId || !testUserId || !testRoleId) {
      throw new Error('Required test resources are not defined');
    }

    try {
      // Get the role
      const roles = await testContext.sdk.clients.listRoles(testClientId);
      const role = roles.find(r => r.name === testRoleName);

      if (!role) {
        throw new Error('Test role not found');
      }

      // Create client role mappings for the user
      const userRoleMappings = testContext.sdk.roleMappings.forClientRoleMappingsUser();

      // Add the role to the user
      await userRoleMappings.addClientRoleMappings(testUserId, testClientId, [role]);

      // Get the user's client role mappings
      const userMappings = await userRoleMappings.getClientRoleMappings(testUserId, testClientId);

      // Verify that the role was added to the user
      expect(userMappings).toBeDefined();
      expect(Array.isArray(userMappings)).toBe(true);
      const userHasRole = userMappings.some(r => r.name === testRoleName);
      expect(userHasRole).toBe(true);

      // Remove the role from the user
      await userRoleMappings.deleteClientRoleMappings(testUserId, testClientId, [role]);

      // Verify that the role was removed
      const userMappingsAfterRemove = await userRoleMappings.getClientRoleMappings(
        testUserId,
        testClientId
      );
      const userStillHasRole = userMappingsAfterRemove.some(r => r.name === testRoleName);
      expect(userStillHasRole).toBe(false);
    } catch (error) {
      console.error(
        `Error testing user client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test adding client role mappings to a group
   */
  test('should add client role mappings to a group', async () => {
    // Skip test if required resources are not available
    if (!testClientId || !testGroupId || !testRoleId) {
      throw new Error('Required test resources are not defined');
    }

    try {
      // Get the role
      const roles = await testContext.sdk.clients.listRoles(testClientId);
      const role = roles.find(r => r.name === testRoleName);

      if (!role) {
        throw new Error('Test role not found');
      }

      // Create client role mappings for the group
      const groupRoleMappings = testContext.sdk.roleMappings.forClientRoleMappingsGroup();

      // Add the role to the group
      await groupRoleMappings.addClientRoleMappings(testGroupId, testClientId, [role]);

      // Get the group's client role mappings
      const groupMappings = await groupRoleMappings.getClientRoleMappings(
        testGroupId,
        testClientId
      );

      // Verify that the role was added to the group
      expect(groupMappings).toBeDefined();
      expect(Array.isArray(groupMappings)).toBe(true);
      const groupHasRole = groupMappings.some(r => r.name === testRoleName);
      expect(groupHasRole).toBe(true);

      // Remove the role from the group
      await groupRoleMappings.deleteClientRoleMappings(testGroupId, testClientId, [role]);

      // Verify that the role was removed
      const groupMappingsAfterRemove = await groupRoleMappings.getClientRoleMappings(
        testGroupId,
        testClientId
      );
      const groupStillHasRole = groupMappingsAfterRemove.some(r => r.name === testRoleName);
      expect(groupStillHasRole).toBe(false);
    } catch (error) {
      console.error(
        `Error testing group client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });
});
