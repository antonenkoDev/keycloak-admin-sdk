/**
 * Example: Manage client scopes and assign to clients
 * 
 * This example demonstrates comprehensive management of client scopes including:
 * - Creating a client scope
 * - Updating a client scope
 * - Adding protocol mappers
 * - Assigning client scopes to clients as default or optional
 */

import KeycloakAdminSDK from '../../src/index';
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

const sdk = new KeycloakAdminSDK(config);

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
    console.log(`\n=== Step 1: Creating client scope: ${scopeName} ===`);
    
    const clientScope: ClientScopeRepresentation = {
      name: scopeName,
      description: 'Custom scope for demonstration',
      protocol: 'openid-connect',
      attributes: {
        'display.on.consent.screen': 'true',
        'include.in.token.scope': 'true'
      }
    };
    
    const clientScopeId = await sdk.clientScopes.create(clientScope);
    console.log(`Client scope created with ID: ${clientScopeId}`);
    
    // Step 2: Update the client scope with additional attributes
    console.log(`\n=== Step 2: Updating client scope ===`);
    
    // Get current scope to ensure we're not overwriting existing properties
    const currentScope = await sdk.clientScopes.findById(clientScopeId);
    
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
    
    await sdk.clientScopes.update(clientScopeId, updatedScope);
    console.log(`Client scope updated successfully`);
    
    // Step 3: Add protocol mappers to the client scope
    console.log(`\n=== Step 3: Adding protocol mappers ===`);
    
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
        'multivalued': 'true',
        'jsonType.label': 'String'
      }
    };
    
    // Add the mappers to the client scope with proper error handling
    let attributeMapperId: string | undefined;
    let roleMapperId: string | undefined;
    
    try {
      attributeMapperId = await sdk.clientScopes.createProtocolMapper(clientScopeId, customAttributeMapper);
      console.log(`Custom attribute mapper created with ID: ${attributeMapperId}`);
    } catch (error) {
      console.error(`Failed to create attribute mapper: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    try {
      roleMapperId = await sdk.clientScopes.createProtocolMapper(clientScopeId, roleMapper);
      console.log(`Role mapper created with ID: ${roleMapperId}`);
    } catch (error) {
      console.error(`Failed to create role mapper: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Step 4: Find a client to assign the scope to
    console.log(`\n=== Step 4: Finding a client to assign the scope to ===`);
    
    // Get all clients with defensive programming
    let clients;
    try {
      clients = await sdk.clients.findAll();
      if (!clients || clients.length === 0) {
        throw new Error('No clients found in the realm');
      }
    } catch (error) {
      console.error(`Failed to find clients: ${error instanceof Error ? error.message : String(error)}`);
      // Clean up and exit if we can't find clients
      await cleanupResources(clientScopeId, attributeMapperId, roleMapperId);
      return { success: false };
    }
    
    // Find a non-system client to use (avoid system clients like realm-management, security-admin-console, etc.)
    const systemClientIds = ['realm-management', 'security-admin-console', 'admin-cli', 'account', 'account-console'];
    const targetClient = clients.find(client => 
      client.id && !systemClientIds.includes(client.clientId || '')
    ) || clients[0];
    
    if (!targetClient.id) {
      console.error('Target client has no ID');
      await cleanupResources(clientScopeId, attributeMapperId, roleMapperId);
      return { success: false };
    }
    
    console.log(`Selected client: ${targetClient.clientId} (${targetClient.id})`);
    
    // Step 5: Assign the client scope as an optional scope to the client
    console.log(`\n=== Step 5: Assigning client scope as optional scope ===`);
    
    try {
      await sdk.clients.addOptionalClientScope(targetClient.id, clientScopeId);
      console.log(`Added ${scopeName} as optional scope to client ${targetClient.clientId}`);
    } catch (error) {
      console.error(`Failed to add optional scope: ${error instanceof Error ? error.message : String(error)}`);
      await cleanupResources(clientScopeId, attributeMapperId, roleMapperId);
      return { success: false };
    }
    
    // Step 6: Verify the client has the scope assigned
    console.log(`\n=== Step 6: Verifying client scope assignment ===`);
    
    let optionalScopes;
    try {
      optionalScopes = await sdk.clients.getOptionalClientScopes(targetClient.id);
      console.log(`Optional scopes for client ${targetClient.clientId}:`);
      optionalScopes.forEach(scope => {
        console.log(`- ${scope.name} (${scope.id})`);
      });
      
      const assignedScope = optionalScopes.find(scope => scope.id === clientScopeId);
      if (assignedScope) {
        console.log(`\nVerified: Client scope ${scopeName} is assigned as optional scope`);
      } else {
        console.warn(`\nWarning: Client scope ${scopeName} was not found in optional scopes`);
      }
    } catch (error) {
      console.error(`Failed to get optional scopes: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Step 7: Move the client scope from optional to default
    console.log(`\n=== Step 7: Moving client scope from optional to default ===`);
    
    try {
      // First remove from optional scopes
      await sdk.clients.removeOptionalClientScope(targetClient.id, clientScopeId);
      console.log(`Removed ${scopeName} from optional scopes`);
      
      // Then add to default scopes
      await sdk.clients.addDefaultClientScope(targetClient.id, clientScopeId);
      console.log(`Added ${scopeName} as default scope to client ${targetClient.clientId}`);
    } catch (error) {
      console.error(`Failed to move scope: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Step 8: Verify the client has the scope as default
    console.log(`\n=== Step 8: Verifying default client scope assignment ===`);
    
    try {
      const defaultScopes = await sdk.clients.getDefaultClientScopes(targetClient.id);
      console.log(`Default scopes for client ${targetClient.clientId}:`);
      defaultScopes.forEach(scope => {
        console.log(`- ${scope.name} (${scope.id})`);
      });
      
      const defaultAssignedScope = defaultScopes.find(scope => scope.id === clientScopeId);
      if (defaultAssignedScope) {
        console.log(`\nVerified: Client scope ${scopeName} is assigned as default scope`);
      } else {
        console.warn(`\nWarning: Client scope ${scopeName} was not found in default scopes`);
      }
    } catch (error) {
      console.error(`Failed to get default scopes: ${error instanceof Error ? error.message : String(error)}`);
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
    console.error('Error managing client scopes:', error instanceof Error ? error.message : String(error));
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
    
    console.log('\nPerforming cleanup...');
    
    // Delete protocol mappers if they exist
    if (attributeMapperId) {
      try {
        await sdk.clientScopes.deleteProtocolMapper(clientScopeId, attributeMapperId);
        console.log(`Deleted attribute mapper: ${attributeMapperId}`);
      } catch (error) {
        console.error(`Failed to delete attribute mapper: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    if (roleMapperId) {
      try {
        await sdk.clientScopes.deleteProtocolMapper(clientScopeId, roleMapperId);
        console.log(`Deleted role mapper: ${roleMapperId}`);
      } catch (error) {
        console.error(`Failed to delete role mapper: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Delete the client scope
    try {
      await sdk.clientScopes.delete(clientScopeId);
      console.log(`Deleted client scope: ${clientScopeId}`);
    } catch (error) {
      console.error(`Failed to delete client scope: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log('Cleanup completed');
  } catch (error) {
    console.error('Error during cleanup:', error instanceof Error ? error.message : String(error));
  }
}

// Execute the function and handle cleanup
manageClientScopes()
  .then(result => {
    if (result.success) {
      console.log(`\n=== Example completed successfully ===`);
      console.log(`Resources created:`);
      console.log(`- Client Scope ID: ${result.clientScopeId}`);
      console.log(`- Assigned to Client ID: ${result.clientId}`);
      if (result.attributeMapperId) console.log(`- Attribute Mapper ID: ${result.attributeMapperId}`);
      if (result.roleMapperId) console.log(`- Role Mapper ID: ${result.roleMapperId}`);
      
      // Ask if user wants to clean up resources
      console.log(`\nWould you like to clean up the created resources? (yes/no)`);
      console.log(`If yes, run the following command:`);
      console.log(`node -e "require('./examples/client-scopes/manage-client-scopes').cleanup('${result.clientScopeId}', '${result.attributeMapperId || ''}', '${result.roleMapperId || ''}')"`)
    } else {
      console.log(`\n=== Example completed with errors ===`);
    }
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });

// Export the cleanup function for external use
export const cleanup = cleanupResources;
