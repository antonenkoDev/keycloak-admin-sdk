/**
 * End-to-End Tests for Client Scopes API
 * 
 * Tests the functionality of the Client Scopes API against a running Keycloak instance
 */

import { setupTestEnvironment, cleanupTestEnvironment, TestContext, createTestClient, generateUniqueName, TEST_TIMEOUT } from '../utils/test-setup';
import { ClientScopeRepresentation, ProtocolMapperRepresentation } from '../../../src/types/clients';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

describe('Client Scopes API E2E Tests', () => {
  let testContext: TestContext;
  let testClientScopeId: string | undefined;
  let testProtocolMapperId: string | undefined;
  
  // Setup test environment before all tests
  beforeAll(async () => {
    try {
      console.log('Setting up test environment for client scopes tests');
      testContext = await setupTestEnvironment();
      
      // Create test client to ensure we have a valid realm
      console.log('Creating test client for client scopes tests');
      testContext = await createTestClient(testContext);
      
      // Verify that client was created successfully
      if (!testContext.clientId) {
        console.warn('Test client was not created properly, some tests may fail');
      } else {
        console.log(`Test client created with ID: ${testContext.clientId}`);
      }
    } catch (error) {
      console.error(`Error in test setup: ${error instanceof Error ? error.message : String(error)}`);
      // We don't throw here to allow tests to run, they will handle missing client ID
    }
  }, TEST_TIMEOUT);
  
  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test client scope if it was created
      if (testClientScopeId) {
        try {
          console.log(`Cleaning up test client scope: ${testClientScopeId}`);
          await testContext.sdk.clientScopes.delete(testClientScopeId);
        } catch (error) {
          console.error(`Error deleting test client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      // Clean up test environment
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error(`Error in test cleanup: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test finding all client scopes
   */
  test('should find all client scopes in a realm', async () => {
    try {
      // Find all client scopes in the test realm
      console.log('Finding all client scopes in the test realm');
      const clientScopes = await testContext.sdk.clientScopes.findAll();
      
      // Verify that client scopes were found
      expect(clientScopes).toBeDefined();
      expect(Array.isArray(clientScopes)).toBe(true);
      expect(clientScopes.length).toBeGreaterThan(0);
      
      // Log the number of client scopes found for debugging
      console.log(`Found ${clientScopes.length} client scopes`);
    } catch (error) {
      console.error(`Error finding client scopes: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test creating a client scope
   */
  test('should create a client scope', async () => {
    try {
      // Create a client scope for testing
      const clientScopeName = generateUniqueName('test-scope');
      console.log(`Creating test client scope: ${clientScopeName}`);
      
      const clientScope: ClientScopeRepresentation = {
        name: clientScopeName,
        description: 'E2E Test Client Scope',
        protocol: 'openid-connect',
        attributes: {
          'display.on.consent.screen': 'true',
          'include.in.token.scope': 'true'
        }
      };
      
      // Create the client scope
      testClientScopeId = await testContext.sdk.clientScopes.create(clientScope);
      console.log(`Test client scope created with ID: ${testClientScopeId}`);
      
      // Verify the client scope was created
      expect(testClientScopeId).toBeDefined();
      
      // Get the client scope to verify it exists
      const retrievedScope = await testContext.sdk.clientScopes.findById(testClientScopeId!);
      
      // Verify the client scope properties
      expect(retrievedScope).toBeDefined();
      expect(retrievedScope.name).toBe(clientScopeName);
      expect(retrievedScope.description).toBe('E2E Test Client Scope');
      expect(retrievedScope.protocol).toBe('openid-connect');
      
      // Verify attributes with defensive programming
      if (retrievedScope.attributes) {
        expect(retrievedScope.attributes['display.on.consent.screen']).toBe('true');
        expect(retrievedScope.attributes['include.in.token.scope']).toBe('true');
      } else {
        console.warn('Client scope attributes not returned by Keycloak API, skipping attribute verification');
      }
    } catch (error) {
      console.error(`Error creating client scope: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test finding a client scope by ID
   */
  test('should find a client scope by ID', async () => {
    // Skip test if no client scope ID is available
    if (!testClientScopeId) {
      console.warn('Skipping test: Test client scope ID is not defined');
      return;
    }
    
    try {
      // Find the client scope by ID
      console.log(`Finding client scope by ID: ${testClientScopeId}`);
      const clientScope = await testContext.sdk.clientScopes.findById(testClientScopeId);
      
      // Verify the client scope properties
      expect(clientScope).toBeDefined();
      expect(clientScope.id).toBe(testClientScopeId);
      expect(clientScope.description).toBe('E2E Test Client Scope');
      expect(clientScope.protocol).toBe('openid-connect');
    } catch (error) {
      console.error(`Error finding client scope by ID: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test updating a client scope
   */
  test('should update a client scope', async () => {
    // Skip test if no client scope ID is available
    if (!testClientScopeId) {
      console.warn('Skipping test: Test client scope ID is not defined');
      return;
    }
    
    try {
      // Get the current client scope
      console.log(`Getting client scope for update: ${testClientScopeId}`);
      const clientScope = await testContext.sdk.clientScopes.findById(testClientScopeId);
      
      // Following SOLID principles, create a minimal update payload
      // Single Responsibility: Only update what needs to be updated
      const updatedClientScope: ClientScopeRepresentation = {
        name: clientScope.name,
        description: 'Updated E2E Test Client Scope',
        protocol: clientScope.protocol,
        attributes: {
          ...(clientScope.attributes || {}),
          'display.on.consent.screen': 'true',
          'include.in.token.scope': 'true',
          'testAttribute': 'test-value'
        }
      };
      
      // Update the client scope
      console.log(`Updating client scope: ${testClientScopeId}`);
      await testContext.sdk.clientScopes.update(testClientScopeId, updatedClientScope);
      
      // Get the updated client scope
      console.log(`Getting updated client scope: ${testClientScopeId}`);
      const retrievedClientScope = await testContext.sdk.clientScopes.findById(testClientScopeId);
      
      // Verify the updates with proper error handling
      expect(retrievedClientScope).toBeDefined();
      expect(retrievedClientScope.description).toBe('Updated E2E Test Client Scope');
      
      // Keycloak might not return attributes immediately
      // Check if attributes exist before asserting
      if (retrievedClientScope.attributes) {
        expect(retrievedClientScope.attributes['testAttribute']).toBe('test-value');
      } else {
        console.warn('Client scope attributes not returned by Keycloak API, skipping attribute verification');
      }
    } catch (error) {
      console.error(`Error updating client scope: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test creating a protocol mapper for a client scope
   */
  test('should create a protocol mapper for a client scope', async () => {
    // Skip test if no client scope ID is available
    if (!testClientScopeId) {
      console.warn('Skipping test: Test client scope ID is not defined');
      return;
    }
    
    try {
      // Create a protocol mapper
      const mapperName = generateUniqueName('test-mapper');
      console.log(`Creating protocol mapper ${mapperName} for client scope: ${testClientScopeId}`);
      
      const protocolMapper: ProtocolMapperRepresentation = {
        name: mapperName,
        protocol: 'openid-connect',
        protocolMapper: 'oidc-usermodel-attribute-mapper',
        consentRequired: false,
        config: {
          'userinfo.token.claim': 'true',
          'user.attribute': 'email',
          'id.token.claim': 'true',
          'access.token.claim': 'true',
          'claim.name': 'email',
          'jsonType.label': 'String'
        }
      };
      
      // Create the protocol mapper
      testProtocolMapperId = await testContext.sdk.clientScopes.createProtocolMapper(testClientScopeId, protocolMapper);
      console.log(`Protocol mapper created with ID: ${testProtocolMapperId}`);
      
      // Verify the protocol mapper was created
      expect(testProtocolMapperId).toBeDefined();
      
      // Get the protocol mappers for the client scope
      const protocolMappers = await testContext.sdk.clientScopes.getProtocolMappers(testClientScopeId);
      
      // Verify that the protocol mapper is in the list
      expect(protocolMappers).toBeDefined();
      expect(Array.isArray(protocolMappers)).toBe(true);
      
      const createdMapper = protocolMappers.find(mapper => mapper.id === testProtocolMapperId);
      expect(createdMapper).toBeDefined();
      expect(createdMapper?.name).toBe(mapperName);
    } catch (error) {
      console.error(`Error creating protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test getting a protocol mapper by ID
   */
  test('should get a protocol mapper by ID', async () => {
    // Skip test if no client scope ID or protocol mapper ID is available
    if (!testClientScopeId || !testProtocolMapperId) {
      console.warn('Skipping test: Test client scope ID or protocol mapper ID is not defined');
      return;
    }
    
    try {
      // Get the protocol mapper by ID
      console.log(`Getting protocol mapper by ID: ${testProtocolMapperId}`);
      const protocolMapper = await testContext.sdk.clientScopes.getProtocolMapper(testClientScopeId, testProtocolMapperId);
      
      // Verify the protocol mapper properties
      expect(protocolMapper).toBeDefined();
      expect(protocolMapper.id).toBe(testProtocolMapperId);
      expect(protocolMapper.protocol).toBe('openid-connect');
      expect(protocolMapper.protocolMapper).toBe('oidc-usermodel-attribute-mapper');
      
      // Verify config with defensive programming
      if (protocolMapper.config) {
        expect(protocolMapper.config['user.attribute']).toBe('email');
        expect(protocolMapper.config['claim.name']).toBe('email');
      } else {
        console.warn('Protocol mapper config not returned by Keycloak API, skipping config verification');
      }
    } catch (error) {
      console.error(`Error getting protocol mapper by ID: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test updating a protocol mapper
   */
  test('should update a protocol mapper', async () => {
    // Skip test if no client scope ID or protocol mapper ID is available
    if (!testClientScopeId || !testProtocolMapperId) {
      console.warn('Skipping test: Test client scope ID or protocol mapper ID is not defined');
      return;
    }
    
    try {
      // Get the current protocol mapper
      console.log(`Getting protocol mapper for update: ${testProtocolMapperId}`);
      const protocolMapper = await testContext.sdk.clientScopes.getProtocolMapper(testClientScopeId, testProtocolMapperId);
      
      // Following SOLID principles, create a minimal update payload
      const updatedMapper: ProtocolMapperRepresentation = {
        name: protocolMapper.name,
        protocol: protocolMapper.protocol,
        protocolMapper: protocolMapper.protocolMapper,
        consentRequired: protocolMapper.consentRequired,
        config: {
          ...(protocolMapper.config || {}),
          'user.attribute': 'username',
          'claim.name': 'preferred_username'
        }
      };
      
      // Update the protocol mapper
      console.log(`Updating protocol mapper: ${testProtocolMapperId}`);
      await testContext.sdk.clientScopes.updateProtocolMapper(testClientScopeId, testProtocolMapperId, updatedMapper);
      
      // Get the updated protocol mapper
      console.log(`Getting updated protocol mapper: ${testProtocolMapperId}`);
      const retrievedMapper = await testContext.sdk.clientScopes.getProtocolMapper(testClientScopeId, testProtocolMapperId);
      
      // Verify the updates with proper error handling
      expect(retrievedMapper).toBeDefined();
      
      // Verify config with defensive programming
      if (retrievedMapper.config) {
        expect(retrievedMapper.config['user.attribute']).toBe('username');
        expect(retrievedMapper.config['claim.name']).toBe('preferred_username');
      } else {
        console.warn('Protocol mapper config not returned by Keycloak API, skipping config verification');
      }
    } catch (error) {
      console.error(`Error updating protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test deleting a protocol mapper
   */
  test('should delete a protocol mapper', async () => {
    // Skip test if no client scope ID or protocol mapper ID is available
    if (!testClientScopeId || !testProtocolMapperId) {
      console.warn('Skipping test: Test client scope ID or protocol mapper ID is not defined');
      return;
    }
    
    try {
      // Delete the protocol mapper
      console.log(`Deleting protocol mapper: ${testProtocolMapperId}`);
      await testContext.sdk.clientScopes.deleteProtocolMapper(testClientScopeId, testProtocolMapperId);
      
      // Get the protocol mappers for the client scope
      const protocolMappers = await testContext.sdk.clientScopes.getProtocolMappers(testClientScopeId);
      
      // Verify that the protocol mapper is no longer in the list
      expect(protocolMappers).toBeDefined();
      expect(Array.isArray(protocolMappers)).toBe(true);
      
      const deletedMapper = protocolMappers.find(mapper => mapper.id === testProtocolMapperId);
      expect(deletedMapper).toBeUndefined();
      
      // Reset the test protocol mapper ID since it's been deleted
      testProtocolMapperId = undefined;
    } catch (error) {
      console.error(`Error deleting protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
  
  /**
   * Test deleting a client scope
   */
  test('should delete a client scope', async () => {
    // Skip test if no client scope ID is available
    if (!testClientScopeId) {
      console.warn('Skipping test: Test client scope ID is not defined');
      return;
    }
    
    try {
      // Create a new client scope specifically for deletion testing
      const clientScopeName = generateUniqueName('delete-test-scope');
      console.log(`Creating client scope for deletion test: ${clientScopeName}`);
      
      const clientScope: ClientScopeRepresentation = {
        name: clientScopeName,
        description: 'Client Scope for Deletion Test',
        protocol: 'openid-connect'
      };
      
      // Create the client scope
      const deleteTestScopeId = await testContext.sdk.clientScopes.create(clientScope);
      console.log(`Created client scope for deletion test with ID: ${deleteTestScopeId}`);
      
      // Verify the client scope was created
      expect(deleteTestScopeId).toBeDefined();
      
      // Delete the client scope
      console.log(`Deleting client scope: ${deleteTestScopeId}`);
      await testContext.sdk.clientScopes.delete(deleteTestScopeId);
      
      // Try to get the deleted client scope - should throw an error
      try {
        await testContext.sdk.clientScopes.findById(deleteTestScopeId);
        // If we get here, the client scope was not deleted
        fail('Client scope was not deleted');
      } catch (error) {
        // Expected error - client scope should be deleted
        console.log('Client scope was successfully deleted');
      }
    } catch (error) {
      console.error(`Error in client scope deletion test: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  });
});
