/**
 * Example: Manage Organizations
 * 
 * This example demonstrates how to manage organizations in Keycloak:
 * - Creating organizations
 * - Listing organizations
 * - Getting organization details
 * - Adding members to organizations
 * - Managing member roles
 * 
 * Following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src/index';
import { KeycloakConfig } from '../../src/types/auth';
import { OrganizationRepresentation } from '../../src/types/organizations';
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
  try {
    // Step 1: Create a test organization

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
    const orgId = await sdk.organizations.create(organization);


    // Step 2: Get organization details

    const createdOrg = await sdk.organizations.get(orgId);
    console.log(`Organization details:`, JSON.stringify(createdOrg, null, 2));

    // Step 3: Create a test user to add as a member

    const username = `test-user-${Date.now()}`;
    const userId = await sdk.users.create({
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });



    // Step 4: Add user as a member to the organization

    await sdk.organizations.addMember(orgId, userId);


    // Step 5: List organization members

    const members = await sdk.organizations.getMembers(orgId);

    members.forEach(member => {
      console.log(`- ${member.username} (${member.id}): Roles: ${member.roles?.join(', ')}`);
    });

    // Step 6: List all organizations

    const allOrgs = await sdk.organizations.list();

    allOrgs.forEach(org => {
      console.log(`- ${org.name} (${org.id})`);
    });

    // Step 7: Clean up test resources


    // Remove user from organization
    await sdk.organizations.removeMember(orgId, userId);


    // Delete test user
    await sdk.users.delete(userId);


    // Delete test organization
    await sdk.organizations.delete(orgId);



  } catch (error) {
    console.error('Error managing organizations:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// Run the example
manageOrganizations().catch(error => {
  console.error('Error running example:', error);
});
