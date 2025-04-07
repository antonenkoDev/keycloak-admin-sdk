/**
 * Group Hierarchy Management Example
 *
 * This example demonstrates how to create and manage a simple group hierarchy
 * with nested subgroups using the Keycloak Admin SDK.
 *
 * Features:
 * - ID extraction directly from Location headers in HTTP 201 responses
 * - Basic error handling with informative messages
 * - Environment variable configuration
 */

import { KeycloakConfig } from '../../src/types/auth';
import KeycloakClient from '../../src';
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

// Instantiate Keycloak SDK
const sdk = new KeycloakClient(config);

/**
 * Create a simple group hierarchy with a parent group and child groups
 */
async function createGroupHierarchy(): Promise<void> {
  try {
    console.log('Creating group hierarchy...');

    // 1. Create a parent group
    const parentGroup: GroupRepresentation = {
      name: 'Company',
      attributes: {
        type: ['Organization'],
        created: [new Date().toISOString()]
      }
    };

    // Create the parent group and extract ID from Location header
    const parentId = await sdk.groups.create(parentGroup);
    console.log(`Parent group created with ID: ${parentId}`);

    // 2. Create department subgroups
    const departments = [
      {
        name: 'Engineering',
        attributes: { department: ['Technical'], created: [new Date().toISOString()] }
      },
      {
        name: 'Marketing',
        attributes: { department: ['Business'], created: [new Date().toISOString()] }
      }
    ];

    // Create each department as a child of the parent group
    for (const department of departments) {
      try {
        await sdk.groups.createChild(parentId, department);
        console.log(`Created department: ${department.name}`);
      } catch (error) {
        console.error(
          `Error creating department ${department.name}:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    // 3. Get the created structure to verify
    const group = await sdk.groups.get(parentId);
    console.log('\nCreated group hierarchy:');
    console.log(JSON.stringify(group, null, 2));
  } catch (error) {
    console.error('Error creating group hierarchy:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

/**
 * Display a group and its subgroups
 *
 * @param groupId - The ID of the group to display
 */
async function displayGroup(groupId: string): Promise<void> {
  if (!groupId) {
    console.error('Group ID is required');
    return;
  }

  try {
    console.log(`Fetching group with ID: ${groupId}`);
    const group = await sdk.groups.get(groupId);

    console.log('\nGroup details:');
    console.log(`Name: ${group.name}`);
    console.log(`ID: ${group.id}`);

    if (group.attributes) {
      console.log('\nAttributes:');
      for (const [key, values] of Object.entries(group.attributes)) {
        console.log(`- ${key}: ${values.join(', ')}`);
      }
    }

    if (group.subGroups && group.subGroups.length > 0) {
      console.log('\nSubgroups:');
      for (const subGroup of group.subGroups) {
        console.log(`- ${subGroup.name} (ID: ${subGroup.id})`);
      }
    } else {
      console.log('\nNo subgroups found.');
    }
  } catch (error) {
    console.error('Error displaying group:');
    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

/**
 * Display the complete group hierarchy with attributes
 *
 * @param sdk - Initialized KeycloakClient instance
 * @param groupId - The ID of the top-level group to display
 * @returns Promise that resolves when the hierarchy has been displayed
 */
async function displayGroupHierarchy(sdk: KeycloakClient, groupId: string): Promise<void> {
  if (!groupId) {
    console.error('Group ID is required to display hierarchy');
    return;
  }

  console.log(`Displaying group hierarchy for group with ID: ${groupId}`);

  try {
    // Get the group with all subgroups
    const group = await sdk.groups.get(groupId);
    console.log('\nGroup Hierarchy:');
    console.log('===============');

    // Print the group hierarchy recursively
    printGroup(group);

    /**
     * Helper function to print groups recursively in a tree-like format
     *
     * @param group - The group to print
     * @param level - The nesting level (for indentation)
     */
    function printGroup(group: GroupRepresentation, level: number = 0): void {
      if (!group) return;

      // Create indentation based on level
      const indent = '  '.repeat(level);

      // Print group name and ID
      console.log(
        `${indent}${level > 0 ? '└─ ' : ''}${group.name || 'Unnamed Group'} (ID: ${group.id || 'Unknown'})`
      );

      // Print group attributes if they exist
      if (group.attributes && Object.keys(group.attributes).length > 0) {
        console.log(`${indent}   Attributes:`);

        for (const [key, values] of Object.entries(group.attributes)) {
          if (Array.isArray(values) && values.length > 0) {
            console.log(`${indent}     - ${key}: ${values.join(', ')}`);
          }
        }
      }

      // Print subgroups recursively
      if (group.subGroups && group.subGroups.length > 0) {
        console.log(`${indent}   Subgroups:`);
        for (const subGroup of group.subGroups) {
          printGroup(subGroup, level + 1);
        }
      }
    }

    console.log('\nHierarchy display completed.');
  } catch (error) {
    console.error('Error displaying group hierarchy:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

/**
 * Set management permissions for a group
 *
 * @param groupId - The ID of the group
 */
async function setGroupPermissions(groupId: string): Promise<void> {
  if (!groupId) {
    console.error('Group ID is required');
    return;
  }

  try {
    // Get current permissions
    const currentPermissions = await sdk.groups.getManagementPermissions(groupId);
    console.log('Current permissions:', JSON.stringify(currentPermissions, null, 2));

    // Enable permissions
    const updatedPermissions = {
      enabled: true,
      resource: currentPermissions.resource,
      scopePermissions: currentPermissions.scopePermissions
    };

    const result = await sdk.groups.setManagementPermissions(groupId, updatedPermissions);
    console.log('Updated permissions:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error setting group permissions:');
    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

/**
 * Clean up by deleting a group
 *
 * @param groupId - The ID of the group to delete
 */
async function deleteGroup(groupId: string): Promise<void> {
  if (!groupId) {
    console.error('Group ID is required');
    return;
  }

  try {
    console.log(`Deleting group with ID: ${groupId}`);
    await sdk.groups.delete(groupId);
    console.log('Group deleted successfully');
  } catch (error) {
    console.error('Error deleting group:');
    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('Starting Group Management Example');
  console.log('-------------------------------');
  console.log(`Using Keycloak at: ${config.baseUrl}`);
  console.log(`Realm: ${config.realm}`);

  let parentGroupId: string | undefined;

  try {
    // Step 1: Create a group hierarchy
    await createGroupHierarchy();

    // Step 2: List all groups to find our created group
    console.log('\nListing all groups:');
    const groups = await sdk.groups.list();
    const parentGroup = groups.find(g => g.name === 'Company');

    if (parentGroup && parentGroup.id) {
      parentGroupId = parentGroup.id;

      // Step 3: Display the group details
      await displayGroup(parentGroupId);

      // Step 4: Set permissions on the parent group
      await setGroupPermissions(parentGroupId);

      // Step 5: Clean up (commented out by default)
      // Uncomment the following line if you want to clean up after running the example
      // await deleteGroup(parentGroupId);
    } else {
      console.log('Parent group not found');
    }

    console.log('\nExample completed successfully!');
  } catch (error) {
    console.error('Error in main execution:');
    if (error instanceof Error) {
      console.error(`- ${error.message}`);
    } else {
      console.error(error);
    }
  }
}

// Execute the main function
main().catch(error => {
  console.error('Unhandled error in main execution:');
  console.error(error);
  process.exit(1);
});
