/**
 * Scope Mappings API Example
 *
 * This example demonstrates how to use the Scope Mappings API to manage scope mappings
 * for clients and client scopes in Keycloak.
 *
 * It shows how to:
 * - Get all scope mappings for a client
 * - Get realm-level scope mappings for a client
 * - Add realm-level scope mappings to a client
 * - Delete realm-level scope mappings from a client
 * - Get client-level scope mappings
 * - Add client-level scope mappings
 * - Delete client-level scope mappings
 * - Work with client scopes and client templates
 *
 * With enhanced error handling and ID extraction from Location headers.
 * Following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src';
import { KeycloakConfig } from '../../src/types/auth';
import { ClientRepresentation } from '../../src/types/clients';
import { RoleRepresentation } from '../../src/types/roles';
import dotenv from 'dotenv';
import { ClientScopeRepresentation } from '../../lib/types/clients'; // Load environment variables from .env file

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

// Create the Keycloak Admin SDK instance
const sdk = new KeycloakAdminSDK(config);

async function main() {
  // Define variables outside try block to ensure they're available in finally block for cleanup
  let testRoleName: string | undefined;
  let testClientScopeName: string | undefined;
  let clientScopeId: string | undefined;
  let client: ClientRepresentation | undefined;
  let role: RoleRepresentation | undefined;

  try {
    console.log('Starting Scope Mappings API example...');

    // Step 1: Find a client to use for this example
    console.log('\nStep 1: Finding a client to use');

    try {
      const clients = await sdk.clients.findAll();
      if (clients.length === 0) {
        throw new Error('No clients found in the realm');
      }

      client = clients[0];
      console.log(`Using client: ${client.clientId} (${client.id})`);
    } catch (error) {
      console.error('Error finding clients:', error);
      throw new Error('Failed to find a client for the example');
    }

    // Step 2: Create a test role to use in scope mappings
    console.log('\nStep 2: Creating a test role');

    testRoleName = `test-scope-role-${Date.now()}`;
    const testRole = {
      name: testRoleName,
      description: 'Test role for scope mappings example'
    };

    try {
      // Create role and get ID directly from Location header
      const roleId = await sdk.roles.create(testRole);
      console.log(
        `Created test role: ${testRoleName} (${roleId}) - ID extracted from Location header`
      );

      // Get the role details
      role = await sdk.roles.getByName(testRoleName);
      if (!role) {
        throw new Error(`Role ${testRoleName} not found`);
      }
    } catch (error) {
      console.error('Error creating test role:', error);
      throw new Error('Failed to create test role for the example');
    }

    // Step 3: Create a client scope to use in this example
    console.log('\nStep 3: Creating a test client scope');

    testClientScopeName = `test-client-scope-${Date.now()}`;
    const testClientScope: ClientScopeRepresentation = {
      name: testClientScopeName,
      protocol: 'openid-connect',
      description: 'Test client scope for scope mappings example'
    };

    try {
      // Create client scope and get ID directly from Location header
      clientScopeId = await sdk.clients.clientScopes.create(testClientScope);
      console.log(
        `Created test client scope: ${testClientScopeName} (${clientScopeId}) - ID extracted from Location header`
      );
    } catch (error) {
      console.error('Error creating test client scope:', error);
      throw new Error('Failed to create test client scope for the example');
    }

    // Step 4: Work with client scope mappings
    console.log('\nStep 4: Working with client scope mappings');

    // Get scope mappings API for the client
    const clientScopeMappings = sdk.scopeMappings.forClient(client!.id!);

    // Get all scope mappings for the client
    console.log('\nGetting all scope mappings for the client');

    try {
      const allMappings = await clientScopeMappings.getAll();
      console.log('All scope mappings:', JSON.stringify(allMappings, null, 2));
    } catch (error) {
      console.error('Error getting all scope mappings:', error);
    }

    // Get realm-level scope mappings
    console.log('\nGetting realm-level scope mappings');

    try {
      const realmScopeMappings = await clientScopeMappings.getRealmScopeMappings();
      console.log('Realm scope mappings:', JSON.stringify(realmScopeMappings, null, 2));
    } catch (error) {
      console.error('Error getting realm scope mappings:', error);
    }

    // Get available realm-level scope mappings
    console.log('\nGetting available realm-level scope mappings');

    try {
      const availableRealmScopeMappings =
        await clientScopeMappings.getAvailableRealmScopeMappings();
      console.log(
        'Available realm scope mappings:',
        JSON.stringify(availableRealmScopeMappings, null, 2)
      );
    } catch (error) {
      console.error('Error getting available realm scope mappings:', error);
    }

    // Add realm-level scope mappings
    console.log('\nAdding realm-level scope mappings');

    try {
      await clientScopeMappings.addRealmScopeMappings([role!]);
      console.log(`Added role ${role!.name} to client ${client!.clientId} scope mappings`);
    } catch (error) {
      console.error('Error adding realm scope mappings:', error);
    }

    // Get effective realm-level scope mappings
    console.log('\nGetting effective realm-level scope mappings');

    try {
      const effectiveRealmScopeMappings =
        await clientScopeMappings.getEffectiveRealmScopeMappings();
      console.log(
        'Effective realm scope mappings:',
        JSON.stringify(effectiveRealmScopeMappings, null, 2)
      );
    } catch (error) {
      console.error('Error getting effective realm scope mappings:', error);
    }

    // Delete realm-level scope mappings
    console.log('\nDeleting realm-level scope mappings');

    try {
      await clientScopeMappings.deleteRealmScopeMappings([role!]);
      console.log(`Removed role ${role!.name} from client ${client!.clientId} scope mappings`);
    } catch (error) {
      console.error('Error deleting realm scope mappings:', error);
    }

    // Step 5: Work with client-level scope mappings
    console.log('\nStep 5: Working with client-level scope mappings');

    // Find another client to use for client-level scope mappings
    const clients = await sdk.clients.findAll();
    const targetClient = client!.id ? clients.find(c => c.id !== client!.id) : undefined;
    if (!targetClient || !targetClient.id) {
      console.log('No other client available for client-level scope mappings example');
    } else {
      console.log(`Using target client: ${targetClient.clientId} (${targetClient.id})`);

      let testClientRoleName: string | undefined;
      let clientRole: RoleRepresentation | undefined;

      try {
        // Create a role in the target client
        testClientRoleName = `test-client-role-${Date.now()}`;
        const testClientRole = {
          name: testClientRoleName,
          description: 'Test client role for scope mappings example'
        };

        // Create client role and get ID from response
        await sdk.clients.createRole(targetClient.id, testClientRole);
        clientRole = await sdk.clients.getRole(targetClient.id, testClientRoleName);
        console.log(`Created test client role: ${clientRole.name} (${clientRole.id})`);

        // Get available client-level scope mappings
        console.log('\nGetting available client-level scope mappings');

        try {
          const availableClientScopeMappings =
            await clientScopeMappings.getAvailableClientScopeMappings(targetClient.id);
          console.log(
            'Available client scope mappings:',
            JSON.stringify(availableClientScopeMappings, null, 2)
          );
        } catch (error) {
          console.error('Error getting available client scope mappings:', error);
        }

        // Add client-level scope mappings
        console.log('\nAdding client-level scope mappings');

        try {
          await clientScopeMappings.addClientScopeMappings(targetClient.id, [clientRole]);
          console.log(
            `Added client role ${clientRole.name} to client ${client!.clientId} scope mappings`
          );
        } catch (error) {
          console.error('Error adding client scope mappings:', error);
        }

        // Get client-level scope mappings
        console.log('\nGetting client-level scope mappings');

        try {
          const clientLevelScopeMappings = await clientScopeMappings.getClientScopeMappings(
            targetClient.id
          );
          console.log(
            'Client level scope mappings:',
            JSON.stringify(clientLevelScopeMappings, null, 2)
          );
        } catch (error) {
          console.error('Error getting client scope mappings:', error);
        }

        // Get effective client-level scope mappings
        console.log('\nGetting effective client-level scope mappings');

        try {
          const effectiveClientScopeMappings =
            await clientScopeMappings.getEffectiveClientScopeMappings(targetClient.id);
          console.log(
            'Effective client scope mappings:',
            JSON.stringify(effectiveClientScopeMappings, null, 2)
          );
        } catch (error) {
          console.error('Error getting effective client scope mappings:', error);
        }

        // Delete client-level scope mappings
        console.log('\nDeleting client-level scope mappings');

        try {
          await clientScopeMappings.deleteClientScopeMappings(targetClient.id, [clientRole]);
          console.log(
            `Removed client role ${clientRole.name} from client ${client!.clientId} scope mappings`
          );
        } catch (error) {
          console.error('Error deleting client scope mappings:', error);
        }

        // Clean up client role
        console.log('\nCleaning up client role');

        try {
          await sdk.clients.deleteRole(targetClient.id, clientRole.id!);
          console.log(`Deleted client role ${clientRole.name}`);
        } catch (error) {
          console.error('Error deleting client role:', error);
        }
      } catch (error) {
        console.error('Error in client-level scope mappings example:', error);
      }
    }

    // Step 6: Work with client scope's scope mappings
    console.log("\nStep 6: Working with client scope's scope mappings");

    try {
      // Get scope mappings API for the client scope
      const clientScopeScopeMappings = sdk.scopeMappings.forClientScope(clientScopeId!);

      // Get all scope mappings for the client scope
      console.log('\nGetting all scope mappings for the client scope');

      try {
        const allClientScopeMappings = await clientScopeScopeMappings.getAll();
        console.log('All client scope mappings:', JSON.stringify(allClientScopeMappings, null, 2));
      } catch (error) {
        console.error('Error getting all client scope mappings:', error);
      }

      // Add realm-level scope mappings to the client scope
      console.log('\nAdding realm-level scope mappings to the client scope');

      try {
        await clientScopeScopeMappings.addRealmScopeMappings([role!]);
        console.log(`Added role ${role!.name} to client scope ${testClientScopeName}`);
      } catch (error) {
        console.error('Error adding realm scope mappings to client scope:', error);
      }

      // Get realm-level scope mappings for the client scope
      console.log('\nGetting realm-level scope mappings for the client scope');

      try {
        const clientScopeRealmMappings = await clientScopeScopeMappings.getRealmScopeMappings();
        console.log(
          'Client scope realm mappings:',
          JSON.stringify(clientScopeRealmMappings, null, 2)
        );
      } catch (error) {
        console.error('Error getting client scope realm mappings:', error);
      }

      // Delete realm-level scope mappings from the client scope
      console.log('\nDeleting realm-level scope mappings from the client scope');

      try {
        await clientScopeScopeMappings.deleteRealmScopeMappings([role!]);
        console.log(`Removed role ${role!.name} from client scope ${testClientScopeName}`);
      } catch (error) {
        console.error('Error deleting realm scope mappings from client scope:', error);
      }
    } catch (error) {
      console.error('Error in client scope scope mappings example:', error);
    }

    console.log('\nScope Mappings API example completed successfully!');
  } catch (error) {
    console.error('Error in Scope Mappings API example:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    // Step 7: Clean up test resources
    console.log('\nStep 7: Cleaning up test resources');

    try {
      // Only attempt cleanup if we created resources
      if (testRoleName) {
        // Delete the test role
        try {
          await sdk.roles.delete(testRoleName);
          console.log(`Deleted test role ${testRoleName}`);
        } catch (error) {
          console.warn(
            `Failed to delete test role: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      if (clientScopeId) {
        // Delete the test client scope
        try {
          await sdk.clients.clientScopes.delete(clientScopeId);
          console.log(`Deleted test client scope ${testClientScopeName}`);
        } catch (error) {
          console.warn(
            `Failed to delete test client scope: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Run the example
main().catch(console.error);
