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
    
    const roleName = `test-role-${Date.now()}`;
    const roleData: RoleRepresentation = {
      name: roleName,
      description: 'Test role created by Roles by ID API example',
    };
    
    const roleId = await sdk.roles.create(roleData);
    

    try {
      // Get the role by ID
      
      const role = await sdk.roles.byId.get(roleId);
      console.log('Role details:', JSON.stringify(role, null, 2));

      // Update the role by ID
      
      const updatedRole: RoleRepresentation = {
        ...role,
        description: 'Updated description via Roles by ID API',
      };
      await sdk.roles.byId.update(roleId, updatedRole);
      

      // Get the updated role to verify changes
      const verifiedRole = await sdk.roles.byId.get(roleId);
      console.log('Updated role details:', JSON.stringify(verifiedRole, null, 2));

      // Create a composite role
      
      const compositeRoleName = `composite-role-${Date.now()}`;
      const compositeRoleData: RoleRepresentation = {
        name: compositeRoleName,
        description: 'Composite role for testing',
        composite: true,
      };
      
      const compositeRoleId = await sdk.roles.create(compositeRoleData);
      

      // Add the first role as a composite to the composite role
      
      await sdk.roles.byId.addComposites(compositeRoleId, [role]);
      

      // Get composites for the role
      
      const composites = await sdk.roles.byId.getComposites(compositeRoleId);
      console.log('Role composites:', JSON.stringify(composites, null, 2));

      // Get realm role composites
      
      const realmComposites = await sdk.roles.byId.getRealmRoleComposites(compositeRoleId);
      console.log('Realm role composites:', JSON.stringify(realmComposites, null, 2));

      // Get role permissions
      
      const permissions = await sdk.roles.byId.getPermissions(roleId);
      console.log('Role permissions:', JSON.stringify(permissions, null, 2));

      // Remove composites from the role
      
      await sdk.roles.byId.removeComposites(compositeRoleId, [role]);
      

      // Clean up - delete the composite role
      
      await sdk.roles.byId.delete(compositeRoleId);
      
    } finally {
      // Clean up - delete the test role
      
      await sdk.roles.delete(roleName);
      
    }

    
  } catch (error) {
    console.error('Error in Roles by ID API example:', error);
    process.exit(1);
  }
}

// Run the example
main();
