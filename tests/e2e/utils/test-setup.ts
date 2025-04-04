/**
 * Test Setup Utilities
 *
 * Provides helper functions for setting up and tearing down the test environment
 */

import KeycloakAdminSDK from '../../../src';
import { RealmRepresentation } from '../../../src/types/realms';
import { ClientRepresentation as ClientRep } from '../../../src/types/clients';
import { KeycloakConfig } from '../../../src/types/auth';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration for connecting to Keycloak from environment variables
export const config = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: (process.env.KEYCLOAK_AUTH_METHOD === 'bearer'
    ? 'bearer'
    : process.env.KEYCLOAK_AUTH_METHOD === 'client'
      ? 'client'
      : 'password') as 'password' | 'bearer' | 'client',
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
 * Set up a test environment with a realm and client
 * @returns TestContext with SDK and created resources
 */
export async function setupTestEnvironment(): Promise<TestContext> {
  // Create initial SDK instance for admin operations
  const adminSdk = new KeycloakAdminSDK(config);
  const realmName = generateUniqueName('test-realm');

  // Create a test realm with email configuration and authorization enabled
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
    adminEventsDetailsEnabled: true,
    organizationsEnabled: true,
    // Enable authorization features
    revokeRefreshToken: true,
    accessTokenLifespan: 300,
    accessTokenLifespanForImplicitFlow: 900,
    ssoSessionIdleTimeout: 1800,
    ssoSessionMaxLifespan: 36000,
    offlineSessionIdleTimeout: 2592000,
    accessCodeLifespan: 60,
    accessCodeLifespanUserAction: 300,
    accessCodeLifespanLogin: 1800,
    actionTokenGeneratedByAdminLifespan: 43200,
    actionTokenGeneratedByUserLifespan: 300,
    // Email configuration for the test realm
    smtpServer: {
      host: 'mailhog', // Use the Docker service name
      port: '1025',
      from: 'keycloak@localhost',
      fromDisplayName: 'Keycloak Test',
      ssl: 'false',
      starttls: 'false',
      auth: 'false'
    }
  };

  try {
    // Create the realm using the admin SDK
    await adminSdk.realms.create(realm);

    // Verify email configuration after realm creation
    try {
      const createdRealm = await adminSdk.realms.get(realmName);
      if (createdRealm.smtpServer) {
      } else {
        console.warn(`Email configuration not found in created realm ${realmName}`);
      }
    } catch (error) {
      console.error(
        `Error verifying email configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Create an admin user in the test realm
    const adminUsername = 'test-admin';
    const adminPassword = 'test-password';

    // Create the admin user using the master realm SDK with all required fields
    // Following SOLID principles - complete user representation with all required fields
    const adminUser = {
      username: adminUsername,
      enabled: true,
      emailVerified: true,
      firstName: 'Test',
      lastName: 'Admin',
      email: 'test-admin@example.com', // Email is required for a fully set up account
      credentials: [
        {
          type: 'password',
          value: adminPassword,
          temporary: false
        }
      ],
      // Adding required attributes and roles
      attributes: {
        phoneNumber: ['555-1234']
      },
      requiredActions: [], // No required actions to complete
      // Include all necessary roles for authorization management
      realmRoles: [
        'admin',
        'offline_access',
        'uma_authorization',
        'create-realm',
        'manage-users',
        'manage-clients',
        'manage-realm',
        'manage-events',
        'manage-authorization'
      ]
    };

    // Create the admin user in the test realm
    const adminUserId = await adminSdk.requestForRealm<{ id: string }>(
      realmName,
      '/users',
      'POST',
      adminUser
    );

    // Assign the admin role to the user
    // First, get the realm-management client ID
    interface ClientRepresentation {
      id: string;
      clientId: string;
    }

    const clients = await adminSdk.requestForRealm<ClientRepresentation[]>(
      realmName,
      '/clients',
      'GET'
    );
    const realmManagementClient = clients.find(client => client.clientId === 'realm-management');

    if (!realmManagementClient || !realmManagementClient.id) {
      throw new Error('Could not find realm-management client');
    }

    // Get the realm-admin role ID
    interface RoleRepresentation {
      id: string;
      name: string;
    }

    const roles = await adminSdk.requestForRealm<RoleRepresentation[]>(
      realmName,
      `/clients/${realmManagementClient.id}/roles`,
      'GET'
    );

    const adminRole = roles.find(role => role.name === 'realm-admin');

    if (!adminRole || !adminRole.id) {
      throw new Error('Could not find realm-admin role');
    }

    // Assign the role to the user
    await adminSdk.requestForRealm<void>(
      realmName,
      `/users/${adminUserId.id}/role-mappings/clients/${realmManagementClient.id}`,
      'POST',
      [adminRole]
    );

    // Create a new SDK instance that uses the test realm admin credentials
    const testRealmConfig: KeycloakConfig = {
      baseUrl: config.baseUrl,
      realm: realmName,
      authMethod: 'password' as const, // Type assertion to ensure correct type
      credentials: {
        username: adminUsername,
        password: adminPassword,
        clientId: 'admin-cli'
      }
    };

    const sdk = new KeycloakAdminSDK(testRealmConfig);

    // Return context with the SDK and realm name
    return {
      sdk,
      realmName,
      groupIds: [],
      userIds: [adminUserId.id] // Track the admin user ID for cleanup
    };
  } catch (error) {
    console.error('Error creating test realm:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }

  // This code should not be reached as we return in the try block
  // But just in case, create a new SDK instance for the test realm
  return {
    sdk: new KeycloakAdminSDK({ ...config, realm: realmName }),
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
  const { sdk } = context;

  // Following SOLID principles - Single Responsibility: Generate unique name
  const clientIdName = generateUniqueName('test-client');

  // Create a minimal test client following Clean Code principles
  const client: ClientRep = {
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
    authorizationServicesEnabled: true,
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

    // First check if a client with this ID already exists
    const existingClients = await sdk.clients.findAll(clientIdName);
    let createdClientId: string | undefined;

    if (existingClients && existingClients.length > 0 && existingClients[0].id) {
      // Use the existing client
      createdClientId = existingClients[0].id;
    } else {
      // Create a new client
      try {
        createdClientId = await sdk.clients.create(client);
      } catch (createError) {
        console.error(
          `Error creating client: ${createError instanceof Error ? createError.message : String(createError)}`
        );
        // Try to find the client by clientId in case it was created despite the error
        const possiblyCreatedClients = await sdk.clients.findAll(clientIdName);
        if (
          possiblyCreatedClients &&
          possiblyCreatedClients.length > 0 &&
          possiblyCreatedClients[0].id
        ) {
          createdClientId = possiblyCreatedClients[0].id;
        }
      }
    }

    if (!createdClientId) {
      console.error('Failed to create client: No client ID returned');
      return context; // Return the original context without client info
    }

    // Get the client secret with better error handling
    let clientSecret;
    try {
      clientSecret = await sdk.clients.getClientSecret(createdClientId);

      return {
        ...context,
        clientId: createdClientId,
        clientSecret: clientSecret.value
      };
    } catch (error) {
      console.error(
        `Failed to get client secret: ${error instanceof Error ? error.message : String(error)}`
      );
      // Return context with client ID but without secret
      return {
        ...context,
        clientId: createdClientId
      };
    }
  } catch (error) {
    console.error(
      `Failed to create client: ${error instanceof Error ? error.message : String(error)}`
    );

    // Try to create a second client with a different name as a fallback
    try {
      const fallbackClientIdName = generateUniqueName('fallback-client');

      // Create a simpler client for fallback with minimal configuration
      const fallbackClient: ClientRep = {
        clientId: fallbackClientIdName,
        name: 'Fallback E2E Test Client',
        enabled: true,
        publicClient: true, // Make it a public client to avoid secret issues
        directAccessGrantsEnabled: true,
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        serviceAccountsEnabled: false,
        authorizationServicesEnabled: true,
        redirectUris: ['http://localhost:3000/*'],
        webOrigins: ['+']
      };

      const fallbackClientId = await sdk.clients.create(fallbackClient);
      if (fallbackClientId) {
        return {
          ...context,
          clientId: fallbackClientId
        };
      }
    } catch (fallbackError) {
      console.error(
        `Failed to create fallback client: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`
      );
    }

    return context; // Return the original context without client info
  }
}

/**
 * Clean up the test environment by deleting all created resources
 * @param context The test context
 */
/**
 * Create a test user in the specified realm
 *
 * @param sdk - KeycloakAdminSDK instance
 * @returns Created user representation
 */
export async function createTestUser(sdk: KeycloakAdminSDK) {
  try {
    // Generate a unique username
    const username = generateUniqueName('test-user');

    // Create user
    const userId = await sdk.users.create({
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });

    // Get the full user representation
    return await sdk.users.get(userId);
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

/**
 * Create a test group in the specified realm
 *
 * @param sdk - KeycloakAdminSDK instance
 * @returns Created group representation
 */
export async function createTestGroup(sdk: KeycloakAdminSDK) {
  try {
    // Generate a unique group name
    const groupName = generateUniqueName('test-group');

    // Create group - using the enhanced API that returns the ID directly
    const groupId = await sdk.groups.create({
      name: groupName
    });

    // Get the full group representation
    return await sdk.groups.get(groupId);
  } catch (error) {
    console.error('Error creating test group:', error);
    throw error;
  }
}

/**
 * Clean up the test environment by deleting all created resources
 *
 * @param context The test context
 * @returns Promise that resolves when cleanup is complete
 */
export async function cleanupTestEnvironment(context: TestContext): Promise<void> {
  const { sdk, realmName, userIds, groupIds, clientId } = context;

  try {
    // Delete users if any were created
    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        try {
          await sdk.users.delete(userId);
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

          try {
            await sdk.groups.get(groupId);
            // If we get here, the group exists, so delete it
            await sdk.groups.delete(groupId);
          } catch (getError) {
            // Group doesn't exist, so no need to delete
          }
        } catch (error) {
          console.error(
            `Failed to delete group ${groupId}: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    }

    // Delete client if created
    if (clientId) {
      try {
        await sdk.clients.delete(clientId);
      } catch (error) {}
    }

    // Create an admin SDK instance to delete the realm
    // Important: Use the master realm for admin operations
    const adminSdk = new KeycloakAdminSDK({
      ...config,
      realm: 'master' // Always use master realm for administrative operations
    });

    // Delete the test realm using the admin SDK
    try {
      await adminSdk.realms.delete(realmName);
    } catch (error) {
      console.error(`Failed to delete realm ${realmName}:`, error);
    }
  } catch (error) {
    console.error('Error during test cleanup:', error);
    throw error;
  }
}
