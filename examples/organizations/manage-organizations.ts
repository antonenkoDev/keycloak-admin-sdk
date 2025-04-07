/**
 * Example: Manage Organizations
 * 
 * This example demonstrates how to manage organizations in Keycloak:
 * - Creating organizations
 * - Listing organizations
 * - Getting organization details
 * - Adding members to organizations
 * - Managing member roles
 * - Handling errors properly
 * - Using ID extraction from Location headers
 * 
 * Following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src/index';
import { KeycloakConfig } from '../../src/types/auth';
import { OrganizationRepresentation } from '../../src/types/organizations';
import { UserRepresentation } from '../../src/types/users';
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
 * Manage organizations
 * 
 * Following SOLID principles:
 * - Single Responsibility: Each function has a clear purpose
 * - Open/Closed: Functionality is extended without modifying existing code
 * - Liskov Substitution: Consistent behavior across similar operations
 * - Interface Segregation: Only necessary properties are included in objects
 * - Dependency Inversion: High-level modules don't depend on low-level details
 */
async function manageOrganizations() {
  // Define variables outside try block to ensure they're available in finally block for cleanup
  let orgId: string | undefined;
  let userId: string | undefined;

  try {
    console.log('Starting Organizations API example...');
    
    // Step 1: Create a test organization
    console.log('\nStep 1: Creating test organization');

    const orgName = `test-org-${Date.now()}`;

    const organization: OrganizationRepresentation = {
      name: orgName,
      redirectUrl: 'https://example.com',
      domains: [{ name: 'example.com', verified: false }],
      attributes: {
        description: ['A test organization for demonstration purposes']
      }
    };

    // Create the organization and get the ID directly from the Location header
    try {
      orgId = await sdk.organizations.create(organization);
      console.log(`Organization created with ID: ${orgId} (extracted from Location header)`);
    } catch (error) {
      // Check if this is because Organizations API is not supported in this Keycloak version
      console.error('Failed to create organization. This may be because the Organizations API is not supported in your Keycloak version.');
      throw error;
    }

    // Step 2: Get organization details
    console.log('\nStep 2: Getting organization details');

    const createdOrg = await sdk.organizations.get(orgId);
    console.log(`Organization details:`, JSON.stringify(createdOrg, null, 2));

    // Step 3: Create a test user to add as a member
    console.log('\nStep 3: Creating test user');

    const username = `test-user-${Date.now()}`;
    const newUser: UserRepresentation = {
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    };

    // Create user and get ID directly from Location header
    userId = await sdk.users.create(newUser);
    console.log(`User created with ID: ${userId} (extracted from Location header)`);

    // Step 4: Add user as a member to the organization
    console.log('\nStep 4: Adding user as organization member');

    await sdk.organizations.addMember(orgId, userId);
    console.log(`Added user ${username} to organization ${orgName}`);

    // Step 5: List organization members
    console.log('\nStep 5: Listing organization members');

    const members = await sdk.organizations.getMembers(orgId);
    console.log(`Organization ${orgName} has ${members.length} members:`);
    members.forEach(member => {
      console.log(`- ${member.username} (${member.id}): Roles: ${member.roles?.join(', ') || 'none'}`);
    });

    // Step 6: Check member details
    console.log('\nStep 6: Checking member details');

    try {
      // Get member details again to verify membership
      const updatedMembers = await sdk.organizations.getMembers(orgId);
      const member = updatedMembers.find(m => m.id === userId);
      
      if (member) {
        console.log(`Member details for ${member.username}:`);
        console.log(`- ID: ${member.id}`);
        console.log(`- Email: ${member.email}`);
        console.log(`- Roles: ${member.roles?.join(', ') || 'none'}`);
      } else {
        console.log(`User ${username} is not a member of the organization.`);
      }
    } catch (error) {
      console.warn('Could not get member details:', error);
    }

    // Step 7: List all organizations
    console.log('\nStep 7: Listing all organizations');

    const allOrgs = await sdk.organizations.list();
    console.log(`Found ${allOrgs.length} organizations:`);
    allOrgs.forEach(org => {
      console.log(`- ${org.name} (${org.id})`);
    });

    // Step 8: Search for organizations
    console.log('\nStep 8: Searching for organizations');

    try {
      const searchQuery = { search: orgName.substring(0, 8) };
      const searchResults = await sdk.organizations.list(searchQuery);
      console.log(`Search found ${searchResults.length} organizations matching '${searchQuery.search}'`);
      searchResults.forEach(org => {
        console.log(`- ${org.name} (${org.id})`);
      });
    } catch (error) {
      console.warn('Organization search may not be supported in your Keycloak version');
    }

    console.log('\nOrganizations API example completed successfully!');

  } catch (error) {
    console.error('Error managing organizations:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  } finally {
    // Step 9: Clean up test resources
    console.log('\nStep 9: Cleaning up test resources');

    try {
      // Only attempt cleanup if we created resources
      if (orgId && userId) {
        // Remove user from organization
        try {
          await sdk.organizations.removeMember(orgId, userId);
          console.log(`Removed user from organization ${orgId}`);
        } catch (error) {
          console.warn(`Failed to remove user from organization: ${error instanceof Error ? error.message : error}`);
        }

        // Delete test user
        try {
          await sdk.users.delete(userId);
          console.log(`Deleted test user ${userId}`);
        } catch (error) {
          console.warn(`Failed to delete test user: ${error instanceof Error ? error.message : error}`);
        }

        // Delete test organization
        try {
          await sdk.organizations.delete(orgId);
          console.log(`Deleted test organization ${orgId}`);
        } catch (error) {
          console.warn(`Failed to delete test organization: ${error instanceof Error ? error.message : error}`);
        }
      }
      
      console.log('Cleanup completed');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Run the example
manageOrganizations().catch(error => {
  console.error('Error running example:', error);
});
