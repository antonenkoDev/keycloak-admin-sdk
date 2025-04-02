/**
 * Example: Manage Roles
 * 
 * This example demonstrates how to manage roles in Keycloak:
 * - Creating realm roles
 * - Listing roles
 * - Getting role details
 * - Managing composite roles
 * - Working with users and groups that have specific roles
 * 
 * Following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src/index';
import { KeycloakConfig } from '../../src/types/auth';
import { RoleRepresentation } from '../../src/types/roles';
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
 * Manage roles
 * 
 * Following SOLID principles:
 * - Single Responsibility: Each function has a clear purpose
 * - Open/Closed: Functionality is extended without modifying existing code
 * - Liskov Substitution: Consistent behavior across similar operations
 * - Interface Segregation: Only necessary properties are included in objects
 * - Dependency Inversion: High-level modules don't depend on low-level details
 */
async function manageRoles() {
  try {
    // Step 1: Create a test role
    console.log(`\n=== Step 1: Creating test role ===`);
    const roleName = `test-role-${Date.now()}`;
    
    const role: RoleRepresentation = {
      name: roleName,
      description: 'A test role for demonstration purposes',
      attributes: {
        'example-attribute': ['test-value']
      }
    };
    
    // Create the role and get the ID
    const roleId = await sdk.roles.create(role);
    console.log(`Created role: ${roleName} with ID: ${roleId}`);
    
    // Step 2: Get role details
    console.log(`\n=== Step 2: Getting role details ===`);
    const createdRole = await sdk.roles.getByName(roleName);
    console.log(`Role details:`, JSON.stringify(createdRole, null, 2));
    
    // Step 3: Create a composite role
    console.log(`\n=== Step 3: Creating a composite role ===`);
    const compositeRoleName = `composite-role-${Date.now()}`;
    
    const compositeRole: RoleRepresentation = {
      name: compositeRoleName,
      description: 'A composite role for demonstration purposes',
      composite: true
    };
    
    const compositeRoleId = await sdk.roles.create(compositeRole);
    console.log(`Created composite role: ${compositeRoleName} with ID: ${compositeRoleId}`);
    
    // Step 4: Add the first role as a composite to the composite role
    console.log(`\n=== Step 4: Adding role to composite role ===`);
    await sdk.roles.addComposites(compositeRoleName, [createdRole]);
    console.log(`Added ${roleName} as a composite to ${compositeRoleName}`);
    
    // Step 5: Get composites of the composite role
    console.log(`\n=== Step 5: Getting composites of the composite role ===`);
    const composites = await sdk.roles.getComposites(compositeRoleName);
    console.log(`Composite role has ${composites.length} composites:`);
    composites.forEach(composite => {
      console.log(`- ${composite.name} (${composite.id})`);
    });
    
    // Step 6: Create a test user
    console.log(`\n=== Step 6: Creating test user ===`);
    const username = `test-user-${Date.now()}`;
    const userId = await sdk.users.create({
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log(`Created test user: ${username} with ID: ${userId}`);
    
    // Step 7: Add the composite role to the user
    console.log(`\n=== Step 7: Adding composite role to user ===`);
    await sdk.users.addRealmRoles(userId, [{ id: compositeRoleId, name: compositeRoleName }]);
    console.log(`Added role ${compositeRoleName} to user ${username}`);
    
    // Step 8: Get users with the role
    console.log(`\n=== Step 8: Getting users with the role ===`);
    const usersWithRole = await sdk.roles.getUsersWithRole(compositeRoleName);
    console.log(`Role ${compositeRoleName} has ${usersWithRole.length} users:`);
    usersWithRole.forEach(user => {
      console.log(`- ${user.username} (${user.id})`);
    });
    
    // Step 9: Update a role
    console.log(`\n=== Step 9: Updating a role ===`);
    createdRole.description = 'Updated description';
    createdRole.attributes = {
      ...createdRole.attributes,
      'updated-attribute': ['updated-value']
    };
    
    await sdk.roles.update(roleName, createdRole);
    console.log(`Updated role: ${roleName}`);
    
    // Verify the update
    const updatedRole = await sdk.roles.getByName(roleName);
    console.log(`Updated role details:`, JSON.stringify(updatedRole, null, 2));
    
    // Step 10: List all roles
    console.log(`\n=== Step 10: Listing all roles ===`);
    const allRoles = await sdk.roles.list();
    console.log(`Found ${allRoles.length} roles:`);
    
    // Display only the first 5 roles to avoid cluttering the output
    allRoles.slice(0, 5).forEach(role => {
      console.log(`- ${role.name} (${role.id}): ${role.description || 'No description'}`);
    });
    
    if (allRoles.length > 5) {
      console.log(`... and ${allRoles.length - 5} more roles`);
    }
    
    // Step 11: Clean up test resources
    console.log(`\n=== Step 11: Cleaning up test resources ===`);
    
    // Remove role from user
    await sdk.users.removeRealmRoles(userId, [{ id: compositeRoleId, name: compositeRoleName }]);
    console.log(`Removed role ${compositeRoleName} from user ${username}`);
    
    // Delete test user
    await sdk.users.delete(userId);
    console.log(`Deleted test user: ${username}`);
    
    // Delete roles
    await sdk.roles.delete(compositeRoleName);
    console.log(`Deleted composite role: ${compositeRoleName}`);
    
    await sdk.roles.delete(roleName);
    console.log(`Deleted role: ${roleName}`);
    
    console.log(`\n=== Example completed successfully ===`);
  } catch (error) {
    console.error('Error managing roles:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// Run the example
manageRoles().catch(error => {
  console.error('Error running example:', error);
});
