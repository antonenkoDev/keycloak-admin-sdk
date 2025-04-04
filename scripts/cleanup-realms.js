/**
 * Keycloak Test Environment Cleanup Script
 *
 * This script deletes all realms except the master realm from a Keycloak instance.
 * It's useful for cleaning up after tests or resetting a Keycloak instance.
 *
 * Following SOLID principles and clean code practices.
 */

// Import required modules
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

// Configuration for connecting to Keycloak
const config = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  adminUsername: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
  adminPassword: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
  clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli'
};

/**
 * Get an access token from Keycloak
 *
 * @returns {Promise<string>} Access token
 */
async function getToken() {
  try {
    const tokenUrl = `${config.baseUrl}/realms/master/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', config.clientId);
    params.append('username', config.adminUsername);
    params.append('password', config.adminPassword);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get token: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

/**
 * Get all realms from Keycloak
 *
 * @param {string} token Access token
 * @returns {Promise<Array>} List of realms
 */
async function getRealms(token) {
  try {
    const realmsUrl = `${config.baseUrl}/admin/realms`;
    const response = await fetch(realmsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get realms: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting realms:', error);
    throw error;
  }
}

/**
 * Delete a realm from Keycloak
 *
 * @param {string} token Access token
 * @param {string} realmName Name of the realm to delete
 * @returns {Promise<boolean>} Whether the deletion was successful
 */
async function deleteRealm(token, realmName) {
  try {
    const deleteUrl = `${config.baseUrl}/admin/realms/${realmName}`;
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete realm ${realmName}: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return true;
  } catch (error) {
    console.error(`Error deleting realm ${realmName}:`, error);
    return false;
  }
}

/**
 * Main function to clean up the test environment
 */
async function cleanupTestEnvironment() {
  try {
    // Get access token
    const token = await getToken();

    // Get all realms
    const realms = await getRealms(token);

    // Filter out the master realm and any other realms you want to keep
    const realmsToDelete = realms.filter(realm => realm.realm !== 'master');

    if (realmsToDelete.length === 0) {
      return;
    }

    realmsToDelete.forEach(realm => console.log(`- ${realm.realm}`));

    // Delete each realm
    const deletionResults = await Promise.all(
      realmsToDelete.map(async realm => {
        const success = await deleteRealm(token, realm.realm);
        return { realm: realm.realm, success };
      })
    );

    // Summarize results
    const successful = deletionResults.filter(result => result.success).length;
    const failed = deletionResults.filter(result => !result.success).length;

    if (failed > 0) {
      deletionResults
        .filter(result => !result.success)
        .forEach(result => console.log(`- ${result.realm}`));
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup function
cleanupTestEnvironment()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Test environment cleanup failed:', error);
    process.exit(1);
  });
