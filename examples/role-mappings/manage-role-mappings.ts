/**
 * Example demonstrating the Role Mappings API in the Keycloak Admin SDK
 * 
 * This example shows how to manage role mappings for users and groups.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src';
import { RoleRepresentation } from '../../src/types/roles';
import { UserRepresentation } from '../../src/types/users';
import { GroupRepresentation } from '../../src/types/groups';

// Load environment variables
const baseUrl = process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080';
const realm = process.env.KEYCLOAK_REALM || 'master';
const clientId = process.env.KEYCLOAK_CLIENT_ID || 'admin-cli';
const username = process.env.KEYCLOAK_USERNAME || 'admin';
const password = process.env.KEYCLOAK_PASSWORD || 'admin';

/**
 * Main function to demonstrate Role Mappings API usage
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

    // Create test resources
    
    
    // Create a test user
    const testUser: UserRepresentation = {
      username: `test-user-${Date.now()}`,
      enabled: true,
      email: `test-user-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      credentials: [
        {
          type: 'password',
          value: 'password',
          temporary: false,
        },
      ],
    };
    
    const userId = await sdk.users.create(testUser);
    
    
    // Create a test group
    const testGroup: GroupRepresentation = {
      name: `test-group-${Date.now()}`,
    };
    
    const groupId = await sdk.groups.create(testGroup);
    
    
    // Create test roles
    const testRole1: RoleRepresentation = {
      name: `test-role-1-${Date.now()}`,
      description: 'Test role 1 for role mappings example',
    };
    
    const testRole2: RoleRepresentation = {
      name: `test-role-2-${Date.now()}`,
      description: 'Test role 2 for role mappings example',
    };
    
    const role1Id = await sdk.roles.create(testRole1);
    const role2Id = await sdk.roles.create(testRole2);
    
    
    // Get the created roles
    const role1 = await sdk.roles.getById(role1Id);
    const role2 = await sdk.roles.getById(role2Id);

    try {
      // Demonstrate user role mappings
      
      
      // Get user role mappings API
      const userRoleMappings = sdk.roleMappings.forUser(userId);
      
      // Get all role mappings for the user (should be empty initially)
      
      const allUserMappings = await userRoleMappings.getAll();
      console.log('Initial user role mappings:', JSON.stringify(allUserMappings, null, 2));
      
      // Get available realm roles for the user
      
      const availableUserRealmRoles = await userRoleMappings.getAvailableRealmRoleMappings();
      
      
      // Add realm roles to the user
      
      await userRoleMappings.addRealmRoleMappings([role1, role2]);
      
      
      // Get realm role mappings for the user
      
      const userRealmRoleMappings = await userRoleMappings.getRealmRoleMappings();
      console.log('User realm role mappings:', JSON.stringify(userRealmRoleMappings, null, 2));
      
      // Get effective realm role mappings for the user
      
      const effectiveUserRealmRoleMappings = await userRoleMappings.getEffectiveRealmRoleMappings();
      console.log('Effective user realm role mappings:', JSON.stringify(effectiveUserRealmRoleMappings, null, 2));
      
      // Remove one role from the user
      
      await userRoleMappings.deleteRealmRoleMappings([role2]);
      
      
      // Get updated realm role mappings for the user
      
      const updatedUserRealmRoleMappings = await userRoleMappings.getRealmRoleMappings();
      console.log('Updated user realm role mappings:', JSON.stringify(updatedUserRealmRoleMappings, null, 2));
      
      // Demonstrate group role mappings
      
      
      // Get group role mappings API
      const groupRoleMappings = sdk.roleMappings.forGroup(groupId);
      
      // Get all role mappings for the group (should be empty initially)
      
      const allGroupMappings = await groupRoleMappings.getAll();
      console.log('Initial group role mappings:', JSON.stringify(allGroupMappings, null, 2));
      
      // Get available realm roles for the group
      
      const availableGroupRealmRoles = await groupRoleMappings.getAvailableRealmRoleMappings();
      
      
      // Add realm roles to the group
      
      await groupRoleMappings.addRealmRoleMappings([role1, role2]);
      
      
      // Get realm role mappings for the group
      
      const groupRealmRoleMappings = await groupRoleMappings.getRealmRoleMappings();
      console.log('Group realm role mappings:', JSON.stringify(groupRealmRoleMappings, null, 2));
      
      // Get effective realm role mappings for the group
      
      const effectiveGroupRealmRoleMappings = await groupRoleMappings.getEffectiveRealmRoleMappings();
      console.log('Effective group realm role mappings:', JSON.stringify(effectiveGroupRealmRoleMappings, null, 2));
      
      // Remove one role from the group
      
      await groupRoleMappings.deleteRealmRoleMappings([role2]);
      
      
      // Get updated realm role mappings for the group
      
      const updatedGroupRealmRoleMappings = await groupRoleMappings.getRealmRoleMappings();
      console.log('Updated group realm role mappings:', JSON.stringify(updatedGroupRealmRoleMappings, null, 2));
      
      // Demonstrate client role mappings (if a client is available)
      try {
        
        
        // Get a client to work with (using the first available client)
        const clients = await sdk.clients.findAll();
        if (clients.length > 0) {
          const client = clients[0];
          console.log(`Using client: ${client.clientId} (${client.id})`);
          
          // Get client roles
          const clientRoles = await sdk.clients.listRoles(client.id!);
          if (clientRoles.length > 0) {
            const clientRole = clientRoles[0];
            console.log(`Using client role: ${clientRole.name} (${clientRole.id})`);
            
            // Add client role to the user
            
            await userRoleMappings.addClientRoleMappings(client.id!, [clientRole]);
            
            
            // Get client role mappings for the user
            
            const userClientRoleMappings = await userRoleMappings.getClientRoleMappings(client.id!);
            console.log('User client role mappings:', JSON.stringify(userClientRoleMappings, null, 2));
            
            // Get effective client role mappings for the user
            
            const effectiveUserClientRoleMappings = await userRoleMappings.getEffectiveClientRoleMappings(client.id!);
            console.log('Effective user client role mappings:', JSON.stringify(effectiveUserClientRoleMappings, null, 2));
            
            // Remove client role from the user
            
            await userRoleMappings.deleteClientRoleMappings(client.id!, [clientRole]);
            
          } else {
            
          }
        } else {
          
        }
      } catch (error) {
        console.error('Error demonstrating client role mappings:', error);
      }
    } finally {
      // Clean up test resources
      
      
      // Delete test roles
      
      await sdk.roles.delete(testRole1.name!);
      await sdk.roles.delete(testRole2.name!);
      
      
      // Delete test group
      
      await sdk.groups.delete(groupId);
      
      
      // Delete test user
      
      await sdk.users.delete(userId);
      
    }

    
  } catch (error) {
    console.error('Error in Role Mappings API example:', error);
    process.exit(1);
  }
}

// Run the example
main();
