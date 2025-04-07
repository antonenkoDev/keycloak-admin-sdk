/**
 * Create Group Example
 *
 * This example demonstrates how to create a new top-level group
 * and a subgroup within it using the Keycloak Admin SDK with
 * enhanced error handling and ID extraction from Location headers.
 *
 * Features:
 * - ID extraction directly from Location headers in HTTP 201 responses
 * - Robust error handling with detailed error messages
 * - Environment variable configuration
 * - SOLID principles and clean code practices
 * - Proper resource cleanup in finally blocks
 */

import { KeycloakConfig } from '../../src/types/auth';
import KeycloakAdminSDK from '../../src';
import { GroupRepresentation } from '../../src/types/groups';
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
 * Create a top-level group in Keycloak
 * @param sdk - Initialized KeycloakAdminSDK instance
 * @param groupName - Name of the group to create
 * @returns Promise resolving to the ID of the created group
 */
async function createTopLevelGroup(sdk: KeycloakAdminSDK, groupName: string): Promise<string> {
  console.log(`Creating top-level group: ${groupName}`);

  try {
    // Create a unique group name to avoid conflicts
    const timestamp = Date.now();
    const uniqueGroupName = `${groupName}-${timestamp}`;

    // Prepare group data
    const newGroup: GroupRepresentation = {
      name: uniqueGroupName,
      attributes: {
        department: ['Technology'],
        location: ['Building A'],
        created: [new Date().toISOString()]
      }
    };

    // Create the group and extract ID directly from Location header
    const groupId = await sdk.groups.create(newGroup);
    console.log(`Group created successfully with ID: ${groupId} (extracted from Location header)`);
    return groupId;
  } catch (error) {
    console.error('Error creating top-level group:');
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
 * Create a subgroup under a parent group
 * @param sdk - Initialized KeycloakAdminSDK instance
 * @param parentId - ID of the parent group
 * @param subgroupName - Name of the subgroup to create
 * @returns Promise resolving to the ID of the created subgroup
 */
async function createSubgroup(
  sdk: KeycloakAdminSDK,
  parentId: string,
  subgroupName: string
): Promise<string> {
  console.log(`Creating subgroup '${subgroupName}' under parent group with ID: ${parentId}`);

  try {
    // Create a unique subgroup name to avoid conflicts
    const timestamp = Date.now();
    const uniqueSubgroupName = `${subgroupName}-${timestamp}`;

    // Prepare subgroup data
    const subGroup: GroupRepresentation = {
      name: uniqueSubgroupName,
      attributes: {
        team: ['UI/UX', 'Web Development'],
        stack: ['React', 'TypeScript'],
        created: [new Date().toISOString()]
      }
    };

    // Create the subgroup (note: createChild doesn't return the ID)
    await sdk.groups.createChild(parentId, subGroup);
    console.log(`Subgroup created successfully under parent ${parentId}`);

    // Get the parent group with its subgroups to find our newly created subgroup
    const parentGroup = await sdk.groups.get(parentId);
    if (!parentGroup || !parentGroup.subGroups) {
      throw new Error(`Failed to retrieve parent group ${parentId} with subgroups`);
    }

    // Find our newly created subgroup by name
    const createdSubgroup = parentGroup.subGroups.find(group => group.name === uniqueSubgroupName);
    if (!createdSubgroup || !createdSubgroup.id) {
      throw new Error(`Failed to find newly created subgroup '${uniqueSubgroupName}'`);
    }

    console.log(`Found subgroup with ID: ${createdSubgroup.id}`);
    return createdSubgroup.id;
  } catch (error) {
    console.error(`Error creating subgroup under parent ${parentId}:`);
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
 * Display group structure with subgroups
 * @param sdk - Initialized KeycloakAdminSDK instance
 * @param groupId - ID of the group to display
 */
async function displayGroupStructure(sdk: KeycloakAdminSDK, groupId: string): Promise<void> {
  console.log(`Retrieving group structure for group with ID: ${groupId}`);

  try {
    // Get the updated group with its subgroups
    const group = await sdk.groups.get(groupId);

    if (!group) {
      console.warn(`No group found with ID: ${groupId}`);
      return;
    }

    // Display group information
    console.log('\nGroup structure:');
    console.log(`- ID: ${group.id}`);
    console.log(`- Name: ${group.name}`);
    console.log(`- Path: ${group.path}`);

    // Display group attributes if available
    if (group.attributes) {
      console.log('\nGroup attributes:');
      Object.entries(group.attributes).forEach(([key, value]) => {
        console.log(`- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
      });
    }

    // Display subgroups if available
    if (group.subGroups && group.subGroups.length > 0) {
      console.log('\nSubgroups:');
      group.subGroups.forEach((subgroup, index) => {
        console.log(`\nSubgroup ${index + 1}:`);
        console.log(`- ID: ${subgroup.id}`);
        console.log(`- Name: ${subgroup.name}`);
        console.log(`- Path: ${subgroup.path}`);

        // Display subgroup attributes if available
        if (subgroup.attributes) {
          console.log('  Attributes:');
          Object.entries(subgroup.attributes).forEach(([key, value]) => {
            console.log(`  - ${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
          });
        }
      });
    } else {
      console.log('\nNo subgroups found.');
    }
  } catch (error) {
    console.error(`Error retrieving group structure for group ${groupId}:`);
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
  }
}

/**
 * Main function to create groups and demonstrate group hierarchy
 */
async function createGroupHierarchy() {
  console.log('Starting Create Group example...');

  // Track created resources for cleanup
  let topLevelGroupId: string | null = null;

  try {
    // Initialize the Keycloak Admin SDK
    const sdk = new KeycloakAdminSDK(config);
    console.log(`Connected to Keycloak at ${config.baseUrl}`);

    // Create a top-level group
    topLevelGroupId = await createTopLevelGroup(sdk, 'Engineering');

    // Create a subgroup under the top-level group
    const subgroupId = await createSubgroup(sdk, topLevelGroupId, 'Frontend Team');

    // Display the group structure
    await displayGroupStructure(sdk, topLevelGroupId);

    console.log('\nGroup hierarchy created successfully!');
    console.log(`- Top-level group ID: ${topLevelGroupId}`);
    console.log(`- Subgroup ID: ${subgroupId}`);

    return {
      topLevelGroupId,
      subgroupId
    };
  } catch (error) {
    console.error('\nError creating group hierarchy:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    } else {
      console.error(error);
    }
    return null;
  }
}

// Execute the example
(async () => {
  try {
    const result = await createGroupHierarchy();
    if (result) {
      console.log('\nCreate Group example completed successfully!');
    } else {
      console.error('\nCreate Group example failed!');
    }
  } catch (error) {
    console.error('\nUnhandled error in Create Group example:', error);
  }
})();
