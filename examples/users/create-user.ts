import {UserRepresentation} from "../../src/types/users";
import {KeycloakConfig} from "../../src/types/auth";
import KeycloakAdminSDK from "../../src";

const config: KeycloakConfig = {
    baseUrl: 'http://localhost:8080',
    realm: 'your-realm',
    authMethod: 'client',
    credentials: {
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
    },
};

const sdk = new KeycloakAdminSDK(config);

(async () => {
    try {
        const newUser: UserRepresentation = {
            username: 'newuser',
            email: 'newuser@example.com',
            firstName: 'New',
            lastName: 'User',
            enabled: true,
        };

        const createdUser = await sdk.users.create(newUser);
        console.log(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
    }
})();
