import KeycloakAdminSDK from '../../src';
import {KeycloakConfig} from "../../src/types/auth";

// Configuration for Keycloak SDK
const config: KeycloakConfig = {
    baseUrl: 'http://localhost:8080',
    realm: 'your-realm',
    authMethod: 'client',
    credentials: {
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
    },
};

// Instantiate Keycloak SDK
const sdk = new KeycloakAdminSDK(config);

(async () => {
    try {
        // Get user count with optional filters
        const userCount = await sdk.users.count({ enabled: true, emailVerified: true });
        console.log('User count:', userCount);
    } catch (error) {
        console.error('Error fetching user count:', error);
    }
})();
