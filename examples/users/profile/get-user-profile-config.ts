import { KeycloakConfig } from '../../../src/types/auth';
import { UPConfig } from '../../../src/types/users';
import KeycloakClient from '../../../src'; // Configuration for Keycloak SDK

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
    // Get user profile configuration
    const profileConfig: UPConfig = await sdk.users.getUserProfileConfig();
  } catch (error) {
    console.error('Error fetching user profile config:', error);
  }
})();
