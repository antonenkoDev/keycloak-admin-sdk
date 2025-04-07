/**
 * Example: Manage client scopes and assign to clients
 *
 * This example demonstrates comprehensive management of client scopes including:
 * - Creating a client scope
 * - Updating a client scope
 * - Adding protocol mappers
 * - Assigning client scopes to clients as default or optional
 */

import KeycloakClient from '../../src/index';
import { ClientScopeRepresentation, ProtocolMapperRepresentation } from '../../src/types/clients';
import { KeycloakConfig } from '../../src/types/auth';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new instance of the Keycloak Admin SDK with proper typing
const config: KeycloakConfig = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: 'password',
  credentials: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
    username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'
  }
};

const sdk = new KeycloakClient(config);

/**
 * Manage client scopes and assign to clients
 *
 * Following SOLID principles:
 * - Single Responsibility: Each function has a clear purpose
 * - Open/Closed: Functionality is extended without modifying existing code
 * - Liskov Substitution: Consistent behavior across similar operations
 * - Interface Segregation: Only necessary properties are included in objects
 * - Dependency Inversion: High-level modules don't depend on low-level details
 */
async function manageClientScopes() {
  try {
    // Step 1: Create a new client scope
    const scopeName = `custom-scope-${Date.now()}`;

    const clientScope: ClientScopeRepresentation = {
      name: scopeName,
      description: 'Custom scope for demonstration',
      protocol: 'openid-connect',
      attributes: {
        'display.on.consent.screen': 'true',
        'include.in.token.scope': 'true'
      }
    };

    const clientScopeId = await sdk.clients.clientScopes.create(clientScope);

    // Step 2: Update the client scope with additional attributes

    // Get current scope to ensure we're not overwriting existing properties
    const currentScope = await sdk.clients.clientScopes.findById(clientScopeId);

    const updatedScope: ClientScopeRepresentation = {
      // Keep existing properties
      ...currentScope,
      // Update only what needs to be changed
      description: 'Updated custom scope with additional attributes',
      attributes: {
        ...(currentScope.attributes || {}),
        'consent.screen.text': 'Custom consent text for scope',
        'gui.order': '500'
      }
    };

    await sdk.clients.clientScopes.update(clientScopeId, updatedScope);

    // Step 3: Add protocol mappers to the client scope

    // Create a custom attribute mapper
    const customAttributeMapper: ProtocolMapperRepresentation = {
      name: 'custom-attribute-mapper',
      protocol: 'openid-connect',
      protocolMapper: 'oidc-usermodel-attribute-mapper',
      consentRequired: false,
      config: {
        'userinfo.token.claim': 'true',
        'user.attribute': 'customAttribute',
        'id.token.claim': 'true',
        'access.token.claim': 'true',
        'claim.name': 'custom_info',
        'jsonType.label': 'String'
      }
    };

    // Create a role mapper
    const roleMapper: ProtocolMapperRepresentation = {
      name: 'realm-roles-mapper',
      protocol: 'openid-connect',
      protocolMapper: 'oidc-usermodel-realm-role-mapper',
      consentRequired: false,
      config: {
        'userinfo.token.claim': 'true',
        'id.token.claim': 'true',
        'access.token.claim': 'true',
        'claim.name': 'realm_roles',
        multivalued: 'true',
        'jsonType.label': 'String'
      }
    };

    // Add the mappers to the client scope with proper error handling
    let attributeMapperId: string | undefined;
    let roleMapperId: string | undefined;

    try {
      attributeMapperId = await sdk.clients.clientScopes.createProtocolMapper(
        clientScopeId,
        customAttributeMapper
      );
    } catch (error) {
      console.error(
        `Failed to create attribute mapper: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    try {
      roleMapperId = await sdk.clients.clientScopes.createProtocolMapper(clientScopeId, roleMapper);
    } catch (error) {
      console.error(
        `Failed to create role mapper: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Step 4: Find a client to assign the scope to

    // Get all clients with defensive programming
    let clients;
    try {
      clients = await sdk.clients.findAll();
      if (!clients || clients.length === 0) {
        throw new Error('No clients found in the realm');
      }
    } catch (error) {
      console.error(
        `Failed to find clients: ${error instanceof Error ? error.message : String(error)}`
      );
      // Clean up and exit if we can't find clients
      await cleanupResources(clientScopeId, attributeMapperId, roleMapperId);
      return { success: false };
    }

    // Find a non-system client to use (avoid system clients like realm-management, security-admin-console, etc.)
    const systemClientIds = [
      'realm-management',
      'security-admin-console',
      'admin-cli',
      'account',
      'account-console'
    ];
    const targetClient =
      clients.find(client => client.id && !systemClientIds.includes(client.clientId || '')) ||
      clients[0];

    if (!targetClient.id) {
      console.error('Target client has no ID');
      await cleanupResources(clientScopeId, attributeMapperId, roleMapperId);
      return { success: false };
    }

    console.log(`Selected client: ${targetClient.clientId} (${targetClient.id})`);

    // Step 5: Assign the client scope as an optional scope to the client

    try {
      await sdk.clients.addOptionalClientScope(targetClient.id, clientScopeId);
    } catch (error) {
      console.error(
        `Failed to add optional scope: ${error instanceof Error ? error.message : String(error)}`
      );
      await cleanupResources(clientScopeId, attributeMapperId, roleMapperId);
      return { success: false };
    }

    // Step 6: Verify the client has the scope assigned

    let optionalScopes;
    try {
      optionalScopes = await sdk.clients.getOptionalClientScopes(targetClient.id);

      optionalScopes.forEach(scope => {
        console.log(`- ${scope.name} (${scope.id})`);
      });

      const assignedScope = optionalScopes.find(scope => scope.id === clientScopeId);
      if (!assignedScope) {
        console.error(`\nError: Client scope ${scopeName} was not found in optional scopes`);
      }
    } catch (error) {
      console.error(
        `Failed to get optional scopes: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Step 7: Move the client scope from optional to default

    try {
      // First remove from optional scopes
      await sdk.clients.removeOptionalClientScope(targetClient.id, clientScopeId);

      // Then add to default scopes
      await sdk.clients.addDefaultClientScope(targetClient.id, clientScopeId);
    } catch (error) {
      console.error(
        `Failed to move scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Step 8: Verify the client has the scope as default

    try {
      const defaultScopes = await sdk.clients.getDefaultClientScopes(targetClient.id);

      defaultScopes.forEach(scope => {
        console.log(`- ${scope.name} (${scope.id})`);
      });

      const defaultAssignedScope = defaultScopes.find(scope => scope.id === clientScopeId);
      if (!defaultAssignedScope) {
        console.error(`\nError: Client scope ${scopeName} was not found in default scopes`);
      }
    } catch (error) {
      console.error(
        `Failed to get default scopes: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Return the created resources for cleanup
    return {
      success: true,
      clientScopeId,
      clientId: targetClient.id,
      attributeMapperId,
      roleMapperId
    };
  } catch (error) {
    console.error(
      'Error managing client scopes:',
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

/**
 * Helper function to clean up resources
 * Following Single Responsibility Principle
 */
async function cleanupResources(
  clientScopeId?: string,
  attributeMapperId?: string,
  roleMapperId?: string
): Promise<void> {
  try {
    if (!clientScopeId) {
      return;
    }

    // Delete protocol mappers if they exist
    if (attributeMapperId) {
      try {
        await sdk.clients.clientScopes.deleteProtocolMapper(clientScopeId, attributeMapperId);
      } catch (error) {
        console.error(
          `Failed to delete attribute mapper: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    if (roleMapperId) {
      try {
        await sdk.clients.clientScopes.deleteProtocolMapper(clientScopeId, roleMapperId);
      } catch (error) {
        console.error(
          `Failed to delete role mapper: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Delete the client scope
    try {
      await sdk.clients.clientScopes.delete(clientScopeId);
    } catch (error) {
      console.error(
        `Failed to delete client scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } catch (error) {
    console.error('Error during cleanup:', error instanceof Error ? error.message : String(error));
  }
}

// Execute the function and handle cleanup
manageClientScopes()
  .then(result => {
    if (result.success) {
      if (result.attributeMapperId)
        if (result.roleMapperId)
          // Ask if user wants to clean up resources
          console.log(`\nWould you like to clean up the created resources? (yes/no)`);

      console.log(
        `node -e "require('./examples/client-scopes/manage-client-scopes').cleanup('${result.clientScopeId}', '${result.attributeMapperId || ''}', '${result.roleMapperId || ''}')"`
      );
    } else {
    }
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });

// Export the cleanup function for external use
export const cleanup = cleanupResources;
