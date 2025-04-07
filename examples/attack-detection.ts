/**
 * Example demonstrating the Attack Detection API in Keycloak Admin SDK
 *
 * This example shows how to:
 * 1. Get brute force status for a user
 * 2. Clear brute force attempts for a specific user
 * 3. Clear all brute force attempts
 *
 * Following SOLID principles and clean code practices
 */
import KeycloakClient from '../src';

// Load environment variables
const baseUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const realm = process.env.KEYCLOAK_REALM || 'master';
const clientId = process.env.KEYCLOAK_CLIENT_ID || 'admin-cli';
const username = process.env.KEYCLOAK_USERNAME || 'admin';
const password = process.env.KEYCLOAK_PASSWORD || 'admin';

/**
 * Main function to demonstrate the Attack Detection API
 */
async function demonstrateAttackDetection() {
  let userId: string | undefined;

  try {
    console.log('Initializing Keycloak Admin SDK...');
    const sdk = new KeycloakClient({
      baseUrl,
      realm,
      authMethod: 'password',
      credentials: {
        username,
        password,
        clientId
      }
    });

    // Create a test user
    console.log('Creating a test user...');
    const testUsername = `test-user-${Date.now()}`;
    userId = await sdk.users.create({
      username: testUsername,
      enabled: true,
      email: `${testUsername}@example.com`,
      credentials: [
        {
          type: 'password',
          value: 'test123',
          temporary: false
        }
      ]
    });
    console.log(`Created test user with ID: ${userId}`);

    // Get brute force status for the user
    console.log(`Getting brute force status for user ${userId}...`);
    const status = await sdk.attackDetection.getBruteForceStatusForUser(userId);
    console.log('Brute force status:', JSON.stringify(status, null, 2));

    // Clear brute force attempts for the user
    console.log(`Clearing brute force attempts for user ${userId}...`);
    await sdk.attackDetection.clearBruteForceForUser(userId);
    console.log('Brute force attempts cleared for user');

    // Get updated status
    console.log(`Getting updated brute force status for user ${userId}...`);
    const updatedStatus = await sdk.attackDetection.getBruteForceStatusForUser(userId);
    console.log('Updated brute force status:', JSON.stringify(updatedStatus, null, 2));

    // Clear all brute force attempts
    console.log('Clearing all brute force attempts...');
    await sdk.attackDetection.clearAllBruteForce();
    console.log('All brute force attempts cleared');

    console.log('Attack Detection API demonstration completed successfully');
  } catch (error) {
    console.error(
      'Error demonstrating Attack Detection API:',
      error instanceof Error ? error.message : String(error)
    );
  } finally {
    // Clean up: Delete the test user
    if (userId) {
      try {
        const sdk = new KeycloakClient({
          baseUrl,
          realm,
          authMethod: 'password',
          credentials: {
            username,
            password,
            clientId
          }
        });

        console.log(`Cleaning up: Deleting test user ${userId}...`);
        await sdk.users.delete(userId);
        console.log('Test user deleted successfully');
      } catch (cleanupError) {
        console.error(
          'Error during cleanup:',
          cleanupError instanceof Error ? cleanupError.message : String(cleanupError)
        );
      }
    }
  }
}

// Run the demonstration
demonstrateAttackDetection().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
