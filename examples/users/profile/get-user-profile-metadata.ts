import {KeycloakConfig} from "../../../src/types/auth";
import KeycloakAdminSDK from "../../../src";
import {UserProfileMetadata} from "../../../src/types/users";

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
        // Get user profile metadata
        await sdk.users.getUserProfileMetadata();
    } catch (error) {
        console.error('Error fetching user profile metadata:', error);
    }
})();
