/**
 * Example: List clients in a Keycloak realm
 * 
 * This example demonstrates how to list clients in a realm
 * using the Keycloak Admin SDK.
 */

import KeycloakAdminSDK from '../../src';
import { ClientRepresentation } from '../../src/types/clients';

// Configuration for connecting to Keycloak
const config = {
  baseUrl: 'http://localhost:8080',
  realm: 'master',
  authMethod: 'password' as const,
  credentials: {
    username: 'admin',
    password: 'admin',
    clientId: 'admin-cli'
  }
};

/**
 * List all clients in a realm
 * @param realmName The name of the realm to list clients from
 */
async function listClients(realmName: string): Promise<void> {
  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    
    console.log(`Listing clients in realm: ${realmName}`);
    
    // List all clients
    const clients = await sdk.clients.findAll();
    
    if (clients.length === 0) {
      console.log('No clients found in this realm.');
      return;
    }
    
    // Display client information
    console.log(`Found ${clients.length} clients:`);
    clients.forEach((client: ClientRepresentation, index: number) => {
      console.log(`\n${index + 1}. Client: ${client.clientId}`);
      console.log(`   ID: ${client.id}`);
      console.log(`   Name: ${client.name || 'N/A'}`);
      console.log(`   Description: ${client.description || 'N/A'}`);
      console.log(`   Enabled: ${client.enabled ? 'Yes' : 'No'}`);
      console.log(`   Public Client: ${client.publicClient ? 'Yes' : 'No'}`);
      console.log(`   Protocol: ${client.protocol || 'N/A'}`);
      
      // Display redirect URIs if available
      if (client.redirectUris && client.redirectUris.length > 0) {
        console.log('   Redirect URIs:');
        client.redirectUris.forEach((uri: string) => {
          console.log(`     - ${uri}`);
        });
      }
    });
    
  } catch (error) {
    console.error('Error listing clients:', error);
  }
}

// Run the example with the master realm (or specify another realm)
const targetRealm = process.argv[2] || 'master';
listClients(targetRealm);
