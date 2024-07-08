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
        const userId = 'some-user-id';
        // Delete user
        await sdk.users.delete(userId);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
})();
