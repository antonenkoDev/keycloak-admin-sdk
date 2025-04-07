/**
 * Get User Example
 *
 * This example demonstrates how to retrieve a user from Keycloak
 * with enhanced error handling and proper logging.
 *
 * Features:
 * - Robust error handling with detailed error messages
 * - Environment variable configuration
 * - SOLID principles and clean code practices
 * - Detailed logging of user information
 */

import { KeycloakConfig } from '../../src/types/auth';
import { UserRepresentation } from '../../src/types/users';
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
 * Fetch and display user details
 * @param userId - The ID of the user to retrieve
 * @returns Promise<UserRepresentation | null> - The user representation or null if not found
 */
async function getUserDetails(userId: string): Promise<UserRepresentation | null> {
  if (!userId) {
    console.error('Error: User ID is required');
    return null;
  }

  console.log(`Retrieving user with ID: ${userId}`);

  try {
    // Initialize the Keycloak Admin SDK
    const sdk = new KeycloakClient(config);
    console.log(`Connected to Keycloak at ${config.baseUrl}`);

    try {
      // Get user representation with profile metadata
      const user = await sdk.users.get(userId, { userProfileMetadata: true });

      if (!user) {
        console.warn(`No user found with ID: ${userId}`);
        return null;
      }

      // Display user information
      console.log('\nUser details:');
      console.log(`- ID: ${user.id}`);
      console.log(`- Username: ${user.username}`);
      console.log(`- Email: ${user.email || 'Not set'}`);
      console.log(`- First Name: ${user.firstName || 'Not set'}`);
      console.log(`- Last Name: ${user.lastName || 'Not set'}`);
      console.log(`- Enabled: ${user.enabled}`);
      console.log(`- Email Verified: ${user.emailVerified}`);
      console.log(`- Created Timestamp: ${user.createdTimestamp}`);

      // Display user attributes if available
      if (user.attributes) {
        console.log('\nUser attributes:');
        Object.entries(user.attributes).forEach(([key, value]) => {
          console.log(`- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
        });
      }

      return user;
    } catch (error) {
      console.error('Error retrieving user:');
      if (error instanceof Error) {
        console.error(`- Message: ${error.message}`);
        console.error(`- Stack: ${error.stack}`);
      } else {
        console.error(error);
      }
      return null;
    }
  } catch (error) {
    console.error('Failed to initialize Keycloak Admin SDK:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    }
    return null;
  }
}

/**
 * Main function to demonstrate getting a user
 */
async function main() {
  // For demonstration purposes, you can either:
  // 1. Pass a specific user ID as an argument
  // 2. List users and get the first one

  try {
    const sdk = new KeycloakClient(config);

    // Option 1: Use a specific user ID if provided as an argument
    const providedUserId = process.argv[2];

    if (providedUserId) {
      console.log(`Using provided user ID: ${providedUserId}`);
      await getUserDetails(providedUserId);
      return;
    }

    // Option 2: List users and get the first one
    console.log('No user ID provided. Listing users to get the first one...');

    try {
      const users = await sdk.users.list({ max: 1 });

      if (users && users.length > 0) {
        const firstUser = users[0];
        console.log(`Found user with ID: ${firstUser.id}`);
        await getUserDetails(firstUser.id!);
      } else {
        console.warn('No users found in the realm');
      }
    } catch (error) {
      console.error('Error listing users:');
      if (error instanceof Error) {
        console.error(`- Message: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Unhandled error:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    }
  }
}

// Execute the example
(async () => {
  try {
    await main();
    console.log('\nGet User example completed!');
  } catch (error) {
    console.error('\nUnhandled error in Get User example:', error);
  }
})();
