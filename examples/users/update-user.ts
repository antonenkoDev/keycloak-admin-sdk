import KeycloakAdminSDK from '../../src';
import {KeycloakConfig} from "../../src/types/auth";
import {UserRepresentation} from "../../src/types/users";

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
        // Get user representation
        const user: UserRepresentation = await sdk.users.get(userId);

        // Update user representation
        const updatedUser: UserRepresentation = { ...user, firstName: 'UpdatedName' };
        await sdk.users.update(userId, updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
    }
})();
