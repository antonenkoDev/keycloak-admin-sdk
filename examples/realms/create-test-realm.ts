/**
 * Example: Create a test realm for end-to-end testing
 * 
 * This example demonstrates how to create a new realm with basic configuration
 * that can be used for end-to-end testing of the Keycloak Admin SDK.
 */

// Configuration for Keycloak SDK
import { KeycloakConfig } from "../../src/types/auth";
import KeycloakAdminSDK from "../../src";
import { RealmRepresentation } from "../../src/types/realms";

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
            'contentSecurityPolicy': "frame-src 'self'; frame-ancestors 'self'; object-src 'none';",
            'xContentTypeOptions': 'nosniff',
            'xRobotsTag': 'none',
            'xFrameOptions': 'SAMEORIGIN',
            'xXSSProtection': '1; mode=block',
            'strictTransportSecurity': 'max-age=31536000; includeSubDomains'
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
                password: 'admin',
            },
        };

        // Initialize the SDK
        const sdk = new KeycloakAdminSDK(config);

        // Generate a unique realm name
        const realmName = generateUniqueRealmName();
        console.log(`Creating test realm: ${realmName}`);

        // Create the realm configuration
        const realmConfig = createTestRealmConfig(realmName);

        // Create the realm
        await sdk.realms.create(realmConfig);
        console.log(`Successfully created realm: ${realmName}`);

        // Get the created realm to verify
        const createdRealm = await sdk.realms.get(realmName);
        console.log('Created realm details:');
        console.log(JSON.stringify({
            id: createdRealm.id,
            realm: createdRealm.realm,
            enabled: createdRealm.enabled,
            displayName: createdRealm.displayName
        }, null, 2));

        // Create a test client for the realm (this will be implemented in the Clients API)
        console.log(`\nNext steps:`);
        console.log(`1. Implement the Clients API to create test clients in the realm`);
        console.log(`2. Create test users and groups in the realm`);
        console.log(`3. Run end-to-end tests against the realm`);
        console.log(`4. Clean up the realm when testing is complete`);

        // Uncomment to delete the realm when done
        // await sdk.realms.delete(realmName);
        // console.log(`Deleted test realm: ${realmName}`);
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    }
})();
