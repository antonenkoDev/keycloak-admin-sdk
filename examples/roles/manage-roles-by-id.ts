/**
 * Example demonstrating the Roles by ID API in the Keycloak Admin SDK
 * 
 * This example shows how to manage roles directly by their ID using the Roles by ID API.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src';
import { RoleRepresentation } from '../../src/types/roles';

// Load environment variables
const baseUrl = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080';
const realm = process.env.KEYCLOAK_REALM || 'master';
const clientId = process.env.KEYCLOAK_CLIENT_ID || 'admin-cli';
const username = process.env.KEYCLOAK_USERNAME || 'admin';
const password = process.env.KEYCLOAK_PASSWORD || 'admin';

/**
 * Main function to demonstrate Roles by ID API usage
 */
async function main() {
  try {
    console.log('Initializing Keycloak Admin SDK...');
    const sdk = new KeycloakAdminSDK({
      baseUrl,
      realm,
      authMethod: 'password',
      credentials: {
        clientId,
        username,
        password,
      },
    });

    // Create a test role to work with
    console.log('Creating a test role...');
    const roleName = `test-role-${Date.now()}`;
    const roleData: RoleRepresentation = {
      name: roleName,
      description: 'Test role created by Roles by ID API example',
    };
    
    const roleId = await sdk.roles.create(roleData);
    console.log(`Created role with ID: ${roleId}`);

    try {
      // Get the role by ID
      console.log(`Getting role by ID: ${roleId}`);
      const role = await sdk.roles.byId.get(roleId);
      console.log('Role details:', JSON.stringify(role, null, 2));

      // Update the role by ID
      console.log('Updating role by ID...');
      const updatedRole: RoleRepresentation = {
        ...role,
        description: 'Updated description via Roles by ID API',
      };
      await sdk.roles.byId.update(roleId, updatedRole);
      console.log('Role updated successfully');

      // Get the updated role to verify changes
      const verifiedRole = await sdk.roles.byId.get(roleId);
      console.log('Updated role details:', JSON.stringify(verifiedRole, null, 2));

      // Create a composite role
      console.log('Creating a composite role...');
      const compositeRoleName = `composite-role-${Date.now()}`;
      const compositeRoleData: RoleRepresentation = {
        name: compositeRoleName,
        description: 'Composite role for testing',
        composite: true,
      };
      
      const compositeRoleId = await sdk.roles.create(compositeRoleData);
      console.log(`Created composite role with ID: ${compositeRoleId}`);

      // Add the first role as a composite to the composite role
      console.log('Adding role as a composite...');
      await sdk.roles.byId.addComposites(compositeRoleId, [role]);
      console.log('Composite added successfully');

      // Get composites for the role
      console.log('Getting role composites...');
      const composites = await sdk.roles.byId.getComposites(compositeRoleId);
      console.log('Role composites:', JSON.stringify(composites, null, 2));

      // Get realm role composites
      console.log('Getting realm role composites...');
      const realmComposites = await sdk.roles.byId.getRealmRoleComposites(compositeRoleId);
      console.log('Realm role composites:', JSON.stringify(realmComposites, null, 2));

      // Get role permissions
      console.log('Getting role permissions...');
      const permissions = await sdk.roles.byId.getPermissions(roleId);
      console.log('Role permissions:', JSON.stringify(permissions, null, 2));

      // Remove composites from the role
      console.log('Removing role composites...');
      await sdk.roles.byId.removeComposites(compositeRoleId, [role]);
      console.log('Composites removed successfully');

      // Clean up - delete the composite role
      console.log('Deleting composite role...');
      await sdk.roles.byId.delete(compositeRoleId);
      console.log('Composite role deleted successfully');
    } finally {
      // Clean up - delete the test role
      console.log('Deleting test role...');
      await sdk.roles.delete(roleName);
      console.log('Test role deleted successfully');
    }

    console.log('Roles by ID API example completed successfully');
  } catch (error) {
    console.error('Error in Roles by ID API example:', error);
    process.exit(1);
  }
}

// Run the example
main();
