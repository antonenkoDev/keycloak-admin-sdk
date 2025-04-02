/**
 * Test Setup Utilities
 * 
 * Provides helper functions for setting up and tearing down the test environment
 */

import KeycloakAdminSDK from '../../../src';
import { RealmRepresentation } from '../../../src/types/realms';
import { ClientRepresentation } from '../../../src/types/clients';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration for connecting to Keycloak from environment variables
export const config = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: (process.env.KEYCLOAK_AUTH_METHOD === 'bearer' ? 'bearer' : 
               process.env.KEYCLOAK_AUTH_METHOD === 'client' ? 'client' : 'password') as 'password' | 'bearer' | 'client',
  credentials: {
    username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli'
  }
};

// Test timeout from environment variables
export const TEST_TIMEOUT = parseInt(process.env.TEST_TIMEOUT || '30000', 10);

/**
 * Generate a unique name with a prefix for testing
 * @param prefix The prefix to use for the name
 * @returns A unique name
 */
export function generateUniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Test environment context
 */
export interface TestContext {
  sdk: KeycloakAdminSDK;
  realmName: string;
  clientId?: string;
  clientId2?: string; // Additional client ID for testing
  clientSecret?: string;
  groupIds?: string[];
  userIds?: string[];
  [key: string]: any; // Allow for additional properties
}

/**
 * Setup a test environment with a realm and client
 * @returns TestContext with SDK and created resources
 */
