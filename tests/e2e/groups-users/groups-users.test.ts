/**
 * End-to-End Tests for Groups and Users APIs
 *
 * Tests the functionality of the Groups and Users APIs against a running Keycloak instance
 * Following SOLID principles and clean code practices
 */

import {
  cleanupTestEnvironment,
  createTestClient,
  createTestGroup,
  generateUniqueName,
  setupTestEnvironment,
  TEST_TIMEOUT,
  TestContext
} from '../utils/test-setup';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { GroupRepresentation } from '../../../src/types/groups';
import { UserRepresentation } from '../../../src/types/users';

describe('Groups and Users API E2E Tests', () => {
  let testContext: TestContext;

  // Setup test environment before all tests
  beforeAll(async () => {
    // Create2 test realm and client
    testContext = await setupTestEnvironment();
    testContext = await createTestClient(testContext);

    // Initialize arrays for tracking created resources
    testContext.groupIds = testContext.groupIds || [];
    testContext.userIds = testContext.userIds || [];
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    await cleanupTestEnvironment(testContext);
  }, TEST_TIMEOUT);

  /**
   * Test creating a group
   */
  test('should create a group', async () => {
    const groupName = generateUniqueName('test-group');

    // Create a test group
    const group: GroupRepresentation = {
      name: groupName,
      attributes: {
        'test-attribute': ['test-value']
      }
    };

    // Create the group
    await testContext.sdk.groups.create(group);

    // Find the created group by name to get its ID
    const groups = await testContext.sdk.groups.list({ search: groupName });
    const createdGroup = groups.find(g => g.name === groupName);

    if (!createdGroup || !createdGroup.id) {
      throw new Error('Failed to find created group');
    }

    const groupId = createdGroup.id;

    // Add the group ID to the test context for cleanup
    if (testContext.groupIds) {
      testContext.groupIds.push(groupId);
    }

    // Verify the group was created
    expect(groupId).toBeDefined();

    // Get the created group
    const retrievedGroup = await testContext.sdk.groups.get(groupId);

    // Verify the group properties
    expect(retrievedGroup).toBeDefined();
    expect(retrievedGroup.name).toBe(groupName);
    expect(retrievedGroup.attributes?.['test-attribute']).toContain('test-value');
  });

  /**
   * Test finding all groups
   */
  test('should find all groups', async () => {
    // Find all groups
    const groups = await testContext.sdk.groups.list();

    // Verify that groups were found
    expect(groups).toBeDefined();
    expect(Array.isArray(groups)).toBe(true);

    // Verify that our test group is in the list
    const testGroup = groups.find(
      group => testContext.groupIds && group.id && testContext.groupIds.includes(group.id)
    );
    expect(testGroup).toBeDefined();
  });

  /**
   * Test updating a group
   */
  test('should update a group', async () => {
    if (!testContext.groupIds || testContext.groupIds.length === 0) {
      throw new Error('No test group available');
    }

    const groupId = testContext.groupIds[0];

    // Get the current group
    const group = await testContext.sdk.groups.get(groupId);

    // Update the group
    const updatedGroup: GroupRepresentation = {
      ...group,
      name: `${group.name}-updated`,
      attributes: {
        ...(group.attributes || {}),
        'updated-attribute': ['updated-value']
      }
    };

    // Update the group
    await testContext.sdk.groups.update(groupId, updatedGroup);

    // Get the updated group
    const retrievedGroup = await testContext.sdk.groups.get(groupId);

    // Verify the updates
    expect(retrievedGroup).toBeDefined();
    expect(retrievedGroup.name).toBe(`${group.name}-updated`);
    expect(retrievedGroup.attributes?.['updated-attribute']).toContain('updated-value');
  });

  test('should manage group permissions', async () => {
    if (!testContext.groupIds || testContext.groupIds.length === 0) {
      throw new Error('No test group available');
    }

    const groupId = testContext.groupIds[0];

    // Get the current group
    const group = await testContext.sdk.groups.get(groupId);

    // Get initial permissions
    const initialPerms = await testContext.sdk.groups.getManagementPermissions(group.id);

    // Update permissions
    const newPerms = { ...initialPerms, enabled: true };
    const updatedPerms = await testContext.sdk.groups.setManagementPermissions(group.id, newPerms);

    expect(updatedPerms.enabled).toBe(true);
  });

  test('should create a group child', async () => {
    if (!testContext.groupIds || testContext.groupIds.length === 0) {
      throw new Error('No test group available');
    }

    const groupId = testContext.groupIds[0];

    // Get the current group
    const parentGroup = await testContext.sdk.groups.get(groupId);
    const childGroup = { name: 'child-group' };

    // Create child group
    await testContext.sdk.groups.createChild(parentGroup.id, childGroup);

    // Verify hierarchy
    const children = await testContext.sdk.groups.getChildren(parentGroup.id);
    expect(children).toHaveLength(1);
    expect(children[0].name).toBe(childGroup.name);
  });

  /**
   * Test creating a user
   */
  test('should create a user', async () => {
    const username = generateUniqueName('test-user');

    let userId: string;

    try {
      // Create a test user with all required fields
      // Following SOLID principles with a focused, well-defined user object
      const user: UserRepresentation = {
        username,
        email: `${username}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: 'test-password',
            temporary: false
          }
        ]
      };

      // Create the user - the create method now returns the user ID directly
      userId = await testContext.sdk.users.create(user);

      if (!userId) {
        throw new Error('Failed to create user: no ID returned');
      }

      // Add the user ID to the test context for cleanup
      if (testContext.userIds) {
        testContext.userIds.push(userId);
      }

      // Verify the user was created
      expect(userId).toBeDefined();

      // Get the created user
      const retrievedUser = await testContext.sdk.users.get(userId);

      // Verify the user properties
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser.username).toBe(username);
      expect(retrievedUser.email).toBe(`${username}@example.com`);
      expect(retrievedUser.firstName).toBe('Test');
      expect(retrievedUser.lastName).toBe('User');
      expect(retrievedUser.enabled).toBe(true);
    } catch (error) {
      console.error(
        `Error creating user: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test finding users
   */
  test('should find users', async () => {
    if (!testContext.userIds || testContext.userIds.length === 0) {
      throw new Error('No test user available');
    }

    // Get the test user
    const userId = testContext.userIds[0];
    const user = await testContext.sdk.users.get(userId);

    // Find users by username
    const users = await testContext.sdk.users.list({ username: user.username || '' });

    // Verify that users were found
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    // Verify that our test user is in the list
    const testUser = users.find(u => u.id === userId);
    expect(testUser).toBeDefined();
    expect(testUser?.username).toBe(user.username);
  });

  /**
   * Test updating a user
   */
  test('should update a user', async () => {
    if (!testContext.userIds || testContext.userIds.length === 0) {
      throw new Error('No test user available');
    }

    const userId = testContext.userIds[0];

    // Get the current user
    const user = await testContext.sdk.users.get(userId);

    // Update the user
    const updatedUser: UserRepresentation = {
      ...user,
      firstName: 'Updated',
      lastName: 'User'
    };

    // Update the user
    await testContext.sdk.users.update(userId, updatedUser);

    // Get the updated user
    const retrievedUser = await testContext.sdk.users.get(userId);

    // Verify the basic updates
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.firstName).toBe('Updated');
    expect(retrievedUser.lastName).toBe('User');
  });

  /**
   * Test adding a user to a group
   */
  test('should add a user to a group', async () => {
    if (
      !testContext.userIds ||
      !testContext.groupIds ||
      testContext.userIds.length === 0 ||
      testContext.groupIds.length === 0
    ) {
      throw new Error('Test user or group not available');
    }

    const userId = testContext.userIds[0];
    const groupId = testContext.groupIds[0];

    // Add the user to the group
    await testContext.sdk.users.groups.add(userId, groupId);

    // Get the user's groups
    const groups = await testContext.sdk.users.groups.list(userId);

    // Verify that the user is in the group
    expect(groups).toBeDefined();
    expect(Array.isArray(groups)).toBe(true);

    const userGroup = groups.find(group => group.id === groupId);
    expect(userGroup).toBeDefined();

    // Get the group members
    const members = await testContext.sdk.groups.getMembers(groupId);

    // Verify that the group contains the user
    expect(members).toBeDefined();
    expect(Array.isArray(members)).toBe(true);

    const groupMember = members.find(member => member.id === userId);
    expect(groupMember).toBeDefined();
  });

  /**
   * Test removing a user from a group
   */
  test('should remove a user from a group', async () => {
    if (
      !testContext.userIds ||
      !testContext.groupIds ||
      testContext.userIds.length === 0 ||
      testContext.groupIds.length === 0
    ) {
      throw new Error('Test user or group not available');
    }

    const userId = testContext.userIds[0];
    const groupId = testContext.groupIds[0];

    // Remove the user from the group
    await testContext.sdk.users.groups.remove(userId, groupId);

    // Get the user's groups
    const groups = await testContext.sdk.users.groups.list(userId);

    // Verify that the user is not in the group
    expect(groups).toBeDefined();
    expect(Array.isArray(groups)).toBe(true);

    const userGroup = groups.find(group => group.id === groupId);
    expect(userGroup).toBeUndefined();

    // Get the group members
    const members = await testContext.sdk.groups.getMembers(groupId);

    // Verify that the group does not contain the user
    expect(members).toBeDefined();
    expect(Array.isArray(members)).toBe(true);

    const groupMember = members.find(member => member.id === userId);
    expect(groupMember).toBeUndefined();
  });

  test('should count groups correctly', async () => {
    if (!testContext.groupIds || testContext.groupIds.length === 0) {
      throw new Error('No test group available');
    }

    // Get the current group
    const initialCount = await testContext.sdk.groups.count();
    await createTestGroup(testContext.sdk);
    const newCount = await testContext.sdk.groups.count();
    expect(newCount).toBe(initialCount + 1);
  });

  /**
   * Test deleting a user
   */
  test('should delete a user', async () => {
    if (!testContext.userIds || testContext.userIds.length === 0) {
      throw new Error('No test user available');
    }

    // Get the last user ID (to keep the first one for other tests)
    const userId = testContext.userIds[testContext.userIds.length - 1];

    // Delete the user
    await testContext.sdk.users.delete(userId);

    // Try to get the deleted user (should throw an error)
    let userWasDeleted = false;
    try {
      await testContext.sdk.users.get(userId);
    } catch (error) {
      // Expected error, user was deleted
      userWasDeleted = true;

      expect(error).toBeDefined();
    }

    // Verify that the user was deleted
    expect(userWasDeleted).toBe(true);

    // Remove the user ID from the test context since it's been deleted
    if (testContext.userIds) {
      testContext.userIds = testContext.userIds.filter(id => id !== userId);
    }
  });

  /**
   * Test deleting a group
   */
  test('should delete a group', async () => {
    if (!testContext.groupIds || testContext.groupIds.length === 0) {
      throw new Error('No test group available');
    }

    // Get the last group ID (to keep the first one for other tests)
    const groupId = testContext.groupIds[testContext.groupIds.length - 1];

    // Delete the group
    await testContext.sdk.groups.delete(groupId);

    // Try to get the deleted group (should throw an error)
    let groupWasDeleted = false;
    try {
      await testContext.sdk.groups.get(groupId);
    } catch (error) {
      // Expected error, group was deleted
      groupWasDeleted = true;

      expect(error).toBeDefined();
    }

    // Verify that the group was deleted
    expect(groupWasDeleted).toBe(true);

    // Remove the group ID from the test context since it's been deleted
    if (testContext.groupIds) {
      testContext.groupIds = testContext.groupIds.filter(id => id !== groupId);
    }
  });
});
