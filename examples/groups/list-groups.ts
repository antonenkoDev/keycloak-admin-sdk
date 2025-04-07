/**
 * List Groups Example
 *
 * This example demonstrates how to use the Keycloak Admin SDK
 * to retrieve and display groups in a realm with enhanced error handling.
 *
 * Features:
 * - Robust error handling with detailed error messages
 * - Environment variable configuration
 * - SOLID principles and clean code practices
 * - Structured output for better readability
 */

import { KeycloakConfig } from '../../src/types/auth';
import KeycloakClient from '../../src';
import { GroupRepresentation } from '../../src/types/groups';
import { UserRepresentation } from '../../src/types/users';
import dotenv from 'dotenv'; // Load environment variables from .env file

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
 * List all groups in the realm
 * @param sdk - Initialized KeycloakClient instance
 * @returns Promise resolving to an array of groups
 */
async function listAllGroups(sdk: KeycloakClient): Promise<GroupRepresentation[]> {
  console.log('Retrieving all groups in the realm...');

  try {
    const groups = await sdk.groups.list();
    const count = await sdk.groups.count();

    console.log(
      `Found ${groups.length} groups (total count including subgroups: ${count.count || 0})`
    );
    return groups;
  } catch (error) {
    console.error('Error retrieving groups:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Get detailed information about a specific group
 * @param sdk - Initialized KeycloakClient instance
 * @param groupId - ID of the group to get details for
 * @returns Promise resolving to the group details
 */
async function getGroupDetails(sdk: KeycloakClient, groupId: string): Promise<GroupRepresentation> {
  console.log(`Retrieving details for group with ID: ${groupId}`);

  try {
    const groupDetails = await sdk.groups.get(groupId);

    if (!groupDetails) {
      throw new Error(`No group found with ID: ${groupId}`);
    }

    return groupDetails;
  } catch (error) {
    console.error(`Error retrieving details for group ${groupId}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Get members of a specific group
 * @param sdk - Initialized KeycloakClient instance
 * @param groupId - ID of the group to get members for
 * @returns Promise resolving to an array of group members
 */
async function getGroupMembers(
  sdk: KeycloakClient,
  groupId: string
): Promise<UserRepresentation[]> {
  console.log(`Retrieving members for group with ID: ${groupId}`);

  try {
    const members = await sdk.groups.getMembers(groupId);
    console.log(`Found ${members.length} members in the group`);
    return members;
  } catch (error) {
    console.error(`Error retrieving members for group ${groupId}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Get subgroups of a specific group
 * @param sdk - Initialized KeycloakClient instance
 * @param groupId - ID of the parent group
 * @returns Promise resolving to an array of subgroups
 */
async function getSubgroups(sdk: KeycloakClient, groupId: string): Promise<GroupRepresentation[]> {
  console.log(`Retrieving subgroups for group with ID: ${groupId}`);

  try {
    const subgroups = await sdk.groups.getChildren(groupId);
    console.log(`Found ${subgroups.length} subgroups`);
    return subgroups;
  } catch (error) {
    console.error(`Error retrieving subgroups for group ${groupId}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

/**
 * Display group information in a structured format
 * @param group - Group representation to display
 */
function displayGroupInfo(group: GroupRepresentation): void {
  console.log('\nGroup Information:');
  console.log(`- ID: ${group.id}`);
  console.log(`- Name: ${group.name}`);
  console.log(`- Path: ${group.path}`);

  // Display group attributes if available
  if (group.attributes && Object.keys(group.attributes).length > 0) {
    console.log('\nAttributes:');
    Object.entries(group.attributes).forEach(([key, value]) => {
      console.log(`- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
    });
  }

  // Display subgroups count if available
  if (group.subGroups) {
    console.log(`\nSubgroups Count: ${group.subGroups.length}`);
  }
}

/**
 * Display user information in a structured format
 * @param user - User representation to display
 */
function displayUserInfo(user: UserRepresentation): void {
  console.log(`\nUser: ${user.username || 'Unknown'}`);
  console.log(`- ID: ${user.id}`);
  console.log(`- Email: ${user.email || 'Not set'}`);
  console.log(`- First Name: ${user.firstName || 'Not set'}`);
  console.log(`- Last Name: ${user.lastName || 'Not set'}`);
  console.log(`- Enabled: ${user.enabled}`);
}

/**
 * Main function to demonstrate group listing and management
 */
async function demonstrateGroupListing(): Promise<void> {
  console.log('Starting List Groups example...');

  try {
    // Initialize the Keycloak Admin SDK
    const sdk = new KeycloakClient(config);
    console.log(`Connected to Keycloak at ${config.baseUrl}`);

    // List all groups in the realm
    const groups = await listAllGroups(sdk);

    // If there are groups, get details of the first one
    if (groups.length > 0) {
      const firstGroup = groups[0];

      if (firstGroup.id) {
        console.log(`\nSelected group for detailed inspection: ${firstGroup.name}`);

        // Get and display detailed information about the group
        const groupDetails = await getGroupDetails(sdk, firstGroup.id);
        displayGroupInfo(groupDetails);

        // Get and display members of the group
        const members = await getGroupMembers(sdk, firstGroup.id);

        if (members.length > 0) {
          console.log('\nGroup Members:');
          members.forEach((member, index) => {
            console.log(`\nMember ${index + 1}:`);
            displayUserInfo(member);
          });
        } else {
          console.log('\nNo members found in this group.');
        }

        // Get and display subgroups
        const subgroups = await getSubgroups(sdk, firstGroup.id);

        if (subgroups.length > 0) {
          console.log('\nSubgroups:');
          subgroups.forEach((subgroup, index) => {
            console.log(`\nSubgroup ${index + 1}:`);
            console.log(`- ID: ${subgroup.id}`);
            console.log(`- Name: ${subgroup.name}`);
            console.log(`- Path: ${subgroup.path}`);
          });
        } else {
          console.log('\nNo subgroups found.');
        }
      }
    } else {
      console.log('No groups found in the realm.');
    }

    console.log('\nList Groups example completed successfully!');
  } catch (error) {
    console.error('\nError in List Groups example:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

// Execute the example
(async () => {
  try {
    await demonstrateGroupListing();
  } catch (error) {
    console.error('\nUnhandled error in List Groups example:', error);
    process.exit(1);
  }
})();
