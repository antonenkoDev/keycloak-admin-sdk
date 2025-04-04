/**
 * Keycloak Test Environment Cleanup Script
 * 
 * This script deletes all realms except the master realm from a Keycloak instance.
 * It's useful for cleaning up after tests or resetting a Keycloak instance.
 * 
 * Following SOLID principles and clean code practices.
 */

// Use dynamic import for ESM compatibility
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import dotenv for environment variables
import dotenv from 'dotenv';

// Import types
type KeycloakConfig = {
  baseUrl: string;
  realm: string;
  authMethod: 'password';
  credentials: {
    username: string;
    password: string;
    clientId: string;
  };
};

// Load environment variables from .env file if present
dotenv.config();

// Configuration for connecting to Keycloak
const config: KeycloakConfig = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: 'master', // Always use master realm for admin operations
  authMethod: 'password',
  credentials: {
    username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli'
  }
};

/**
 * Interface for realm representation
 */
interface RealmRepresentation {
  id?: string;
  realm?: string;
  displayName?: string;
  enabled?: boolean;
}

/**
 * Main function to clean up the test environment
 */
async function cleanupTestEnvironment(): Promise<void> {
  try {
    console.log('Initializing Keycloak Admin SDK...');
    
    // Dynamically import the built SDK
    const { default: KeycloakAdminSDK } = await import('../lib/index.js');
    const sdk = new KeycloakAdminSDK(config);

    console.log('Fetching all realms...');
    const realms = await sdk.realms.list() as RealmRepresentation[];
    
    // Filter out the master realm and any other realms you want to keep
    const realmsToDelete = realms.filter(realm => realm.realm && realm.realm !== 'master');
    
    if (realmsToDelete.length === 0) {
      console.log('No realms to delete. Only master realm exists.');
      return;
    }
    
    console.log(`Found ${realmsToDelete.length} realms to delete:`);
    realmsToDelete.forEach(realm => console.log(`- ${realm.realm}`));
    
    // Confirm deletion
    console.log('\nProceeding with deletion...');
    
    // Delete each realm
    const deletionPromises = realmsToDelete.map(async realm => {
      try {
        // Ensure realm name is defined
        if (!realm.realm) {
          console.error('Realm name is undefined');
          return { realm: 'unknown', success: false, error: new Error('Realm name is undefined') };
        }
        
        console.log(`Deleting realm: ${realm.realm}`);
        await sdk.realms.delete(realm.realm);
        console.log(`Successfully deleted realm: ${realm.realm}`);
        return { realm: realm.realm, success: true };
      } catch (error) {
        console.error(`Failed to delete realm ${realm.realm || 'unknown'}:`, error);
        return { realm: realm.realm || 'unknown', success: false, error };
      }
    });
    
    // Wait for all deletions to complete
    const results = await Promise.all(deletionPromises);
    
    // Summarize results
    const successful = results.filter(result => result.success).length;
    const failed = results.filter(result => !result.success).length;
    
    console.log('\nCleanup Summary:');
    console.log(`- Total realms processed: ${results.length}`);
    console.log(`- Successfully deleted: ${successful}`);
    console.log(`- Failed to delete: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed deletions:');
      results
        .filter(result => !result.success)
        .forEach(result => console.log(`- ${result.realm}`));
    }
    
    console.log('\nCleanup completed.');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup function
cleanupTestEnvironment()
  .then(() => {
    console.log('Test environment cleanup completed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test environment cleanup failed:', error);
    process.exit(1);
  });