export async function setupTestEnvironment(): Promise<TestContext> {
  const sdk = new KeycloakAdminSDK(config);
  const realmName = generateUniqueName('test-realm');
  
  // Create a test realm
  const realm: RealmRepresentation = {
    realm: realmName,
    enabled: true,
    displayName: 'E2E Test Realm',
    displayNameHtml: '<div>E2E Test Realm</div>',
    sslRequired: 'external',
    registrationAllowed: true,
    loginWithEmailAllowed: true,
    duplicateEmailsAllowed: false,
    resetPasswordAllowed: true,
    editUsernameAllowed: false,
    bruteForceProtected: true,
    eventsEnabled: true,
    eventsListeners: ['jboss-logging'],
    adminEventsEnabled: true,
    adminEventsDetailsEnabled: true
  };
  
  try {
    console.log(`Attempting to create test realm: ${realmName}`);
    console.log(`Using Keycloak at: ${config.baseUrl}`);
    console.log(`Authentication method: ${config.authMethod}`);
    await sdk.realms.create(realm);
    console.log(`Created test realm: ${realmName}`);
  } catch (error) {
    console.error('Error creating test realm:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
  
  return {
    sdk,
    realmName,
    groupIds: [],
    userIds: []
  };
}

/**
 * Create a test client in the test realm
 * @param context The test context
 * @returns Updated test context with client information
 */
export async function createTestClient(context: TestContext): Promise<TestContext> {
  const { sdk, realmName } = context;
  
  // Following SOLID principles - Single Responsibility: Generate unique name
  const clientIdName = generateUniqueName('test-client');
  
  // Create a minimal test client following Clean Code principles
  const client: ClientRepresentation = {
    clientId: clientIdName,
    name: 'E2E Test Client',
    description: 'Client for automated E2E testing',
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
    defaultClientScopes: ['web-origins', 'profile', 'roles', 'email'],
    optionalClientScopes: ['address', 'phone', 'offline_access'],
    attributes: {
      'pkce.code.challenge.method': 'S256'
    }
  };
  
  try {
    // Create the client in the test realm
    console.log(`Creating test client: ${clientIdName} in realm: ${realmName}`);
    
    // First check if a client with this ID already exists
    const existingClients = await sdk.clients.findAll(clientIdName);
    let createdClientId: string | undefined;
    
    if (existingClients && existingClients.length > 0 && existingClients[0].id) {
      // Use the existing client
      createdClientId = existingClients[0].id;
      console.log(`Using existing client with ID: ${createdClientId}`);
    } else {
      // Create a new client
      try {
        createdClientId = await sdk.clients.create(client);
      } catch (createError) {
        console.error(`Error creating client: ${createError instanceof Error ? createError.message : String(createError)}`);
        // Try to find the client by clientId in case it was created despite the error
        const possiblyCreatedClients = await sdk.clients.findAll(clientIdName);
        if (possiblyCreatedClients && possiblyCreatedClients.length > 0 && possiblyCreatedClients[0].id) {
          createdClientId = possiblyCreatedClients[0].id;
          console.log(`Found client that was created despite error, ID: ${createdClientId}`);
        }
      }
    }
    
    if (!createdClientId) {
      console.error('Failed to create client: No client ID returned');
      return context; // Return the original context without client info
    }
    
    console.log(`Using test client: ${clientIdName} with ID: ${createdClientId}`);
    
    // Get the client secret with better error handling
    let clientSecret;
    try {
      console.log(`Getting client secret for client ID: ${createdClientId}`);
      clientSecret = await sdk.clients.getClientSecret(createdClientId);
      
      return {
        ...context,
        clientId: createdClientId,
        clientSecret: clientSecret.value
      };
    } catch (error) {
      console.error(`Failed to get client secret: ${error instanceof Error ? error.message : String(error)}`);
      // Return context with client ID but without secret
      return {
        ...context,
        clientId: createdClientId
      };
    }
  } catch (error) {
    console.error(`Failed to create client: ${error instanceof Error ? error.message : String(error)}`);
    
    // Try to create a second client with a different name as a fallback
    try {
      const fallbackClientIdName = generateUniqueName('fallback-client');
      console.log(`Attempting to create fallback client: ${fallbackClientIdName}`);
      
      // Create a simpler client for fallback with minimal configuration
      const fallbackClient: ClientRepresentation = {
        clientId: fallbackClientIdName,
        name: 'Fallback E2E Test Client',
        enabled: true,
        publicClient: true, // Make it a public client to avoid secret issues
        directAccessGrantsEnabled: true,
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        serviceAccountsEnabled: false,
        redirectUris: ['http://localhost:3000/*'],
        webOrigins: ['+'],
      };
      
      const fallbackClientId = await sdk.clients.create(fallbackClient);
      if (fallbackClientId) {
        console.log(`Created fallback client with ID: ${fallbackClientId}`);
        return {
          ...context,
          clientId: fallbackClientId
        };
      }
    } catch (fallbackError) {
      console.error(`Failed to create fallback client: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
    }
    
    return context; // Return the original context without client info
  }
}

/**
 * Clean up the test environment by deleting all created resources
 * @param context The test context
 */
export async function cleanupTestEnvironment(context: TestContext): Promise<void> {
  const { sdk, realmName, userIds, groupIds, clientId } = context;
  
  try {
    // Delete users if any were created
    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        try {
          await sdk.users.delete(userId);
          console.log(`Deleted test user: ${userId}`);
        } catch (error) {
          console.error(`Failed to delete user ${userId}:`, error);
        }
      }
    }
    
    // Delete groups if any were created
    if (groupIds && groupIds.length > 0) {
      for (const groupId of groupIds) {
        try {
          // First check if the group exists
          console.log(`Checking if group ${groupId} exists before deletion`);
          try {
            await sdk.groups.get(groupId);
            // If we get here, the group exists, so delete it
            await sdk.groups.delete(groupId);
            console.log(`Deleted test group: ${groupId}`);
          } catch (getError) {
            // Group doesn't exist, so no need to delete
            console.log(`Group ${groupId} doesn't exist, skipping deletion`);
          }
        } catch (error) {
          console.error(`Failed to delete group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    // Delete client if created
    if (clientId) {
      try {
        await sdk.clients.delete(clientId);
        console.log(`Deleted test client: ${clientId}`);
      } catch (error) {
        console.error(`Failed to delete client ${clientId}:`, error);
      }
    }
    
    // Delete the test realm
    try {
      await sdk.realms.delete(realmName);
      console.log(`Deleted test realm: ${realmName}`);
    } catch (error) {
      console.error(`Failed to delete realm ${realmName}:`, error);
    }
  } catch (error) {
    console.error('Error during test cleanup:', error);
    throw error;
  }
}
