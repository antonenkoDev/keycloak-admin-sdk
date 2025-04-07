/**
 * Create Test Client Example
 *
 * This example demonstrates how to create a test client in a Keycloak realm
 * with enhanced error handling and ID extraction from Location headers.
 *
 * Features:
 * - ID extraction directly from Location headers in HTTP 201 responses
 * - Robust error handling with detailed error messages
 * - Environment variable configuration
 * - SOLID principles and clean code practices
 * - Proper resource cleanup in finally blocks
 */

import KeycloakAdminSDK from '../../src';
import { ClientRepresentation } from '../../src/types/clients';
import { RealmRepresentation } from '../../src/types/realms';
import { KeycloakConfig } from '../../src/types/auth';
import dotenv from 'dotenv'; // Load environment variables from .env file

// Load environment variables from .env file
dotenv.config();

// Create configuration object with proper typing and environment variables
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

/**
 * Generate a unique client ID for testing
 * @returns A unique client ID
 */
function generateUniqueClientId(): string {
  return `test-client-${Date.now()}`;
}

/**
 * Create a test realm for end-to-end testing
 * @param sdk - Initialized KeycloakAdminSDK instance
 * @param realmName - Name of the realm to create
 * @returns Promise resolving to the created realm name
 */
async function createTestRealm(sdk: KeycloakAdminSDK, realmName: string): Promise<string> {
  console.log(`Creating test realm: ${realmName}`);

  try {
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
    console.log(`Realm created successfully: ${realmName}`);
    return realmName;
  } catch (error) {
    console.error(`Error creating realm ${realmName}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Create a test client in the specified realm
 * @param sdk - Initialized KeycloakAdminSDK instance
 * @param realmName - Name of the realm to create the client in
 * @param clientId - Client ID for the new client
 * @returns Promise resolving to the created client's internal ID
 */
async function createTestClient(
  sdk: KeycloakAdminSDK,
  realmName: string,
  clientId: string
): Promise<string> {
  console.log(`Creating test client with clientId: ${clientId} in realm: ${realmName}`);

  try {
    // Create a new SDK instance configured for the target realm
    const realmSdk = new KeycloakAdminSDK({
      ...config,
      realm: realmName
    });

    // Create a test client
    const client: ClientRepresentation = {
      clientId: clientId,
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

    // Create the client in the new realm and extract ID from Location header
    const createdClientId = await realmSdk.clients.create(client);
    console.log(
      `Client created successfully with ID: ${createdClientId} (extracted from Location header)`
    );
    return createdClientId;
  } catch (error) {
    console.error(`Error creating client ${clientId} in realm ${realmName}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Get and display the client secret
 * @param sdk - Initialized KeycloakAdminSDK instance
 * @param realmName - Name of the realm containing the client
 * @param clientId - Internal ID of the client
 * @returns Promise resolving to the client secret
 */
async function getAndDisplayClientSecret(
  sdk: KeycloakAdminSDK,
  realmName: string,
  clientId: string
): Promise<string> {
  console.log(`Retrieving client secret for client ID: ${clientId}`);

  try {
    // Get the client secret
    // Create a new SDK instance configured for the target realm
    const realmSdk = new KeycloakAdminSDK({
      ...config,
      realm: realmName
    });

    const clientSecret = await realmSdk.clients.getClientSecret(clientId);
    console.log('Client credentials:');
    console.log(`- Client ID: ${clientId}`);
    console.log(`- Client Secret: ${clientSecret.value}`);
    return clientSecret.value!;
  } catch (error) {
    console.error(`Error retrieving client secret for client ${clientId}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Main function to create a test realm and client for end-to-end testing
 */
async function createTestRealmAndClient() {
  console.log('Starting Create Test Client example...');

  // Generate unique names for testing
  const realmName = `test-realm-${Date.now()}`;
  const uniqueClientId = generateUniqueClientId();
  let createdClientInternalId: string | null = null;

  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    console.log(`Connected to Keycloak at ${config.baseUrl}`);

    // Create test realm
    await createTestRealm(sdk, realmName);

    // Create test client
    createdClientInternalId = await createTestClient(sdk, realmName, uniqueClientId);

    // Get client secret
    await getAndDisplayClientSecret(sdk, realmName, createdClientInternalId);

    console.log('\nTest client creation summary:');
    console.log(`- Realm: ${realmName}`);
    console.log(`- Client ID: ${uniqueClientId}`);
    console.log(`- Internal ID: ${createdClientInternalId}`);
    console.log('\nYou can now use these credentials for testing.');
    console.log(`To clean up, delete the realm '${realmName}' when testing is complete.`);

    return {
      realmName,
      clientId: uniqueClientId,
      internalId: createdClientInternalId
    };
  } catch (error) {
    console.error('\nError creating test realm and client:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    } else {
      console.error(error);
    }

    // Attempt cleanup if partial creation occurred
    if (createdClientInternalId) {
      console.log('\nAttempting to clean up partially created resources...');
      try {
        const sdk = new KeycloakAdminSDK(config);
        await sdk.realms.delete(realmName);
        console.log(`Successfully cleaned up realm: ${realmName}`);
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }

    return null;
  }
}

// Run the example
(async () => {
  try {
    const result = await createTestRealmAndClient();
    if (result) {
      console.log('\nCreate Test Client example completed successfully!');
    } else {
      console.error('\nCreate Test Client example failed!');
    }
  } catch (error) {
    console.error('\nUnhandled error in Create Test Client example:', error);
  }
})();
