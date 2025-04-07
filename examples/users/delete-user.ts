import KeycloakClient from '../../src';
import { KeycloakConfig } from '../../src/types/auth'; // Configuration for Keycloak SDK

// Configuration for Keycloak SDK
const config: KeycloakConfig = {
  baseUrl: 'http://localhost:8080',
  realm: 'your-realm',
  authMethod: 'client',
  credentials: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret'
  }
};

// Instantiate Keycloak SDK
const sdk = new KeycloakClient(config);

(async () => {
  try {
    const userId = 'some-user-id';
    // Delete user
    await sdk.users.delete(userId);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
})();
