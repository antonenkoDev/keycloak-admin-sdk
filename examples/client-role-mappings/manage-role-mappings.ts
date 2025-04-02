/**
 * Example: Manage client role mappings
 * 
 * This example demonstrates how to manage client role mappings for users and groups:
 * - Getting client roles
 * - Assigning client roles to users
 * - Assigning client roles to groups
 * - Removing client roles from users and groups
 */

import KeycloakAdminSDK from '../../src/index';
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

const sdk = new KeycloakAdminSDK(config);

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
    console.log(`\n=== Step 1: Finding client ===`);
    const clientName = process.env.TEST_CLIENT_ID || 'account';
    const clients = await sdk.clients.findAll(clientName);
    
    if (clients.length === 0) {
      throw new Error(`Client '${clientName}' not found`);
    }
    
    const client = clients[0];
    console.log(`Found client: ${client.clientId} (ID: ${client.id})`);
    
    // Step 2: Get client roles
    console.log(`\n=== Step 2: Getting client roles ===`);
    const roles = await sdk.clients.listRoles(client.id!);
    
    if (roles.length === 0) {
      console.log(`No roles found for client ${client.clientId}`);
      
      // Create a test role if none exist
      console.log(`Creating a test role for client ${client.clientId}`);
      const newRole: RoleRepresentation = {
        name: `test-role-${Date.now()}`,
        description: 'Test role for demonstration',
        clientRole: true
      };
      
      const roleId = await sdk.clients.createRole(client.id!, newRole);
      console.log(`Created role with ID: ${roleId}`);
      
      // Reload roles
      const updatedRoles = await sdk.clients.listRoles(client.id!);
      console.log(`Client now has ${updatedRoles.length} roles`);
      
      // Use the first role for our example
      const role = updatedRoles[0];
      await demonstrateRoleMappings(client.id!, role);
    } else {
      console.log(`Found ${roles.length} roles for client ${client.clientId}`);
      
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
    console.log(`\n=== Step 3: Creating test user ===`);
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
    console.log(`\n=== Step 4: Creating test group ===`);
    const groupName = `test-group-${Date.now()}`;
    const groupId = await sdk.groups.create({
      name: groupName
    });
    
    console.log(`Created test group: ${groupName} (ID: ${groupId})`);
    
    // Step 5: Assign role to user
    console.log(`\n=== Step 5: Assigning role to user ===`);
    await sdk.clientRoleMappings.addUserClientRoleMappings(userId, clientId, [role]);
    console.log(`Assigned role ${role.name} to user ${username}`);
    
    // Step 6: Verify user role mappings
    console.log(`\n=== Step 6: Verifying user role mappings ===`);
    const userRoles = await sdk.clientRoleMappings.getUserClientRoleMappings(userId, clientId);
    console.log(`User has ${userRoles.length} roles from client`);
    
    // Check if our role is in the list
    const hasRole = userRoles.some(r => r.id === role.id);
    console.log(`User has role ${role.name}: ${hasRole}`);
    
    // Step 7: Get available roles for user
    console.log(`\n=== Step 7: Getting available roles for user ===`);
    const availableUserRoles = await sdk.clientRoleMappings.getAvailableUserClientRoleMappings(userId, clientId);
    console.log(`User has ${availableUserRoles.length} available roles from client`);
    
    // Step 8: Get effective roles for user
    console.log(`\n=== Step 8: Getting effective roles for user ===`);
    const effectiveUserRoles = await sdk.clientRoleMappings.getEffectiveUserClientRoleMappings(userId, clientId);
    console.log(`User has ${effectiveUserRoles.length} effective roles from client`);
    
    // Step 9: Assign role to group
    console.log(`\n=== Step 9: Assigning role to group ===`);
    await sdk.clientRoleMappings.addGroupClientRoleMappings(groupId, clientId, [role]);
    console.log(`Assigned role ${role.name} to group ${groupName}`);
    
    // Step 10: Verify group role mappings
    console.log(`\n=== Step 10: Verifying group role mappings ===`);
    const groupRoles = await sdk.clientRoleMappings.getGroupClientRoleMappings(groupId, clientId);
    console.log(`Group has ${groupRoles.length} roles from client`);
    
    // Check if our role is in the list
    const groupHasRole = groupRoles.some(r => r.id === role.id);
    console.log(`Group has role ${role.name}: ${groupHasRole}`);
    
    // Step 11: Remove role from user
    console.log(`\n=== Step 11: Removing role from user ===`);
    await sdk.clientRoleMappings.deleteUserClientRoleMappings(userId, clientId, [role]);
    console.log(`Removed role ${role.name} from user ${username}`);
    
    // Verify role was removed
    const updatedUserRoles = await sdk.clientRoleMappings.getUserClientRoleMappings(userId, clientId);
    const userStillHasRole = updatedUserRoles.some(r => r.id === role.id);
    console.log(`User still has role ${role.name}: ${userStillHasRole}`);
    
    // Step 12: Remove role from group
    console.log(`\n=== Step 12: Removing role from group ===`);
    await sdk.clientRoleMappings.deleteGroupClientRoleMappings(groupId, clientId, [role]);
    console.log(`Removed role ${role.name} from group ${groupName}`);
    
    // Verify role was removed
    const updatedGroupRoles = await sdk.clientRoleMappings.getGroupClientRoleMappings(groupId, clientId);
    const groupStillHasRole = updatedGroupRoles.some(r => r.id === role.id);
    console.log(`Group still has role ${role.name}: ${groupStillHasRole}`);
    
    // Step 13: Clean up test resources
    console.log(`\n=== Step 13: Cleaning up test resources ===`);
    await sdk.users.delete(userId);
    console.log(`Deleted test user: ${username}`);
    
    await sdk.groups.delete(groupId);
    console.log(`Deleted test group: ${groupName}`);
    
    console.log(`\n=== Example completed successfully ===`);
  } catch (error) {
    console.error('Error in role mappings demonstration:', error);
  }
}

// Run the example
manageClientRoleMappings().catch(error => {
  console.error('Error running example:', error);
});
