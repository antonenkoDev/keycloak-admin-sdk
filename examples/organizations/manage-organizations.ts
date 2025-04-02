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
    console.log(`\n=== Step 1: Creating test organization ===`);
    const orgName = `test-org-${Date.now()}`;
    
    const organization: OrganizationRepresentation = {
      name: orgName,
      displayName: `Test Organization ${Date.now()}`,
      url: 'https://example.com',
      domains: ['example.com'],
      attributes: {
        description: ['A test organization for demonstration purposes']
      }
    };
    
    // Create the organization and get the ID directly from the Location header
    const orgId = await sdk.organizations.create(organization);
    console.log(`Created organization: ${orgName} with ID: ${orgId}`);
    
    // Step 2: Get organization details
    console.log(`\n=== Step 2: Getting organization details ===`);
    const createdOrg = await sdk.organizations.get(orgId);
    console.log(`Organization details:`, JSON.stringify(createdOrg, null, 2));
    
    // Step 3: Create a test user to add as a member
    console.log(`\n=== Step 3: Creating test user ===`);
    const username = `test-user-${Date.now()}`;
    const userId = await sdk.users.create({
      username,
      enabled: true,
      email: `${username}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log(`Created test user: ${username} with ID: ${userId}`);
    
    // Step 4: Add user as a member to the organization
    console.log(`\n=== Step 4: Adding user as organization member ===`);
    await sdk.organizations.addMember(orgId, userId, ['member']);
    console.log(`Added user ${username} to organization ${orgName} with role 'member'`);
    
    // Step 5: List organization members
    console.log(`\n=== Step 5: Listing organization members ===`);
    const members = await sdk.organizations.getMembers(orgId);
    console.log(`Organization has ${members.length} members:`);
    members.forEach(member => {
      console.log(`- ${member.username} (${member.id}): Roles: ${member.roles?.join(', ')}`);
    });
    
    // Step 6: Update member roles
    console.log(`\n=== Step 6: Updating member roles ===`);
    await sdk.organizations.updateMemberRoles(orgId, userId, ['member', 'admin']);
    console.log(`Updated roles for user ${username} in organization ${orgName}`);
    
    // Verify the roles were updated
    const updatedMembers = await sdk.organizations.getMembers(orgId);
    const updatedMember = updatedMembers.find(m => m.id === userId);
    console.log(`Updated roles for ${updatedMember?.username}: ${updatedMember?.roles?.join(', ')}`);
    
    // Step 7: List all organizations
    console.log(`\n=== Step 7: Listing all organizations ===`);
    const allOrgs = await sdk.organizations.list();
    console.log(`Found ${allOrgs.length} organizations:`);
    allOrgs.forEach(org => {
      console.log(`- ${org.name} (${org.id}): ${org.displayName}`);
    });
    
    // Step 8: Clean up test resources
    console.log(`\n=== Step 8: Cleaning up test resources ===`);
    
    // Remove user from organization
    await sdk.organizations.removeMember(orgId, userId);
    console.log(`Removed user ${username} from organization ${orgName}`);
    
    // Delete test user
    await sdk.users.delete(userId);
    console.log(`Deleted test user: ${username}`);
    
    // Delete test organization
    await sdk.organizations.delete(orgId);
    console.log(`Deleted test organization: ${orgName}`);
    
    console.log(`\n=== Example completed successfully ===`);
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
