/**
 * Example: Manage client role mappings
 *
 * This example demonstrates how to manage client role mappings for users and groups:
 * - Getting client roles
 * - Assigning client roles to users
 * - Assigning client roles to groups
 * - Removing client roles from users and groups
 */

import KeycloakClient from '../../src/index';
import { RoleRepresentation } from '../../src/types/roles';
import { KeycloakConfig } from '../../src/types/auth';
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

const sdk = new KeycloakClient(config);

/**
 * Manage client role mappings for users and groups
 *
 * Following SOLID principles:
 * - Single Responsibility: Each function has a clear purpose
 * - Open/Closed: Functionality is extended without modifying existing code
 * - Liskov Substitution: Consistent behavior across similar operations
 * - Interface Segregation: Only necessary properties are included in objects
 * - Dependency Inversion: High-level modules don't depend on low-level details
 */
async function manageClientRoleMappings() {
  try {
    // Step 1: Find a client to work with

    const clientName = process.env.TEST_CLIENT_ID || 'account';
    const clients = await sdk.clients.findAll(clientName);

    if (clients.length === 0) {
      throw new Error(`Client '${clientName}' not found`);
    }

    const client = clients[0];
    console.log(`Found client: ${client.clientId} (ID: ${client.id})`);

    // Step 2: Get client roles

    const roles = await sdk.clients.listRoles(client.id!);

    if (roles.length === 0) {
      // Create a test role if none exist

      const newRole: RoleRepresentation = {
        name: `test-role-${Date.now()}`,
        description: 'Test role for demonstration',
        clientRole: true
      };

      const roleId = await sdk.clients.createRole(client.id!, newRole);

      // Reload roles
      const updatedRoles = await sdk.clients.listRoles(client.id!);

      // Use the first role for our example
      const role = updatedRoles[0];
      await demonstrateRoleMappings(client.id!, role);
    } else {
      // Use the first role for our example
      const role = roles[0];
      console.log(`Using role: ${role.name} (ID: ${role.id})`);

      await demonstrateRoleMappings(client.id!, role);
    }
  } catch (error) {
    console.error('Error managing client role mappings:', error);
  }
}

/**
 * Demonstrate role mappings operations
 *
 * @param clientId - Client ID
 * @param role - Role to use for demonstration
 */
async function demonstrateRoleMappings(clientId: string, role: RoleRepresentation) {
  try {
    // Step 3: Create a test user

    const username = `test-user-${Date.now()}`;
    const userId = await sdk.users.create({
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });

    console.log(`Created test user: ${username} (ID: ${userId})`);

    // Step 4: Create a test group

    const groupName = `test-group-${Date.now()}`;
    const groupId = await sdk.groups.create({
      name: groupName
    });

    console.log(`Created test group: ${groupName} (ID: ${groupId})`);

    // Step 5: Assign role to user

    await sdk.clients.clientRoleMappings.addUserClientRoleMappings(userId, clientId, [role]);

    // Step 6: Verify user role mappings

    const userRoles = await sdk.clients.clientRoleMappings.getUserClientRoleMappings(
      userId,
      clientId
    );

    // Check if our role is in the list
    const hasRole = userRoles.some(r => r.id === role.id);

    // Step 7: Get available roles for user

    const availableUserRoles =
      await sdk.clients.clientRoleMappings.getAvailableUserClientRoleMappings(userId, clientId);

    // Step 8: Get effective roles for user

    const effectiveUserRoles =
      await sdk.clients.clientRoleMappings.getEffectiveUserClientRoleMappings(userId, clientId);

    // Step 9: Assign role to group

    await sdk.clients.clientRoleMappings.addGroupClientRoleMappings(groupId, clientId, [role]);

    // Step 10: Verify group role mappings

    const groupRoles = await sdk.clients.clientRoleMappings.getGroupClientRoleMappings(
      groupId,
      clientId
    );

    // Check if our role is in the list
    const groupHasRole = groupRoles.some(r => r.id === role.id);

    // Step 11: Remove role from user

    await sdk.clients.clientRoleMappings.deleteUserClientRoleMappings(userId, clientId, [role]);

    // Verify role was removed
    const updatedUserRoles = await sdk.clients.clientRoleMappings.getUserClientRoleMappings(
      userId,
      clientId
    );
    const userStillHasRole = updatedUserRoles.some(r => r.id === role.id);

    // Step 12: Remove role from group

    await sdk.clients.clientRoleMappings.deleteGroupClientRoleMappings(groupId, clientId, [role]);

    // Verify role was removed
    const updatedGroupRoles = await sdk.clients.clientRoleMappings.getGroupClientRoleMappings(
      groupId,
      clientId
    );
    const groupStillHasRole = updatedGroupRoles.some(r => r.id === role.id);

    // Step 13: Clean up test resources

    await sdk.users.delete(userId);

    await sdk.groups.delete(groupId);
  } catch (error) {
    console.error('Error in role mappings demonstration:', error);
  }
}

// Run the example
manageClientRoleMappings().catch(error => {
  console.error('Error running example:', error);
});
