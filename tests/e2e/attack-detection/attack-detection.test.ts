/**
 * End-to-End Tests for Attack Detection API
 *
 * Tests the functionality of the Attack Detection API against a running Keycloak instance.
 * Following SOLID principles and clean code practices.
 */

import {
  cleanupTestEnvironment,
  generateUniqueName,
  setupTestEnvironment,
  TEST_TIMEOUT,
  TestContext
} from '../utils/test-setup';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';

describe('Attack Detection API E2E Tests', () => {
  let testContext: TestContext;
  let testUserId: string | undefined;

  // Setup test environment before all tests
  beforeAll(async () => {
    try {
      testContext = await setupTestEnvironment();

      // Create a test user
      const username = generateUniqueName('test-user');
      testUserId = await testContext.sdk.users.create({
        username,
        enabled: true,
        email: `${username}@example.com`,
        credentials: [
          {
            type: 'password',
            value: 'test123',
            temporary: false
          }
        ]
      });
    } catch (error) {
      console.error(
        `Error in test setup: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test user
      if (testUserId) {
        try {
          await testContext.sdk.users.delete(testUserId);
        } catch (error) {
          console.error(
            `Error deleting test user: ${error instanceof Error ? error.message : String(error)}`
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
   * Test getting brute force status for a user
   */
  test('should get brute force status for a user', async () => {
    // Skip test if required resources are not available
    if (!testUserId) {
      throw new Error('Required test resources are not defined');
    }

    try {
      // Get brute force status for the user
      const status = await testContext.sdk.attackDetection.getBruteForceStatusForUser(testUserId);

      // Verify the structure of the status object
      expect(status).toBeDefined();
      expect(typeof status.numFailures).toBe('number');
      expect(typeof status.disabled).toBe('boolean');

      // Initially, there should be no failures
      expect(status.numFailures).toBe(0);
      expect(status.disabled).toBe(false);
    } catch (error) {
      console.error(
        `Error testing brute force status: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test clearing brute force attempts for a user
   */
  test('should clear brute force attempts for a user', async () => {
    // Skip test if required resources are not available
    if (!testUserId) {
      throw new Error('Required test resources are not defined');
    }

    try {
      // Clear brute force attempts for the user
      await testContext.sdk.attackDetection.clearBruteForceForUser(testUserId);

      // Get brute force status after clearing
      const status = await testContext.sdk.attackDetection.getBruteForceStatusForUser(testUserId);

      // Verify the status after clearing
      expect(status.numFailures).toBe(0);
      expect(status.disabled).toBe(false);
    } catch (error) {
      console.error(
        `Error testing clear brute force for user: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test clearing all brute force attempts
   */
  test('should clear all brute force attempts', async () => {
    try {
      // Clear all brute force attempts
      await testContext.sdk.attackDetection.clearAllBruteForce();

      // If we got here without an error, the test passes
      expect(true).toBe(true);
    } catch (error) {
      console.error(
        `Error testing clear all brute force: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });
});
