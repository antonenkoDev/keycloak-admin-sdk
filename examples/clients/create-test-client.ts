/**
 * Example: Create a test client in a Keycloak realm
 * 
 * This example demonstrates how to create a test client for end-to-end testing
 * using the Keycloak Admin SDK.
 */

import KeycloakAdminSDK from '../../src';
import { ClientRepresentation } from '../../src/types/clients';
import { RealmRepresentation } from '../../src/types/realms';

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
 * Generate a unique client ID for testing
 * @returns A unique client ID
 */
function generateUniqueClientId(): string {
  return `test-client-${Date.now()}`;
}

/**
 * Create a test realm and client for end-to-end testing
 */
async function createTestRealmAndClient() {
  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    
    // Generate unique names for testing
    const realmName = `test-realm-${Date.now()}`;
    const uniqueClientId = generateUniqueClientId();
    
    
    
    // Create a test realm
    const realm: RealmRepresentation = {
      realm: realmName,
      enabled: true,
      displayName: 'Test Realm',
      displayNameHtml: '<div>Test Realm</div>',
      sslRequired: 'external',
      registrationAllowed: true,
      loginWithEmailAllowed: true,
      duplicateEmailsAllowed: false,
      resetPasswordAllowed: true,
      editUsernameAllowed: false,
      bruteForceProtected: true,
      // Enable events for testing
      eventsEnabled: true,
      eventsListeners: ['jboss-logging'],
      adminEventsEnabled: true,
      adminEventsDetailsEnabled: true
    };
    
    // Create the realm
    await sdk.realms.create(realm);
    
    
    // Create a test client
    const client: ClientRepresentation = {
      clientId: uniqueClientId,
      name: 'Test Client',
      description: 'Client for automated testing',
      enabled: true,
      protocol: 'openid-connect',
      publicClient: false,
      serviceAccountsEnabled: true,
      standardFlowEnabled: true,
      implicitFlowEnabled: false,
      directAccessGrantsEnabled: true,
      authorizationServicesEnabled: false,
      redirectUris: ['http://localhost:3000/*'],
      webOrigins: ['+'],
      // Add default client scopes
      defaultClientScopes: ['web-origins', 'profile', 'roles', 'email'],
      // Add optional client scopes
      optionalClientScopes: ['address', 'phone', 'offline_access'],
      // Client attributes
      attributes: {
        'pkce.code.challenge.method': 'S256'
      }
    };
    
    // Create the client in the new realm
    const createdClientId = await sdk.clients.create(client);
    
    
    // Get the client secret
    const clientSecret = await sdk.clients.getClientSecret(createdClientId);
    
    
    
    
    
    
    
    
  } catch (error) {
    console.error('Error creating test realm and client:', error);
  }
}

// Run the example
createTestRealmAndClient();
