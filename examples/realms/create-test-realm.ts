/**
 * Example: Create a test realm for end-to-end testing
 *
 * This example demonstrates how to create a new realm with basic configuration
 * that can be used for end-to-end testing of the Keycloak Admin SDK.
 */

// Configuration for Keycloak SDK
import { KeycloakConfig } from '../../src/types/auth';
import KeycloakClient from '../../src';
import { RealmRepresentation } from '../../src/types/realms';

/**
 * Generate a unique realm name to avoid conflicts
 * @returns A unique realm name for testing
 */
function generateUniqueRealmName(): string {
  const timestamp = new Date().getTime();
  return `test-realm-${timestamp}`;
}

/**
 * Create a test realm configuration
 * @param realmName The name of the realm to create
 * @returns A realm configuration object
 */
function createTestRealmConfig(realmName: string): RealmRepresentation {
  return {
    realm: realmName,
    displayName: `Test Realm (${realmName})`,
    enabled: true,
    // Set reasonable security defaults for testing
    sslRequired: 'external',
    registrationAllowed: true,
    loginWithEmailAllowed: true,
    duplicateEmailsAllowed: false,
    resetPasswordAllowed: true,
    editUsernameAllowed: true,
    // Set short token lifespans for testing
    accessTokenLifespan: 300, // 5 minutes
    // Set default client settings
    defaultRoles: ['offline_access', 'uma_authorization'],
    // Configure browser security
    browserSecurityHeaders: {
      contentSecurityPolicy: "frame-src 'self'; frame-ancestors 'self'; object-src 'none';",
      xContentTypeOptions: 'nosniff',
      xRobotsTag: 'none',
      xFrameOptions: 'SAMEORIGIN',
      xXSSProtection: '1; mode=block',
      strictTransportSecurity: 'max-age=31536000; includeSubDomains'
    },
    // Configure SMTP for testing (optional)
    smtpServer: {
      host: 'localhost',
      port: '1025',
      from: 'test@example.com',
      fromDisplayName: 'Test Realm'
    },
    // Enable events for testing
    eventsEnabled: true,
    adminEventsEnabled: true,
    adminEventsDetailsEnabled: true
  };
}

// Main execution
(async () => {
  try {
    // Configuration for connecting to Keycloak
    // Note: For creating realms, you need admin access to the master realm
    const config: KeycloakConfig = {
      baseUrl: 'http://localhost:8080',
      realm: 'master', // Use the master realm for administration
      authMethod: 'client',
      credentials: {
        clientId: 'admin-cli',
        clientSecret: 'your-client-secret', // Replace with actual secret if needed
        // Or use username/password for the admin user
        username: 'admin',
        password: 'admin'
      }
    };

    // Initialize the SDK
    const sdk = new KeycloakClient(config);

    // Generate a unique realm name
    const realmName = generateUniqueRealmName();

    // Create the realm configuration
    const realmConfig = createTestRealmConfig(realmName);

    // Create the realm
    await sdk.realms.create(realmConfig);

    // Get the created realm to verify
    const createdRealm = await sdk.realms.get(realmName);

    console.log(
      JSON.stringify(
        {
          id: createdRealm.id,
          realm: createdRealm.realm,
          enabled: createdRealm.enabled,
          displayName: createdRealm.displayName
        },
        null,
        2
      )
    );

    // Create a test client for the realm (this will be implemented in the Clients API)

    // Uncomment to delete the realm when done
    // await sdk.realms.delete(realmName);
    //
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
