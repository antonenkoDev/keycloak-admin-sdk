/**
 * E2E tests for the Keys API
 */
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import KeycloakAdminSDK from '../../../src';
import { setupTestEnvironment, cleanupTestEnvironment, TestContext } from '../utils/test-setup';
import { KeysMetadataRepresentation } from '../../../src/types/keys';

describe('Keys API', () => {
  let context: TestContext;
  let sdk: KeycloakAdminSDK;

  // Setup test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm and client
      context = await setupTestEnvironment();
      sdk = context.sdk;
    } catch (error) {
      throw new Error(`Failed to setup test context: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  // Clean up after tests
  afterAll(async () => {
    try {
      await cleanupTestEnvironment(context);
    } catch (error) {
      // We don't throw here to ensure cleanup always completes
    }
  });

  /**
   * Test getting keys metadata
   */
  it('should get keys metadata', async () => {
    // Get keys metadata
    const keysMetadata: KeysMetadataRepresentation = await sdk.keys.getKeys();
    
    // Verify the response structure
    expect(keysMetadata).toBeDefined();
    expect(keysMetadata.keys).toBeDefined();
    expect(Array.isArray(keysMetadata.keys)).toBe(true);
    
    // Verify that at least one key exists
    expect(keysMetadata.keys?.length).toBeGreaterThan(0);
    
    // Verify key properties
    const firstKey = keysMetadata.keys?.[0];
    expect(firstKey).toBeDefined();
    expect(firstKey?.providerId).toBeDefined();
    expect(firstKey?.kid).toBeDefined();
    
    // Verify active keys map
    expect(keysMetadata.active).toBeDefined();
    expect(typeof keysMetadata.active).toBe('object');
  });
  
  it('should have valid key structure for all keys', async () => {
    // Get keys metadata
    const keysMetadata: KeysMetadataRepresentation = await sdk.keys.getKeys();
    
    // Verify each key has the required properties
    keysMetadata.keys?.forEach(key => {
      expect(key.kid).toBeDefined();
      expect(key.providerId).toBeDefined();
      if (key.algorithm) {
        expect(typeof key.algorithm).toBe('string');
      }
      if (key.type) {
        expect(typeof key.type).toBe('string');
      }
    });
  });
});
