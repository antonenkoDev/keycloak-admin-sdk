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
        const users = await sdk.users.list({ enabled: true, max: 10 });
        console.log(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
})();
