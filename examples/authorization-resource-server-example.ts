/**
 * Example demonstrating the usage of the Authorization Resource Server API
 *
 * This example shows how to manage authorization resources, scopes, and policies
 * in a Keycloak client with authorization services enabled.
 */

import KeycloakClient from '../src';
import {
  PolicyRepresentation,
  ResourceRepresentation,
  ResourceServerRepresentation,
  ScopeRepresentation
} from '../src/types/authorization';

/**
 * Create a Keycloak Admin SDK instance with configuration from environment variables
 * @returns Configured SDK instance
 */
function createSdk(): KeycloakClient {
  return new KeycloakClient({
    baseUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'master',
    authMethod: 'password',
    credentials: {
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
      username: process.env.KEYCLOAK_USERNAME || 'admin',
      password: process.env.KEYCLOAK_PASSWORD || 'admin'
    }
  });
}

/**
 * Get or create a client with authorization services enabled
 * @param sdk Keycloak Admin SDK instance
 * @returns Client ID
 */
async function getOrCreateAuthzClient(sdk: KeycloakClient): Promise<string> {
  const clientId = 'authz-test-client';

  // Check if client exists
  try {
    const client = await sdk.clients.findById(clientId);

    if (client) {
      return client.id!;
    }
  } catch (error) {
    console.log(
      `Error checking for client: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Create new client with authorization services
  try {
    const newClient = await sdk.clients.create({
      clientId,
      name: 'Authorization Test Client',
      authorizationServicesEnabled: true,
      serviceAccountsEnabled: true,
      publicClient: false,
      standardFlowEnabled: true,
      directAccessGrantsEnabled: true
    });

    return newClient.id!;
  } catch (error) {
    throw new Error(
      `Failed to create client: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get resource server configuration
 * @param sdk Keycloak Admin SDK instance
 * @param clientUuid Client UUID
 * @returns Resource server configuration
 */
async function getResourceServer(
  sdk: KeycloakClient,
  clientUuid: string
): Promise<ResourceServerRepresentation> {
  try {
    return await sdk.authorizationServices.resourceServer.getResourceServer(clientUuid);
  } catch (error) {
    throw new Error(
      `Failed to get resource server: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Create a resource
 * @param sdk Keycloak Admin SDK instance
 * @param clientUuid Client UUID
 * @param resourceName Resource name
 * @returns Created resource
 */
async function createResource(
  sdk: KeycloakClient,
  clientUuid: string,
  resourceName: string
): Promise<ResourceRepresentation> {
  try {
    const resource: ResourceRepresentation = {
      name: resourceName,
      displayName: `${resourceName} Display Name`,
      type: 'urn:example:resource',
      uris: [`/api/${resourceName.toLowerCase()}`],
      scopes: [],
      attributes: {
        'resource-type': ['example'],
        visibility: ['public']
      }
    };

    return await sdk.authorizationServices.resources.createResource(clientUuid, resource);
  } catch (error) {
    throw new Error(
      `Failed to create resource: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Create a scope
 * @param sdk Keycloak Admin SDK instance
 * @param clientUuid Client UUID
 * @param scopeName Scope name
 * @returns Created scope
 */
async function createScope(
  sdk: KeycloakClient,
  clientUuid: string,
  scopeName: string
): Promise<ScopeRepresentation> {
  try {
    const scope: ScopeRepresentation = {
      name: scopeName,
      displayName: `${scopeName} Display Name`
    };

    return await sdk.authorizationServices.scopes.createScope(clientUuid, scope);
  } catch (error) {
    throw new Error(
      `Failed to create scope: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Create a JavaScript policy
 * @param sdk Keycloak Admin SDK instance
 * @param clientUuid Client UUID
 * @param policyName Policy name
 * @returns Created policy
 */
async function createJsPolicy(
  sdk: KeycloakClient,
  clientUuid: string,
  policyName: string
): Promise<PolicyRepresentation> {
  try {
    const policy: PolicyRepresentation = {
      name: policyName,
      description: `${policyName} Description`,
      type: 'js',
      logic: 'POSITIVE',
      config: {
        code: `
          // This is a simple JavaScript policy that grants access
          // You can implement complex authorization logic here
          var context = $evaluation.getContext();
          var identity = context.getIdentity();
          var permission = $evaluation.getPermission();
          
          // Log some information
          print('Evaluating permission: ' + permission.getResource().getName());
          
          // Always grant access in this example
          $evaluation.grant();
        `
      }
    };

    return await sdk.authorizationServices.policies.createPolicy(clientUuid, policy);
  } catch (error) {
    throw new Error(
      `Failed to create policy: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Example of using the Authorization Resource Server API
 */
async function example(): Promise<{
  resourceServer: ResourceServerRepresentation;
  resource: ResourceRepresentation;
  scope: ScopeRepresentation;
  policy: PolicyRepresentation;
  allResources: number;
  allScopes: number;
  allPolicies: number;
}> {
  try {
    const sdk = createSdk();

    // Get or create a client with authorization services
    const clientUuid = await getOrCreateAuthzClient(sdk);
    console.log(`Using client with ID: ${clientUuid}`);

    // Get resource server configuration
    const resourceServer = await getResourceServer(sdk, clientUuid);
    console.log(`Resource server ID: ${resourceServer.id}`);

    // Create a resource
    const resource = await createResource(sdk, clientUuid, 'ExampleResource');
    console.log(`Created resource with ID: ${resource.id}`);

    // Create a scope
    const scope = await createScope(sdk, clientUuid, 'example:read');
    console.log(`Created scope with ID: ${scope.id}`);

    // Create a policy
    const policy = await createJsPolicy(sdk, clientUuid, 'ExamplePolicy');
    console.log(`Created policy with ID: ${policy.id}`);

    // Get all resources
    const resources = await sdk.authorizationServices.resources.getResources(clientUuid);
    console.log(`Total resources: ${resources.length}`);

    // Get all scopes
    const scopes = await sdk.authorizationServices.scopes.getScopes(clientUuid);
    console.log(`Total scopes: ${scopes.length}`);

    // Get all policies
    const policies = await sdk.authorizationServices.policies.getPolicies(clientUuid);
    console.log(`Total policies: ${policies.length}`);

    // Return structured data
    return {
      resourceServer,
      resource,
      scope,
      policy,
      allResources: resources.length,
      allScopes: scopes.length,
      allPolicies: policies.length
    };
  } catch (error) {
    throw new Error(
      `Error in authorization example: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  example()
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    });
}

export { getResourceServer, createResource, createScope, createJsPolicy };
