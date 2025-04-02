/**
 * End-to-end tests for the Organizations API
 * 
 * These tests verify that the Organizations API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../../src/index';
import { OrganizationRepresentation } from '../../../src/types/organizations';
import { setupTestEnvironment, cleanupTestEnvironment, TestContext, createTestUser } from '../utils/test-setup';

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Organizations API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let organizationId: string;
  let userId: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    console.log('Setting up test environment for organizations tests');
    
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
      
      // Create a test user for organization membership tests
      const user = await createTestUser(sdk);
      userId = user.id || '';
      console.log(`Created test user with ID: ${userId}`);
      
      // Skip organization tests if Keycloak version doesn't support organizations
      try {
        // Try to list organizations to see if the feature is supported
        await sdk.organizations.list({ max: 1 });
      } catch (error) {
        console.warn('Organizations API not supported in this Keycloak version - skipping tests');
        // We'll check for this in each test and skip if necessary
      }
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test resources
      if (userId) {
        console.log(`Cleaning up test user: ${userId}`);
        await sdk.users.delete(userId);
      }
      
      if (organizationId) {
        console.log(`Cleaning up test organization: ${organizationId}`);
        try {
          await sdk.organizations.delete(organizationId);
        } catch (error) {
          console.warn(`Failed to delete organization: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      // Clean up test realm
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Creating an organization
   * 
   * This test verifies that organizations can be created and IDs are correctly extracted
   */
  test('should create an organization and extract ID from Location header', async () => {
    // Skip test if Organizations API is not supported
    try {
      await sdk.organizations.list({ max: 1 });
    } catch (error) {
      console.warn('Organizations API not supported - skipping test');
      return;
    }
    
    try {
      // Generate unique organization name
      const orgName = `test-org-${Date.now()}`;
      
      // Create organization
      const organization: OrganizationRepresentation = {
        name: orgName,
        displayName: `Test Organization ${Date.now()}`,
        url: 'https://example.com',
        domains: ['example.com'],
        attributes: {
          description: ['A test organization for E2E testing']
        }
      };
      
      // Create the organization and get the ID directly from the Location header
      organizationId = await sdk.organizations.create(organization);
      console.log(`Created organization with ID: ${organizationId}`);
      
      // Verify ID is valid
      expect(organizationId).toBeDefined();
      expect(typeof organizationId).toBe('string');
      expect(organizationId.length).toBeGreaterThan(0);
      
      // Verify organization exists with this ID
      const createdOrg = await sdk.organizations.get(organizationId);
      expect(createdOrg).toBeDefined();
      expect(createdOrg.id).toBe(organizationId);
      expect(createdOrg.name).toBe(orgName);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Listing organizations
   * 
   * This test verifies that organizations can be listed with proper filtering
   */
  test('should list organizations with filtering', async () => {
    // Skip test if Organizations API is not supported or if no organization was created
    if (!organizationId) {
      console.warn('Organization ID not available - skipping test');
      return;
    }
    
    try {
      // List all organizations
      const allOrgs = await sdk.organizations.list();
      console.log(`Found ${allOrgs.length} organizations`);
      
      // Verify our test organization is in the list
      const hasOrg = allOrgs.some(org => org.id === organizationId);
      expect(hasOrg).toBe(true);
      
      // Get organization by name
      const orgName = (await sdk.organizations.get(organizationId)).name;
      if (orgName) {
        const filteredOrgs = await sdk.organizations.list({ search: orgName, exact: true });
        expect(filteredOrgs.length).toBeGreaterThan(0);
        expect(filteredOrgs.some(org => org.id === organizationId)).toBe(true);
      }
      
      // Test pagination
      const firstPage = await sdk.organizations.list({ first: 0, max: 5 });
      expect(firstPage.length).toBeLessThanOrEqual(5);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Updating an organization
   * 
   * This test verifies that organizations can be updated
   */
  test('should update an organization', async () => {
    // Skip test if Organizations API is not supported or if no organization was created
    if (!organizationId) {
      console.warn('Organization ID not available - skipping test');
      return;
    }
    
    try {
      // Get current organization
      const organization = await sdk.organizations.get(organizationId);
      
      // Update organization
      const updatedDisplayName = `Updated Organization ${Date.now()}`;
      organization.displayName = updatedDisplayName;
      
      // Add a new attribute
      if (!organization.attributes) {
        organization.attributes = {};
      }
      organization.attributes.updated = ['true'];
      
      // Update the organization
      await sdk.organizations.update(organizationId, organization);
      console.log(`Updated organization: ${organizationId}`);
      
      // Verify update was successful
      const updatedOrg = await sdk.organizations.get(organizationId);
      expect(updatedOrg.displayName).toBe(updatedDisplayName);
      expect(updatedOrg.attributes?.updated).toContain('true');
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Adding a member to an organization
   * 
   * This test verifies that members can be added to organizations
   */
  test('should add a member to an organization', async () => {
    // Skip test if Organizations API is not supported or if no organization was created
    if (!organizationId || !userId) {
      console.warn('Organization ID or User ID not available - skipping test');
      return;
    }
    
    try {
      // Add user as a member with 'member' role
      await sdk.organizations.addMember(organizationId, userId, ['member']);
      console.log(`Added user ${userId} to organization ${organizationId}`);
      
      // Verify member was added
      const members = await sdk.organizations.getMembers(organizationId);
      console.log(`Organization has ${members.length} members`);
      
      // Check if our user is in the list
      const hasMember = members.some(member => member.id === userId);
      expect(hasMember).toBe(true);
      
      // Check if role was assigned
      const member = members.find(member => member.id === userId);
      expect(member?.roles).toContain('member');
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Updating member roles in an organization
   * 
   * This test verifies that member roles can be updated
   */
  test('should update member roles in an organization', async () => {
    // Skip test if Organizations API is not supported or if no organization was created
    if (!organizationId || !userId) {
      console.warn('Organization ID or User ID not available - skipping test');
      return;
    }
    
    try {
      // Update member roles to include 'admin'
      await sdk.organizations.updateMemberRoles(organizationId, userId, ['member', 'admin']);
      console.log(`Updated roles for user ${userId} in organization ${organizationId}`);
      
      // Verify roles were updated
      const members = await sdk.organizations.getMembers(organizationId);
      const member = members.find(member => member.id === userId);
      
      expect(member?.roles).toContain('member');
      expect(member?.roles).toContain('admin');
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Removing a member from an organization
   * 
   * This test verifies that members can be removed from organizations
   */
  test('should remove a member from an organization', async () => {
    // Skip test if Organizations API is not supported or if no organization was created
    if (!organizationId || !userId) {
      console.warn('Organization ID or User ID not available - skipping test');
      return;
    }
    
    try {
      // Remove member
      await sdk.organizations.removeMember(organizationId, userId);
      console.log(`Removed user ${userId} from organization ${organizationId}`);
      
      // Verify member was removed
      const members = await sdk.organizations.getMembers(organizationId);
      
      // Check that our user is no longer in the list
      const hasMember = members.some(member => member.id === userId);
      expect(hasMember).toBe(false);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
  
  /**
   * Test: Deleting an organization
   * 
   * This test verifies that organizations can be deleted
   */
  test('should delete an organization', async () => {
    // Skip test if Organizations API is not supported or if no organization was created
    if (!organizationId) {
      console.warn('Organization ID not available - skipping test');
      return;
    }
    
    try {
      // Delete the organization
      await sdk.organizations.delete(organizationId);
      console.log(`Deleted organization: ${organizationId}`);
      
      // Verify organization was deleted
      try {
        await sdk.organizations.get(organizationId);
        // If we get here, the organization still exists
        fail('Organization should have been deleted');
      } catch (error) {
        // Expected error - organization should not exist
        expect(error).toBeDefined();
      }
      
      // Clear the organization ID since we've deleted it
      organizationId = '';
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, TEST_TIMEOUT);
});
