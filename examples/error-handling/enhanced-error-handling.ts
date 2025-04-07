/**
 * Enhanced Error Handling Example
 * 
 * This example demonstrates the improved error handling and debugging capabilities
 * in the Keycloak Admin SDK, including:
 * - Detailed error messages with context information
 * - Proper error propagation
 * - ID extraction from Location headers
 * - Comprehensive logging
 * 
 * Following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src';
import { KeycloakConfig } from '../../src/types/auth';
import { UserRepresentation } from '../../src/types/users';
import { ClientRepresentation } from '../../src/types/clients';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new instance of the Keycloak Admin SDK with proper typing
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

const sdk = new KeycloakAdminSDK(config);

/**
 * Demonstrate enhanced error handling and ID extraction
 */
async function demonstrateEnhancedFeatures() {
  try {
    console.log('Demonstrating enhanced error handling and ID extraction...\n');

    // 1. Demonstrate ID extraction from Location headers
    console.log('1. ID Extraction from Location Headers:');
    
    // Create a user and get the ID directly from the Location header
    const username = `test-user-${Date.now()}`;
    const newUser: UserRepresentation = {
      username,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      enabled: true
    };

    console.log(`Creating user: ${username}`);
    const userId = await sdk.users.create(newUser);
    console.log(`User created with ID: ${userId} (extracted directly from Location header)`);

    // Create a client and get the ID directly from the Location header
    const clientId = `test-client-${Date.now()}`;
    const newClient: ClientRepresentation = {
      clientId,
      name: `Test Client ${Date.now()}`,
      enabled: true,
      protocol: 'openid-connect',
      publicClient: true
    };

    console.log(`\nCreating client: ${clientId}`);
    const createdClientId = await sdk.clients.create(newClient);
    console.log(`Client created with ID: ${createdClientId} (extracted directly from Location header)`);

    // 2. Demonstrate error handling with intentional errors
    console.log('\n2. Enhanced Error Handling:');
    
    try {
      // Try to get a non-existent user
      console.log('Attempting to get a non-existent user...');
      const nonExistentUserId = 'non-existent-user-id';
      await sdk.users.get(nonExistentUserId);
    } catch (error) {
      console.log('Caught error with proper context information:');
      console.error(error);
    }

    try {
      // Try to create a user with invalid data
      console.log('\nAttempting to create a user with invalid data...');
      const invalidUser: UserRepresentation = {
        // Missing required username field
        email: 'invalid@example.com',
        enabled: true
      };
      await sdk.users.create(invalidUser);
    } catch (error) {
      console.log('Caught error with proper context information:');
      console.error(error);
    }

    // 3. Clean up test resources
    console.log('\n3. Cleaning up test resources:');
    
    console.log(`Deleting user: ${userId}`);
    await sdk.users.delete(userId);
    
    console.log(`Deleting client: ${createdClientId}`);
    await sdk.clients.delete(createdClientId);
    
    console.log('\nCleanup completed successfully.');

  } catch (error) {
    console.error('Error in enhanced features demonstration:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// Run the example
demonstrateEnhancedFeatures().catch(error => {
  console.error('Error running example:', error);
});
