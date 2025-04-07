/**
 * Create User Example
 *
 * This example demonstrates how to create a new user in Keycloak
 * with enhanced error handling and ID extraction from Location headers.
 *
 * Features:
 * - ID extraction directly from Location headers in HTTP 201 responses
 * - Robust error handling with detailed error messages
 * - Environment variable configuration
 * - SOLID principles and clean code practices
 */

import { UserRepresentation } from '../../src/types/users';
import { KeycloakConfig } from '../../src/types/auth';
import KeycloakClient from '../../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create configuration object with proper typing and environment variables
const config: KeycloakConfig = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: 'password',
  credentials: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
    username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'
  }
};

/**
 * Main function to create a user in Keycloak
 */
async function createUser() {
  console.log('Starting Create User example...');

  try {
    // Initialize the Keycloak Admin SDK
    const sdk = new KeycloakClient(config);
    console.log(`Connected to Keycloak at ${config.baseUrl}`);

    // Create a unique username to avoid conflicts
    const timestamp = Date.now();
    const username = `test-user-${timestamp}`;

    // Prepare user data
    const newUser: UserRepresentation = {
      username,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      enabled: true,
      // Add credentials if needed
      credentials: [
        {
          type: 'password',
          value: 'password123',
          temporary: false
        }
      ]
    };

    console.log(`Creating user with username: ${username}`);

    try {
      // Create user and get ID directly from Location header
      const userId = await sdk.users.create(newUser);
      console.log(`User created successfully with ID: ${userId} (extracted from Location header)`);

      // Verify user was created by fetching it
      try {
        // Use list method with username filter to find the created user
        const users = await sdk.users.list({ username });
        if (users && users.length > 0) {
          const createdUser = users[0];
          console.log('User details:');
          console.log(`- ID: ${createdUser.id}`);
          console.log(`- Username: ${createdUser.username}`);
          console.log(`- Email: ${createdUser.email}`);
          console.log(`- First Name: ${createdUser.firstName}`);
          console.log(`- Last Name: ${createdUser.lastName}`);
          console.log(`- Enabled: ${createdUser.enabled}`);
        } else {
          console.warn('User was created but could not be retrieved');
        }
      } catch (error) {
        console.error('Error retrieving created user:', error);
      }

      return userId;
    } catch (error) {
      console.error('Error creating user:');
      if (error instanceof Error) {
        console.error(`- Message: ${error.message}`);
        console.error(`- Stack: ${error.stack}`);
      } else {
        console.error(error);
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to create user in Keycloak');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    }
    return null;
  }
}

// Execute the example
(async () => {
  try {
    const userId = await createUser();
    if (userId) {
      console.log('\nCreate User example completed successfully!');
    } else {
      console.error('\nCreate User example failed!');
    }
  } catch (error) {
    console.error('\nUnhandled error in Create User example:', error);
  }
})();
