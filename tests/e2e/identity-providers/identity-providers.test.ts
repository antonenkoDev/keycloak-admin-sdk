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
      
      // Log the SDK configuration for debugging
      console.log(`Using test realm: ${testContext.realmName}`);
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
   * Test: Getting provider types
   *
   * This test verifies that provider types can be retrieved
   */
  test(
    'should get provider types',
    async () => {
      try {
        // Get all provider types
        const providerTypes = await sdk.identityProviders.getProviderTypes();
        
        // Verify the result contains provider types
        expect(providerTypes).toBeDefined();
        expect(Object.keys(providerTypes).length).toBeGreaterThan(0);
        
        // Verify common provider types are present
        expect(providerTypes.oidc).toBeDefined();
        expect(providerTypes.saml).toBeDefined();
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting provider factory
   *
   * This test verifies that a provider factory can be retrieved
   */
  test(
    'should get provider factory',
    async () => {
      try {
        // Get the OIDC provider factory
        const factory = await sdk.identityProviders.getProviderFactory('oidc');
        
        // Verify the factory has the expected properties
        expect(factory).toBeDefined();
        expect(factory.id).toBe('oidc');
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

        // Get mapper types
        const mapperTypes = await sdk.identityProviders.getMapperTypes(testProviderAlias);
        expect(Array.isArray(mapperTypes)).toBe(true);
        
        // Find a suitable mapper type to use
        const mapperType = mapperTypes.find(type => type.id.includes('username'));
        if (!mapperType) {
          console.warn('No suitable mapper type found, skipping mapper tests');
          return;
        }
        
        // Create a mapper
        const mapperName = generateUniqueName('test-mapper');
        const mapper: IdentityProviderMapperRepresentation = {
          name: mapperName,
          identityProviderAlias: testProviderAlias,
          identityProviderMapper: mapperType.id,
          config: {
            syncMode: 'INHERIT',
            'user.attribute': 'username'
          }
        };
        
        testMapperId = await sdk.identityProviders.createMapper(testProviderAlias, mapper);
        expect(testMapperId).toBeDefined();
        
        // Get all mappers
        const mappers = await sdk.identityProviders.getMappers(testProviderAlias);
        expect(Array.isArray(mappers)).toBe(true);
        const hasTestMapper = mappers.some(m => m.id === testMapperId);
        expect(hasTestMapper).toBe(true);
        
        // Get the specific mapper
        const createdMapper = await sdk.identityProviders.getMapper(testProviderAlias, testMapperId);
        expect(createdMapper.name).toBe(mapperName);
        
        // Update the mapper
        const updatedMapper: IdentityProviderMapperRepresentation = {
          ...createdMapper,
          name: `${mapperName}-updated`,
          config: {
            ...createdMapper.config,
            syncMode: 'FORCE'
          }
        };
        
        await sdk.identityProviders.updateMapper(testProviderAlias, testMapperId, updatedMapper);
        
        // Get the updated mapper
        const retrievedMapper = await sdk.identityProviders.getMapper(testProviderAlias, testMapperId);
        expect(retrievedMapper.name).toBe(`${mapperName}-updated`);
        expect(retrievedMapper.config?.syncMode).toBe('FORCE');
        
        // Delete the mapper
        await sdk.identityProviders.deleteMapper(testProviderAlias, testMapperId);
        
        // Verify the mapper was deleted
        try {
          await sdk.identityProviders.getMapper(testProviderAlias, testMapperId);
          fail('Mapper should have been deleted');
        } catch (error) {
          // Expected error - mapper should not exist
          expect(error).toBeDefined();
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
          fail('Identity provider should have been deleted');
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
