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
    
    
    // Step 2: Get role details
    
    const createdRole = await sdk.roles.getByName(roleName);
    console.log(`Role details:`, JSON.stringify(createdRole, null, 2));
    
    // Step 3: Create a composite role
    
    const compositeRoleName = `composite-role-${Date.now()}`;
    
    const compositeRole: RoleRepresentation = {
      name: compositeRoleName,
      description: 'A composite role for demonstration purposes',
      composite: true
    };
    
    const compositeRoleId = await sdk.roles.create(compositeRole);
    
    
    // Step 4: Add the first role as a composite to the composite role
    
    await sdk.roles.addComposites(compositeRoleName, [createdRole]);
    
    
    // Step 5: Get composites of the composite role
    
    const composites = await sdk.roles.getComposites(compositeRoleName);
    
    composites.forEach(composite => {
      console.log(`- ${composite.name} (${composite.id})`);
    });
    
    // Step 6: Create a test user
    
    const username = `test-user-${Date.now()}`;
    const userId = await sdk.users.create({
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });
    
    
    
    // Step 7: Add the composite role to the user
    
    await sdk.users.addRealmRoles(userId, [{ id: compositeRoleId, name: compositeRoleName }]);
    
    
    // Step 8: Get users with the role
    
    const usersWithRole = await sdk.roles.getUsersWithRole(compositeRoleName);
    
    usersWithRole.forEach(user => {
      console.log(`- ${user.username} (${user.id})`);
    });
    
    // Step 9: Update a role
    
    createdRole.description = 'Updated description';
    createdRole.attributes = {
      ...createdRole.attributes,
      'updated-attribute': ['updated-value']
    };
    
    await sdk.roles.update(roleName, createdRole);
    
    
    // Verify the update
    const updatedRole = await sdk.roles.getByName(roleName);
    console.log(`Updated role details:`, JSON.stringify(updatedRole, null, 2));
    
    // Step 10: List all roles
    
    const allRoles = await sdk.roles.list();
    
    
    // Display only the first 5 roles to avoid cluttering the output
    allRoles.slice(0, 5).forEach(role => {
      console.log(`- ${role.name} (${role.id}): ${role.description || 'No description'}`);
    });
    
    if (allRoles.length > 5) {
      
    }
    
    // Step 11: Clean up test resources
    
    
    // Remove role from user
    await sdk.users.removeRealmRoles(userId, [{ id: compositeRoleId, name: compositeRoleName }]);
    
    
    // Delete test user
    await sdk.users.delete(userId);
    
    
    // Delete roles
    await sdk.roles.delete(compositeRoleName);
    
    
    await sdk.roles.delete(roleName);
    
    
    
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
