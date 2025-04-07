/**
 * Example: List all client scopes in a realm
 *
 * This example demonstrates how to retrieve all client scopes from a Keycloak realm
 * using the Keycloak Admin SDK.
 */

import KeycloakClient from '../../src/index';
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
 * List all client scopes in the realm
 */
async function listClientScopes() {
  try {
    // Get all client scopes

    const clientScopes = await sdk.clients.clientScopes.findAll();

    // Display the client scopes

    clientScopes.forEach(scope => {
      console.log(`- ${scope.name} (${scope.id})`);

      // Display attributes if available
      if (scope.attributes && Object.keys(scope.attributes).length > 0) {
        Object.entries(scope.attributes).forEach(([key, value]) => {});
      }

      // Display protocol mappers if available
      if (scope.protocolMappers && scope.protocolMappers.length > 0) {
        console.log(`  Protocol Mappers (${scope.protocolMappers.length}):`);
        scope.protocolMappers.forEach(mapper => {
          console.log(`    - ${mapper.name} (${mapper.protocol})`);
        });
      }

      // Empty line for better readability
    });
  } catch (error) {
    console.error('Error listing client scopes:', error);
  }
}

// Execute the function
listClientScopes().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
