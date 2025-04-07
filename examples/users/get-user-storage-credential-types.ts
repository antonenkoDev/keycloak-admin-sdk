import { KeycloakConfig } from '../../src/types/auth';
import KeycloakClient from '../../src';

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
    // Get configured user storage credential types
    const credentialTypes: string[] = await sdk.users.getUserStorageCredentialTypes(userId);
  } catch (error) {
    console.error('Error fetching user storage credential types:', error);
  }
})();
