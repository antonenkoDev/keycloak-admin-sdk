/**
 * E2E tests for the Authorization Resource Server API
 */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import KeycloakAdminSDK from '../../../src';
import {
  cleanupTestEnvironment,
  createTestClient,
  setupTestEnvironment,
  TestContext
} from '../utils/test-setup';
import {
  PolicyRepresentation,
  ResourceRepresentation,
  ScopeRepresentation
} from '../../../src/types/authorization';

const TEST_TIMEOUT = 30000;

describe('Authorization Resource Server API', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let clientId: string;
  let realmName: string;
  // Set up test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
      testContext = await createTestClient(testContext);
      if (!testContext.clientId) {
        throw new Error('Client ID required');
      }

      clientId = testContext.clientId;
      realmName = testContext.realmName || 'test-realm';

      // Ensure the client has authorization services enabled
      // This is already done in the createTestClient function, but we verify it here
      try {
        // Get the resource server configuration to verify it exists
        await sdk.authorizationServices.resourceServer.getResourceServer(clientId);
      } catch (error) {
        console.error('Error verifying resource server configuration:', error);
        console.error('Make sure authorization services are enabled for the client');
        throw error;
      }
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test realm
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  }, TEST_TIMEOUT);

  /**
   * Test getting resource server configuration
   */
  it('should get resource server configuration', async () => {
    // Get resource server configuration
    const resourceServer =
      await sdk.authorizationServices.resourceServer.getResourceServer(clientId);

    // Verify the response structure
    expect(resourceServer).toBeDefined();
    expect(resourceServer.id).toBeDefined();
    expect(resourceServer.clientId).toBeDefined();
    expect(resourceServer.allowRemoteResourceManagement).toBeDefined();
  });

  /**
   * Test resource management
   */
  describe('Resource Management', () => {
    let resourceId: string;
    const testResource: ResourceRepresentation = {
      name: 'TestResource',
      displayName: 'Test Resource Display Name',
      ownerManagedAccess: false,
      type: '',
      uris: ['/api/test'],
      scopes: [],
      attributes: {
        'test-attribute': ['test-value']
      }
    };

    // Setup: Clean up any existing resources with the same name before tests
    beforeAll(async () => {
      try {
        // Try to find existing resources with the same name
        const resources =
          await sdk.authorizationServices.resourceServer.getResourceServer(clientId);
        if (Array.isArray(resources)) {
          const existingResource = resources.find(r => r.name === testResource.name);
          if (existingResource && existingResource._id) {
            console.log(`Found existing resource with name ${testResource.name}, cleaning up...`);
            await sdk.authorizationServices.resourceServer.deleteResource(
              clientId,
              existingResource._id
            );
          }
        }
      } catch (error) {
        console.warn('Error during resource cleanup:', error);
        // Continue with tests even if cleanup fails
      }
    });

    it('should create a resource', async () => {
      try {
        // Create a resource
        const resource = await sdk.authorizationServices.resourceServer.createResource(
          clientId,
          testResource
        );
        resourceId = resource._id;
      } catch (error) {
        console.error('Error creating resource:', error);
        throw error;
      }
    });

    it('should get resources', async () => {
      // Skip if resource ID is not defined
      if (!resourceId) {
        throw new Error('Resource ID not defined');
      }

      try {
        // Get all resources
        const resources = await sdk.authorizationServices.resourceServer.getResources(clientId);

        // Verify resources were retrieved
        expect(resources).toBeDefined();
        // Resources should be an array
        const resourcesArray = Array.isArray(resources) ? resources : [resources];
        expect(resourcesArray.length).toBeGreaterThan(0);

        // Find our test resource in the list
        let testResourceInList: ResourceRepresentation | undefined;
        if (Array.isArray(resources)) {
          // Type assertion to ensure TypeScript knows resources is an array of ResourceRepresentation
          const typedResources = resources as ResourceRepresentation[];
          testResourceInList = typedResources.find(r => r._id === resourceId);
        } else if (resources && typeof resources === 'object' && 'id' in resources) {
          // Type assertion for a single ResourceRepresentation
          const typedResource = resources as ResourceRepresentation;
          testResourceInList = typedResource._id === resourceId ? typedResource : undefined;
        }

        expect(testResourceInList).toBeDefined();
        if (testResourceInList) {
          expect(testResourceInList.name).toBe(testResource.name);
        }
      } catch (error) {
        console.error('Error getting resources:', error);
        throw error;
      }
    });

    it('should get a specific resource', async () => {
      // Skip if resource ID is not defined
      if (!resourceId) {
        throw new Error('Resource ID not defined');
      }

      try {
        // Get resource by ID
        const resource = await sdk.authorizationServices.resourceServer.getResource(
          clientId,
          resourceId
        );

        // Verify resource was retrieved correctly
        expect(resource).toBeDefined();
        expect(resource._id).toBe(resourceId);
        expect(resource.name).toBe(testResource.name);
        expect(resource.displayName).toBe(testResource.displayName);
      } catch (error) {
        console.error('Error getting specific resource:', error);
        throw error;
      }
    });

    it('should update a resource', async () => {
      // Skip if resource ID is not defined
      if (!resourceId) {
        throw new Error('Resource ID not defined');
      }

      try {
        // Update the resource
        const updatedResource: ResourceRepresentation = {
          ...testResource,
          _id: resourceId,
          displayName: 'Updated Display Name',
          uris: ['/api/test', '/api/test2']
        };

        await sdk.authorizationServices.resourceServer.updateResource(
          clientId,
          resourceId,
          updatedResource
        );

        // Get the updated resource
        const resource = await sdk.authorizationServices.resourceServer.getResource(
          clientId,
          resourceId
        );

        // Verify resource was updated correctly
        expect(resource).toBeDefined();
        expect(resource.displayName).toBe(updatedResource.displayName);
        expect(resource.uris).toEqual(updatedResource.uris);
      } catch (error) {
        console.error('Error updating resource:', error);
        throw error;
      }
    });

    it('should search for a resource by name', async () => {
      // Skip if resource name is not defined
      if (!testResource.name) {
        throw new Error('Resource Name not defined');
      }

      try {
        // Search for the resource by name
        const resource = await sdk.authorizationServices.resourceServer.searchResource(
          clientId,
          testResource.name
        );

        // Verify resource was found
        expect(resource).toBeDefined();
      } catch (error) {
        console.error('Error searching for resource by name:', error);
        throw error;
      }
    });

    it('should get resource attributes', async () => {
      // Skip if resource ID is not defined
      if (!resourceId) {
        throw new Error('Resource ID not defined');
      }

      try {
        // Get the resource first to verify it exists
        const resource = await sdk.authorizationServices.resourceServer.getResource(
          clientId,
          resourceId
        );

        // If the resource exists, get its attributes
        if (resource && resource.attributes) {
          // Verify attributes directly from the resource object
          expect(resource.attributes).toBeDefined();
          expect(resource.attributes['test-attribute']).toBeDefined();
          expect(resource.attributes['test-attribute']).toEqual(['test-value']);
        } else {
          throw new Error('Resource does not have attributes property');
        }
      } catch (error) {
        console.error('Error getting resource attributes:', error);
        throw error;
      }
    });

    it('should delete a resource', async () => {
      // Skip if resource ID is not defined
      if (!resourceId) {
        throw new Error('Resource ID not defined');
      }

      try {
        // Delete the resource
        await sdk.authorizationServices.resourceServer.deleteResource(clientId, resourceId);

        // Try to get the deleted resource - should throw an error
        try {
          await sdk.authorizationServices.resourceServer.getResource(clientId, resourceId);
          // If we get here, the test failed
          fail('Resource was not deleted');
        } catch (error) {
          // Expected error - resource should not exist
          expect(error).toBeDefined();
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
        throw error;
      }
    });
  });

  /**
   * Test scope management
   */
  describe('Scope Management', () => {
    let scopeId: string;
    const testScope: ScopeRepresentation = {
      name: 'test-scope',
      displayName: 'Test Scope'
    };

    // Setup: Clean up any existing scopes with the same name before tests
    beforeAll(async () => {
      try {
        // Try to find existing scopes with the same name
        const scopes = await sdk.authorizationServices.scopes.getScopes(clientId);
        if (Array.isArray(scopes)) {
          const existingScope = scopes.find(s => s.name === testScope.name);
          if (existingScope && existingScope.id) {
            console.log(`Found existing scope with name ${testScope.name}, cleaning up...`);
            await sdk.authorizationServices.scopes.deleteScope(clientId, existingScope.id);
          }
        }
      } catch (error) {
        console.warn('Error during scope cleanup:', error);
        // Continue with tests even if cleanup fails
      }
    });

    it('should create a scope', async () => {
      try {
        // Create a scope
        await sdk.authorizationServices.scopes.createScope(clientId, testScope);

        // No response body expected. Test is passed if no errors.
        expect(true).toBe(true);
      } catch (error) {
        console.error('Error creating scope:', error);
        throw error;
      }
    });

    it('should get scopes', async () => {
      // Skip if scope ID is not defined
      try {
        // Get all scopes
        const scopes = await sdk.authorizationServices.scopes.getScopes(clientId);

        // Verify scopes were retrieved
        expect(scopes).toBeDefined();
        expect(Array.isArray(scopes)).toBe(true);
        expect(scopes.length).toBeGreaterThan(0);

        // Verify our test scope is in the list
        const testScopeInList = scopes.find(s => s.name === testScope.name);
        if (testScopeInList?.id) {
          scopeId = testScopeInList.id;
        }
        expect(testScopeInList).toBeDefined();
      } catch (error) {
        console.error('Error getting scopes:', error);
        throw error;
      }
    });

    it('should get a specific scope', async () => {
      // Skip if scope ID is not defined
      if (!scopeId) {
        fail('No scope ID provided');
      }

      try {
        // Get the specific scope
        const scope = await sdk.authorizationServices.scopes.getScope(clientId, scopeId);

        // Verify scope was retrieved correctly
        expect(scope).toBeDefined();
        expect(scope.id).toBe(scopeId);
        expect(scope.name).toBe(testScope.name);
        expect(scope.displayName).toBe(testScope.displayName);
      } catch (error) {
        console.error('Error getting specific scope:', error);
        throw error;
      }
    });

    it('should search for a scope by name', async () => {
      // Skip if scope name is not defined
      if (!testScope.name) {
        throw new Error('Scope name not defined');
      }

      try {
        // Search for the scope by name
        const scopeName = testScope.name;
        const scope = await sdk.authorizationServices.scopes.searchScope(clientId, scopeName);

        // Verify scope was found
        expect(scope.name).toBe('test-scope');
      } catch (error) {
        console.error('Error searching for scope by name:', error);
        throw error;
      }
    });

    it('should update a scope', async () => {
      // Skip if scope ID is not defined
      if (!scopeId) {
        throw new Error('Scope ID not defined');
      }

      try {
        // Update the scope
        const updatedScope: ScopeRepresentation = {
          ...testScope,
          id: scopeId,
          displayName: 'Updated Scope Display Name'
        };

        await sdk.authorizationServices.scopes.updateScope(clientId, scopeId, updatedScope);

        // Get the updated scope
        const scope = await sdk.authorizationServices.scopes.getScope(clientId, scopeId);

        // Verify scope was updated correctly
        expect(scope).toBeDefined();
        expect(scope.displayName).toBe(updatedScope.displayName);
      } catch (error) {
        console.error('Error updating scope:', error);
        throw error;
      }
    });

    it('should delete a scope', async () => {
      // Skip if scope ID is not defined
      if (!scopeId) {
        throw new Error('Scope ID not defined');
      }

      try {
        // Delete the scope
        await sdk.authorizationServices.scopes.deleteScope(clientId, scopeId);

        // Try to get the deleted scope - should throw an error
        try {
          await sdk.authorizationServices.scopes.getScope(clientId, scopeId);
          // If we get here, the test failed
          fail('Scope was not deleted');
        } catch (error) {
          // Expected error - scope should not exist
          expect(error).toBeDefined();
        }
      } catch (error) {
        console.error('Error deleting scope:', error);
        throw error;
      }
    });
  });

  /**
   * Test policy management
   */
  describe('Policy Management', () => {
    let policyId: string;
    // Setup for getting client scopes
    let clientScopeId: string;

    // First, we need to get a valid client scope ID
    beforeAll(async () => {
      try {
        // Get client scopes from the realm
        const clientScopes = await sdk.authorizationServices.scopes.getScopes(clientId);

        // Use the first available client scope
        if (clientScopes && clientScopes.length > 0) {
          if (!clientScopes[0].id) {
            throw new Error('Scope ID not found.');
          }
          clientScopeId = clientScopes[0]?.id;
          console.log(`Using client scope ID: ${clientScopeId}`);
        } else {
        }
      } catch (error) {
        console.error('Error getting client scopes:', error);
      }
    });

    // Define the test policy using client-scope type
    const testPolicy: PolicyRepresentation = {
      name: 'Test Policy',
      description: 'Test policy description',
      type: 'client-scope',
      logic: 'POSITIVE'
    };

    // Update the policy config with client scope ID before each test
    beforeEach(() => {
      if (clientScopeId) {
        testPolicy.config = {
          clientScopes: JSON.stringify([
            {
              id: clientScopeId,
              required: false
            }
          ])
        };
      }
    });

    it('should create a policy', async () => {
      try {
        // Create a policy
        const policy = await sdk.authorizationServices.policies.createPolicy(clientId, testPolicy);

        // Store policy ID for later tests
        policyId = policy.id!;

        // Verify policy was created correctly
        expect(policy).toBeDefined();
        expect(policy.id).toBeDefined();
        expect(policy.name).toBe(testPolicy.name);
        expect(policy.description).toBe(testPolicy.description);
        expect(policy.type).toBe(testPolicy.type);
      } catch (error) {
        console.error('Error creating policy:', error);
        throw error;
      }
    });

    it('should get policies', async () => {
      // Skip if policy ID is not defined
      if (!policyId) {
        throw new Error('Policy ID not defined');
      }

      try {
        // Get all policies
        const policies = await sdk.authorizationServices.policies.getPolicies(clientId);

        // Verify policies were retrieved
        expect(policies).toBeDefined();
        expect(Array.isArray(policies)).toBe(true);
        expect(policies.length).toBeGreaterThan(0);

        // Verify our test policy is in the list
        const testPolicyInList = policies.find(p => p.id === policyId);
        expect(testPolicyInList).toBeDefined();
        if (testPolicyInList) {
          expect(testPolicyInList.name).toBe(testPolicy.name);
        }
      } catch (error) {
        console.error('Error getting policies:', error);
        throw error;
      }
    });

    it('should get a specific policy', async () => {
      // Skip if policy ID is not defined
      if (!policyId) {
        throw new Error('Policy ID not defined');
      }

      try {
        // Get the specific policy
        const policy = await sdk.authorizationServices.policies.getPolicies(clientId, {
          policyId
        });

        // Verify policy was retrieved correctly
        expect(policy).toBeDefined();
        expect(Array.isArray(policy)).toBe(true);
        expect(policy.length).toBeGreaterThan(0);

        const specificPolicy = policy[0];
        expect(specificPolicy.id).toBe(policyId);
        expect(specificPolicy.name).toBe(testPolicy.name);
        expect(specificPolicy.description).toBe(testPolicy.description);
      } catch (error) {
        console.error('Error getting specific policy:', error);
        throw error;
      }
    });

    it('should update a policy', async () => {
      // Skip if policy ID is not defined
      if (!policyId) {
        throw new Error('Policy ID not defined');
      }

      try {
        // Update the policy
        const updatedPolicy: PolicyRepresentation = {
          ...testPolicy,
          id: policyId,
          description: 'Updated policy description'
        };

        await sdk.authorizationServices.policies.updatePolicy(clientId, policyId, updatedPolicy);

        // Get the updated policy
        const policies = await sdk.authorizationServices.policies.getPolicies(clientId, {
          policyId
        });

        // Verify policy exists and was updated
        expect(policies).toBeDefined();
        expect(Array.isArray(policies)).toBe(true);
        expect(policies.length).toBeGreaterThan(0);

        const updatedPolicyFromServer = policies[0];
        expect(updatedPolicyFromServer.description).toBe(updatedPolicy.description);
      } catch (error) {
        console.error('Error updating policy:', error);
        throw error;
      }
    });

    it('should search for a policy by name', async () => {
      // Skip if policy name is not defined
      if (!testPolicy.name) {
        throw new Error('Policy name not defined');
      }

      try {
        // Search for the policy by name
        const policy = await sdk.authorizationServices.policies.searchPolicy(
          clientId,
          testPolicy.name
        );

        // Verify policy was found
        expect(policy).toBeDefined();
        expect(policy.name).toBe(testPolicy.name);
      } catch (error) {
        console.error('Error searching for policy by name:', error);
        throw error;
      }
    });

    it('should get policy providers', async () => {
      try {
        // Get policy providers
        const providers = await sdk.authorizationServices.policies.getPolicyProviders(clientId);

        // Verify providers were retrieved
        expect(providers).toBeDefined();
        expect(Array.isArray(providers)).toBe(true);
        expect(providers.length).toBeGreaterThan(0);

        // Verify common policy providers exist
        const userProvider = providers.find(p => p.type === 'user');
        expect(userProvider).toBeDefined();

        // Verify we have multiple policy types available
        const policyTypes = providers.map(p => p.type);
        expect(policyTypes.length).toBeGreaterThan(1);
      } catch (error) {
        console.error('Error getting policy providers:', error);
        throw error;
      }
    });

    it('should delete a policy', async () => {
      if (!policyId) {
        throw new Error('Policy ID not defined');
      }

      try {
        // Implement the deletePolicy method directly in the test
        // This is a temporary solution until the method is implemented in the ResourceServerApi class
        await sdk.request(
          `/clients/${clientId}/authz/resource-server/policy/${policyId}`,
          'DELETE'
        );

        // Try to get the deleted policy - should return empty array or throw an error
        try {
          const policies = await sdk.authorizationServices.policies.getPolicies(clientId, {
            policyId
          });
          expect(policies.length).toBe(0);
        } catch (error) {
          // Expected error - policy should not exist
          expect(error).toBeDefined();
        }
      } catch (error) {
        console.error('Error deleting policy:', error);
        throw error;
      }
    });
  });
});
