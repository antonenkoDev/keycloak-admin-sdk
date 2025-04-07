# Keycloak Admin SDK

A TypeScript SDK for interacting with the Keycloak Admin REST API.

## Features

- Comprehensive TypeScript definitions for Keycloak Admin API entities
- Support for all major Keycloak Admin REST API endpoints
- Clean, SOLID-based architecture
- Enhanced error handling and debugging capabilities
- Optimized resource creation with ID extraction from Location headers
- Comprehensive APIs for Organizations, Scope Mappings, and Role Mappings
- End-to-end testing capabilities with robust error handling

## Installation

```bash
npm install keycloak-admin-sdk
```

## Usage

```typescript
import KeycloakAdminSDK from 'keycloak-admin-sdk';

// Initialize the SDK
const sdk = new KeycloakAdminSDK({
  baseUrl: 'http://localhost:8080',
  realm: 'master',
  authMethod: 'password',
  credentials: {
    username: 'admin',
    password: 'admin',
    clientId: 'admin-cli'
  }
});

// Example: List all users
async function listUsers() {
  try {
    const users = await sdk.users.list();
    
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email})`);
    });
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

listUsers();
```

## API Documentation

The SDK provides the following main API classes:

- `UsersApi`: Methods for managing users
- `GroupsApi`: Methods for managing groups
- `RealmsApi`: Methods for managing realms
- `ClientsApi`: Methods for managing clients
- `OrganizationsApi`: Methods for managing organizations and their members
- `RolesApi`: Methods for managing roles and composite roles
- `RoleMappingsApi`: Methods for managing role mappings for users and groups
- `ScopeMappingsApi`: Methods for managing scope mappings for clients and client scopes
- `ComponentApi`: Methods for managing components

Each API class provides methods for CRUD operations and more specialized functionality, with robust error handling and detailed logging for easier debugging.

## End-to-End Testing

The SDK includes comprehensive end-to-end tests that verify functionality against a running Keycloak instance.

### Setting Up Tests

1. Copy the `.env.sample` file to `.env` and configure your Keycloak connection:

```bash
cp .env.sample .env
```

2. Edit the `.env` file with your Keycloak server details:

```
# Keycloak Server Configuration
KEYCLOAK_BASE_URL=http://localhost:8080
KEYCLOAK_REALM=master
KEYCLOAK_AUTH_METHOD=password

# Admin Credentials
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KEYCLOAK_ADMIN_CLIENT_ID=admin-cli

# Test Configuration
TEST_TIMEOUT=30000
```

3. Make sure you have a running Keycloak instance available at the specified URL.

### Running Tests

To run the end-to-end tests:

```bash
npm run test:e2e
```

The tests will:
1. Create a test realm and client
2. Test the Realms API functionality
3. Test the Clients API functionality
4. Create and test groups and users
5. Clean up all created resources

## Examples

Check the `examples` directory for more usage examples:

- Realm management
- Client management
- User and group operations
- Organization management
- Role and role mappings management
- Scope mappings management
- Error handling and debugging techniques

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
