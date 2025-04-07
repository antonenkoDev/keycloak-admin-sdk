/**
 * Example demonstrating the Role Mappings API in the Keycloak Admin SDK
 *
 * This example shows how to manage role mappings for users and groups.
 * It features:
 * - Enhanced error handling with detailed logging
 * - ID extraction from Location headers in HTTP 201 responses
 * - SOLID principles and clean code practices
 * - Proper resource cleanup in all scenarios
 */

import KeycloakClient from '../../src';
import { KeycloakConfig } from '../../src/types/auth';
import { RoleRepresentation } from '../../src/types/roles';
import { UserRepresentation } from '../../src/types/users';
import { GroupRepresentation } from '../../src/types/groups';
import { ClientRepresentation } from '../../src/types/clients';
import dotenv from 'dotenv'; // Load environment variables from .env file

// Load environment variables from .env file
dotenv.config();

// Create a configuration object with proper typing
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
 * Main function to demonstrate Role Mappings API usage
 */
async function main() {
  // Define variables outside try block to ensure they're available in finally block for cleanup
  let userId: string | undefined;
  let groupId: string | undefined;
  let role1Id: string | undefined;
  let role2Id: string | undefined;
  let testRole1: RoleRepresentation | undefined;
  let testRole2: RoleRepresentation | undefined;
  let role1: RoleRepresentation | undefined;
  let role2: RoleRepresentation | undefined;

  try {
    console.log('Starting Role Mappings API example...');

    // Initialize the Keycloak Admin SDK
    const sdk = new KeycloakClient(config);

    // Step 1: Create test resources
    console.log('\nStep 1: Creating test resources');

    // Create a test user
    console.log('\nCreating a test user');

    try {
      const testUsername = `test-user-${Date.now()}`;
      const testUser: UserRepresentation = {
        username: testUsername,
        enabled: true,
        email: `${testUsername}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        credentials: [
          {
            type: 'password',
            value: 'password',
            temporary: false
          }
        ]
      };

      // Create user and get ID directly from Location header
      userId = await sdk.users.create(testUser);
      console.log(`User created with ID: ${userId} (extracted from Location header)`);
    } catch (error) {
      console.error('Error creating test user:', error);
      throw new Error('Failed to create test user for the example');
    }

    // Create a test group
    console.log('\nCreating a test group');

    try {
      const testGroupName = `test-group-${Date.now()}`;
      const testGroup: GroupRepresentation = {
        name: testGroupName
      };

      // Create group and get ID directly from Location header
      groupId = await sdk.groups.create(testGroup);
      console.log(`Group created with ID: ${groupId} (extracted from Location header)`);
    } catch (error) {
      console.error('Error creating test group:', error);
      throw new Error('Failed to create test group for the example');
    }

    // Create test roles
    console.log('\nCreating test roles');

    try {
      testRole1 = {
        name: `test-role-1-${Date.now()}`,
        description: 'Test role 1 for role mappings example'
      };

      testRole2 = {
        name: `test-role-2-${Date.now()}`,
        description: 'Test role 2 for role mappings example'
      };

      // Create roles and get IDs directly from Location headers
      role1Id = await sdk.roles.create(testRole1);
      console.log(`Role 1 created with ID: ${role1Id} (extracted from Location header)`);

      role2Id = await sdk.roles.create(testRole2);
      console.log(`Role 2 created with ID: ${role2Id} (extracted from Location header)`);

      // Get the created roles by name instead of ID
      role1 = await sdk.roles.getByName(testRole1.name!);
      role2 = await sdk.roles.getByName(testRole2.name!);

      if (!role1 || !role2) {
        throw new Error('Failed to retrieve created roles');
      }
    } catch (error) {
      console.error('Error creating test roles:', error);
      throw new Error('Failed to create test roles for the example');
    }

    // Step 2: Demonstrate user role mappings
    console.log('\nStep 2: Demonstrating user role mappings');

    try {
      // Get user role mappings API
      const userRoleMappings = sdk.roleMappings.forUser(userId!);

      // Get all role mappings for the user (should be empty initially)
      console.log('\nGetting all role mappings for the user');

      try {
        const allUserMappings = await userRoleMappings.getAll();
        console.log('Initial user role mappings:', JSON.stringify(allUserMappings, null, 2));
      } catch (error) {
        console.error('Error getting initial user role mappings:', error);
      }

      // Get available realm roles for the user
      console.log('\nGetting available realm roles for the user');

      try {
        const availableUserRealmRoles = await userRoleMappings.getAvailableRealmRoleMappings();
        console.log(
          'Available realm roles for user:',
          JSON.stringify(availableUserRealmRoles, null, 2)
        );
      } catch (error) {
        console.error('Error getting available realm roles for user:', error);
      }

      // Add realm roles to the user
      console.log('\nAdding realm roles to the user');

      try {
        await userRoleMappings.addRealmRoleMappings([role1!, role2!]);
        console.log(`Added roles ${role1!.name} and ${role2!.name} to the user`);
      } catch (error) {
        console.error('Error adding realm roles to user:', error);
      }

      // Get realm role mappings for the user
      console.log('\nGetting realm role mappings for the user');

      try {
        const userRealmRoleMappings = await userRoleMappings.getRealmRoleMappings();
        console.log('User realm role mappings:', JSON.stringify(userRealmRoleMappings, null, 2));
      } catch (error) {
        console.error('Error getting user realm role mappings:', error);
      }

      // Get effective realm role mappings for the user
      console.log('\nGetting effective realm role mappings for the user');

      try {
        const effectiveUserRealmRoleMappings =
          await userRoleMappings.getEffectiveRealmRoleMappings();
        console.log(
          'Effective user realm role mappings:',
          JSON.stringify(effectiveUserRealmRoleMappings, null, 2)
        );
      } catch (error) {
        console.error('Error getting effective user realm role mappings:', error);
      }

      // Remove one role from the user
      console.log('\nRemoving one role from the user');

      try {
        await userRoleMappings.deleteRealmRoleMappings([role2!]);
        console.log(`Removed role ${role2!.name} from the user`);
      } catch (error) {
        console.error('Error removing realm role from user:', error);
      }

      // Get updated realm role mappings for the user
      console.log('\nGetting updated realm role mappings for the user');

      try {
        const updatedUserRealmRoleMappings = await userRoleMappings.getRealmRoleMappings();
        console.log(
          'Updated user realm role mappings:',
          JSON.stringify(updatedUserRealmRoleMappings, null, 2)
        );
      } catch (error) {
        console.error('Error getting updated user realm role mappings:', error);
      }

      // Step 3: Demonstrate group role mappings
      console.log('\nStep 3: Demonstrating group role mappings');

      // Get group role mappings API
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId!);

      // Get all role mappings for the group (should be empty initially)
      console.log('\nGetting all role mappings for the group');

      try {
        const allGroupMappings = await groupRoleMappings.getAll();
        console.log('Initial group role mappings:', JSON.stringify(allGroupMappings, null, 2));
      } catch (error) {
        console.error('Error getting initial group role mappings:', error);
      }

      // Get available realm roles for the group
      console.log('\nGetting available realm roles for the group');

      try {
        const availableGroupRealmRoles = await groupRoleMappings.getAvailableRealmRoleMappings();
        console.log(
          'Available realm roles for group:',
          JSON.stringify(availableGroupRealmRoles, null, 2)
        );
      } catch (error) {
        console.error('Error getting available realm roles for group:', error);
      }

      // Add realm roles to the group
      console.log('\nAdding realm roles to the group');

      try {
        await groupRoleMappings.addRealmRoleMappings([role1!, role2!]);
        console.log(`Added roles ${role1!.name} and ${role2!.name} to the group`);
      } catch (error) {
        console.error('Error adding realm roles to group:', error);
      }

      // Get realm role mappings for the group
      console.log('\nGetting realm role mappings for the group');

      try {
        const groupRealmRoleMappings = await groupRoleMappings.getRealmRoleMappings();
        console.log('Group realm role mappings:', JSON.stringify(groupRealmRoleMappings, null, 2));
      } catch (error) {
        console.error('Error getting group realm role mappings:', error);
      }

      // Get effective realm role mappings for the group
      console.log('\nGetting effective realm role mappings for the group');

      try {
        const effectiveGroupRealmRoleMappings =
          await groupRoleMappings.getEffectiveRealmRoleMappings();
        console.log(
          'Effective group realm role mappings:',
          JSON.stringify(effectiveGroupRealmRoleMappings, null, 2)
        );
      } catch (error) {
        console.error('Error getting effective group realm role mappings:', error);
      }

      // Remove one role from the group
      console.log('\nRemoving one role from the group');

      try {
        await groupRoleMappings.deleteRealmRoleMappings([role2!]);
        console.log(`Removed role ${role2!.name} from the group`);
      } catch (error) {
        console.error('Error removing realm role from group:', error);
      }

      // Get updated realm role mappings for the group
      console.log('\nGetting updated realm role mappings for the group');

      try {
        const updatedGroupRealmRoleMappings = await groupRoleMappings.getRealmRoleMappings();
        console.log(
          'Updated group realm role mappings:',
          JSON.stringify(updatedGroupRealmRoleMappings, null, 2)
        );
      } catch (error) {
        console.error('Error getting updated group realm role mappings:', error);
      }

      // Step 4: Demonstrate client role mappings (if a client is available)
      console.log('\nStep 4: Demonstrating client role mappings');

      try {
        // Get a client to work with (using the first available client)
        console.log('\nFinding a client to work with');

        let client: ClientRepresentation | undefined;
        let clientRole: RoleRepresentation | undefined;

        try {
          const clients = await sdk.clients.findAll();
          if (clients.length === 0) {
            console.log('No clients found in the realm');
            return;
          }

          client = clients[0];
          console.log(`Using client: ${client.clientId} (${client.id})`);

          // Get client roles
          console.log('\nGetting client roles');

          const clientRoles = await sdk.clients.listRoles(client.id!);
          if (clientRoles.length === 0) {
            console.log(`No roles found for client ${client.clientId}`);
            return;
          }

          clientRole = clientRoles[0];
          console.log(`Using client role: ${clientRole.name} (${clientRole.id})`);

          // Add client role to the user
          console.log('\nAdding client role to the user');

          try {
            await userRoleMappings.addClientRoleMappings(client.id!, [clientRole]);
            console.log(`Added client role ${clientRole.name} to the user`);
          } catch (error) {
            console.error('Error adding client role to user:', error);
          }

          // Get client role mappings for the user
          console.log('\nGetting client role mappings for the user');

          try {
            const userClientRoleMappings = await userRoleMappings.getClientRoleMappings(client.id!);
            console.log(
              'User client role mappings:',
              JSON.stringify(userClientRoleMappings, null, 2)
            );
          } catch (error) {
            console.error('Error getting user client role mappings:', error);
          }

          // Get effective client role mappings for the user
          console.log('\nGetting effective client role mappings for the user');

          try {
            const effectiveUserClientRoleMappings =
              await userRoleMappings.getEffectiveClientRoleMappings(client.id!);
            console.log(
              'Effective user client role mappings:',
              JSON.stringify(effectiveUserClientRoleMappings, null, 2)
            );
          } catch (error) {
            console.error('Error getting effective user client role mappings:', error);
          }

          // Remove client role from the user
          console.log('\nRemoving client role from the user');

          try {
            await userRoleMappings.deleteClientRoleMappings(client.id!, [clientRole]);
            console.log(`Removed client role ${clientRole.name} from the user`);
          } catch (error) {
            console.error('Error removing client role from user:', error);
          }
        } catch (error) {
          console.error('Error working with clients:', error);
        }
      } catch (error) {
        console.error('Error demonstrating client role mappings:', error);
      }
      console.log('\nRole Mappings API example completed successfully!');
    } catch (error) {
      console.error('Error in role mappings demonstration:', error);
    }
  } catch (error) {
    console.error('Error in Role Mappings API example:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    // Step 5: Clean up test resources
    console.log('\nStep 5: Cleaning up test resources');

    try {
      // Only attempt cleanup if we created resources
      const sdk = new KeycloakClient(config);

      if (testRole1 && testRole1.name) {
        // Delete test role 1
        try {
          await sdk.roles.delete(testRole1.name);
          console.log(`Deleted test role ${testRole1.name}`);
        } catch (error) {
          console.warn(
            `Failed to delete test role 1: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      if (testRole2 && testRole2.name) {
        // Delete test role 2
        try {
          await sdk.roles.delete(testRole2.name);
          console.log(`Deleted test role ${testRole2.name}`);
        } catch (error) {
          console.warn(
            `Failed to delete test role 2: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      if (groupId) {
        // Delete test group
        try {
          await sdk.groups.delete(groupId);
          console.log(`Deleted test group with ID ${groupId}`);
        } catch (error) {
          console.warn(
            `Failed to delete test group: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      if (userId) {
        // Delete test user
        try {
          await sdk.users.delete(userId);
          console.log(`Deleted test user with ID ${userId}`);
        } catch (error) {
          console.warn(
            `Failed to delete test user: ${error instanceof Error ? error.message : error}`
          );
        }
      }

      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Run the example
main();
