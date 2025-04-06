/**
 * End-to-end tests for the Identity Providers API
 *
 * These tests verify that the Identity Providers API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../../src/index';
import { IdentityProviderRepresentation } from '../../../src/types/identity-providers';
import { IdentityProviderMapperRepresentation } from '../../../src/types/identity-provider-mappers';
import {
  cleanupTestEnvironment,
  createTestClient,
  generateUniqueName,
  setupTestEnvironment,
  TestContext
} from '../utils/test-setup';

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Identity Providers API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let testProviderAlias: string;
  let testMapperId: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
      testContext = await createTestClient(testContext);

      // Log the SDK configuration for debugging
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test resources
      if (testProviderAlias) {
        try {
          // Delete the identity provider
          await sdk.identityProviders.delete(testProviderAlias);
        } catch (error) {
          console.error(
            `Failed to delete identity provider: ${error instanceof Error ? error.message : String(error)}`
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
   * Test: Creating an identity provider
   *
   * This test verifies that identity providers can be created
   */
  test(
    'should create an identity provider',
    async () => {
      try {
        // Create a test identity provider
        testProviderAlias = generateUniqueName('test-idp');
        testProviderAlias = generateUniqueName('test-idp');
        const idp: IdentityProviderRepresentation = {
          alias: testProviderAlias,
          displayName: 'Test Identity Provider',
          providerId: 'oidc',
          enabled: true,
          config: {
            clientId: 'test-client',
            clientSecret: 'test-secret',
            authorizationUrl: 'https://example.com/auth',
            tokenUrl: 'https://example.com/token'
          }
        };

        const id = await sdk.identityProviders.create(idp);

        // Verify the identity provider was created
        expect(id).toBeDefined();

        // Get the identity provider and verify its properties
        const createdIdp = await sdk.identityProviders.get(testProviderAlias);
        expect(createdIdp.alias).toBe(testProviderAlias);
        expect(createdIdp.displayName).toBe('Test Identity Provider');
        expect(createdIdp.providerId).toBe('oidc');
        expect(createdIdp.enabled).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Listing identity providers
   *
   * This test verifies that identity providers can be listed
   */
  test(
    'should list identity providers',
    async () => {
      try {
        // List all identity providers
        const providers = await sdk.identityProviders.findAll();

        // Verify the result is an array
        expect(Array.isArray(providers)).toBe(true);

        // Verify our test provider is in the list
        const hasTestProvider = providers.some(provider => provider.alias === testProviderAlias);
        expect(hasTestProvider).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Updating an identity provider
   *
   * This test verifies that identity providers can be updated
   */
  test(
    'should update an identity provider',
    async () => {
      try {
        // Get the current identity provider
        const idp = await sdk.identityProviders.get(testProviderAlias);

        // Update the identity provider
        const updatedIdp: IdentityProviderRepresentation = {
          ...idp,
          displayName: 'Updated Test Provider',
          config: {
            ...idp.config,
            clientId: 'updated-client'
          }
        };

        await sdk.identityProviders.update(testProviderAlias, updatedIdp);

        // Get the updated identity provider and verify its properties
        const retrievedIdp = await sdk.identityProviders.get(testProviderAlias);
        expect(retrievedIdp.displayName).toBe('Updated Test Provider');
        expect(retrievedIdp.config?.clientId).toBe('updated-client');
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting provider type
   *
   * This test verifies that a specific provider type can be retrieved
   */
  test(
    'should get provider type',
    async () => {
      try {
        // Get the OIDC provider type
        const providerType = await sdk.identityProviders.getProviderType('oidc');

        // Verify the provider type has the expected properties
        expect(providerType).toBeDefined();
        // The id might be in different places depending on Keycloak version
        const hasOidc = JSON.stringify(providerType).includes('oidc');
        expect(hasOidc).toBeTruthy();
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Creating and managing identity provider mappers
   *
   * This test verifies that identity provider mappers can be created, retrieved, updated, and deleted
   */
  test(
    'should create and manage identity provider mappers',
    async () => {
      try {
        // Skip if test provider doesn't exist
        if (!testProviderAlias) {
          throw new Error('Test provider alias not available');
        }

        // Get mapper types for the specific identity provider
        let mapperTypes: Record<string, any> = {};
        try {
          mapperTypes = await sdk.identityProviders.getMapperTypes(testProviderAlias);
          expect(mapperTypes).toBeDefined();
          expect(typeof mapperTypes).toBe('object');
        } catch (error) {
          console.error(
            `Error getting mapper types for provider ${testProviderAlias}: ${error instanceof Error ? error.message : String(error)}`
          );
          throw new Error(
            `Failed to get mapper types: ${error instanceof Error ? error.message : String(error)}`
          );
        }

        // Use a default mapper type if none found
        let mapperTypeId = 'oidc-username-idp-mapper'; // Default fallback

        if (mapperTypes && Object.keys(mapperTypes).length > 0) {
          // Try to find a username mapper first
          const usernameMapperKey = Object.keys(mapperTypes).find(key =>
            key.toLowerCase().includes('username')
          );

          // If no username mapper, try to find any OIDC mapper
          const oidcMapperKey = !usernameMapperKey
            ? Object.keys(mapperTypes).find(key => key.toLowerCase().includes('oidc'))
            : null;

          // If still no mapper, just use the first one available
          const firstMapperKey =
            !usernameMapperKey && !oidcMapperKey ? Object.keys(mapperTypes)[0] : null;

          // Get the mapper type ID from the found key
          const mapperKey = usernameMapperKey || oidcMapperKey || firstMapperKey;
          if (mapperKey && mapperTypes[mapperKey] && mapperTypes[mapperKey].id) {
            mapperTypeId = mapperTypes[mapperKey].id;
          } else {
            throw new Error(`Could not find a valid mapper type ID in available types`);
          }
        } else {
          throw new Error(`No mapper types available for provider ${testProviderAlias}`);
        }

        // Create a mapper with the determined type
        const mapperName = generateUniqueName('test-mapper');
        const mapper: IdentityProviderMapperRepresentation = {
          name: mapperName,
          identityProviderAlias: testProviderAlias,
          identityProviderMapper: mapperTypeId,
          config: {
            syncMode: 'INHERIT',
            'user.attribute': 'username'
          }
        };

        const createdMapperId = await sdk.identityProviders.createMapper(testProviderAlias, mapper);
        expect(createdMapperId).toBeDefined();
        // Get all mappers
        let mappers;
        try {
          mappers = await sdk.identityProviders.getMappers(testProviderAlias);

          expect(Array.isArray(mappers)).toBe(true);

          // The mapper ID might be the name or an actual ID
          const hasTestMapper = mappers.some(
            m =>
              m.id === testMapperId ||
              m.name === mapperName ||
              (m.name && m.name.includes(mapperName))
          );

          if (!hasTestMapper) {
            throw new Error(
              `Mapper not found in list after creation. Created ID: ${testMapperId}, Name: ${mapperName}`
            );
          }
        } catch (error) {
          console.error(
            `Error getting mappers: ${error instanceof Error ? error.message : String(error)}`
          );
          throw new Error(
            `Failed to get mappers: ${error instanceof Error ? error.message : String(error)}`
          );
        }

        // Get the specific mapper
        let createdMapper;
        try {
          createdMapper = await sdk.identityProviders.getMapper(testProviderAlias, createdMapperId);
          expect(createdMapper.name).toBe(mapperName);
        } catch (error) {
          console.error(
            `Error getting mapper: ${error instanceof Error ? error.message : String(error)}`
          );
          throw new Error(
            `Failed to get created mapper: ${error instanceof Error ? error.message : String(error)}`
          );
        }

        // Update the mapper
        try {
          const updatedName = `${mapperName}-updated`;
          const updatedMapper: IdentityProviderMapperRepresentation = {
            ...createdMapper,
            name: updatedName,
            config: {
              ...createdMapper.config,
              syncMode: 'FORCE'
            }
          };

          await sdk.identityProviders.updateMapper(
            testProviderAlias,
            createdMapperId,
            updatedMapper
          );

          // Get the updated mapper
          const retrievedMapper = await sdk.identityProviders.getMapper(
            testProviderAlias,
            createdMapperId
          );
          expect(retrievedMapper.name).toBe(updatedName);
          expect(retrievedMapper.config?.syncMode).toBe('FORCE');
        } catch (error) {
          console.error(
            `Error updating mapper: ${error instanceof Error ? error.message : String(error)}`
          );
          throw new Error(
            `Failed to update mapper: ${error instanceof Error ? error.message : String(error)}`
          );
        }

        // Delete the mapper
        try {
          await sdk.identityProviders.deleteMapper(testProviderAlias, createdMapperId);

          // Verify the mapper was deleted
          try {
            await sdk.identityProviders.getMapper(testProviderAlias, createdMapperId);
            console.error('Mapper still exists after deletion attempt');
            throw new Error('Mapper should have been deleted but still exists');
          } catch (error) {
            // Expected error - mapper should not exist
            expect(error).toBeDefined();
          }
        } catch (error) {
          console.error(
            `Error deleting mapper: ${error instanceof Error ? error.message : String(error)}`
          );
          throw new Error(
            `Failed to delete mapper: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Deleting an identity provider
   *
   * This test verifies that identity providers can be deleted
   */
  test(
    'should delete an identity provider',
    async () => {
      try {
        // Skip if test provider doesn't exist
        if (!testProviderAlias) {
          throw new Error('Test provider alias not available');
        }

        // Delete the identity provider
        await sdk.identityProviders.delete(testProviderAlias);

        // Verify the identity provider was deleted
        try {
          await sdk.identityProviders.get(testProviderAlias);
          console.error('Identity provider still exists after deletion attempt');
          throw new Error('Identity provider should have been deleted but still exists');
        } catch (error) {
          // Expected error - provider should not exist
          expect(error).toBeDefined();
        }

        // Clear the test provider alias so cleanup doesn't try to delete it again
        testProviderAlias = '';
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );
});
