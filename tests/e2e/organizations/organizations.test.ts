/**
 * End-to-end tests for the Organizations API
 *
 * These tests verify that the Organizations API correctly interacts with
 * a running Keycloak server, following SOLID principles and clean code practices.
 *
 * This file contains all organization-related tests, including:
 * - Core organization functionality
 * - Organization invitations
 * - Organization identity providers
 */

import KeycloakAdminSDK from '../../../src/index';
import {
  OrganizationDomainRepresentation,
  OrganizationRepresentation
} from '../../../src/types/organizations';
import {
  cleanupTestEnvironment,
  generateUniqueName,
  setupTestEnvironment,
  TestContext
} from '../utils/test-setup';
import { UserRepresentation } from '../../../src/types/users';
import { IdentityProviderRepresentation } from '../../../src/types/identity-providers';

// Test timeout - using environment variable with fallback
const TEST_TIMEOUT = 30000;

describe('Organizations API E2E Tests', () => {
  let testContext: TestContext;
  let sdk: KeycloakAdminSDK;
  let organizationId: string;
  let userId: string;
  let identityProviderAlias: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;

      // Log the SDK configuration for debugging

      const organizationRepresentation: OrganizationRepresentation = {
        name: 'TestOrganization',
        domains: [{ name: 'test.com', verified: false }]
      };
      organizationId = await sdk.organizations.create(organizationRepresentation);

      // Create a test user for organization membership tests
      const username = generateUniqueName('test-user');

      const user: UserRepresentation = {
        username,
        email: `${username}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: 'test-password',
            temporary: false
          }
        ]
      };
      userId = await testContext.sdk.users.create(user);

      // Create a test identity provider for organization tests
      identityProviderAlias = generateUniqueName('test-idp');
      const idp: IdentityProviderRepresentation = {
        alias: identityProviderAlias,
        displayName: 'Test Identity Provider',
        providerId: 'oidc',
        enabled: true,
        config: {
          clientId: 'test-client',
          clientSecret: 'test-secret',
          authorizationUrl: 'https://example.com/auth',
          tokenUrl: 'https://example.com/token'
        }
      };

      try {
        // Create the identity provider in the realm
        await sdk.identityProviders.create(idp);
      } catch (error) {
        console.error('Error creating identity provider:', error);
        throw new Error('Error creating identity provider:');
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
        await sdk.users.delete(userId);
      }

      if (identityProviderAlias) {
        try {
          // Ensure identity provider deleted
          await sdk.requestForRealm(
            testContext.realmName,
            `/identity-providers/instances/${identityProviderAlias}`,
            'DELETE'
          );
        } catch (error) {}
      }

      if (organizationId) {
        try {
          await sdk.organizations.delete(organizationId);
        } catch (error) {
          console.error(
            `Failed to delete organization: ${error instanceof Error ? error.message : String(error)}`
          );
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
  test(
    'should create an organization and extract ID from Location header',
    async () => {
      // Skip test if Organizations API is not supported
      try {
        await sdk.organizations.list({ max: 1 });
      } catch (error) {
        throw new Error('Organizations API not supported');
      }

      try {
        // Generate unique organization name
        const orgName = `test-org-${Date.now()}`;

        // Create organization
        const organization: OrganizationRepresentation = {
          name: orgName,
          redirectUrl: 'https://example.com',
          domains: [{ name: 'example.com', verified: false }] as OrganizationDomainRepresentation[],
          attributes: {
            description: ['A test organization for E2E testing']
          }
        };

        // Create the organization and get the ID directly from the Location header
        organizationId = await sdk.organizations.create(organization);

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
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Listing organizations
   *
   * This test verifies that organizations can be listed with proper filtering
   */
  test(
    'should list organizations with filtering',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      try {
        // List all organizations
        const allOrgs = await sdk.organizations.list();

        // Verify our test organization is in the list
        const hasOrg = allOrgs.some(org => org.id === organizationId);
        expect(hasOrg).toBe(true);

        // Get organization by name
        const orgName = (await sdk.organizations.get(organizationId)).name;
        if (orgName) {
          const filteredOrgs = await sdk.organizations.list({
            search: orgName,
            exact: true
          });
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
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Updating an organization
   *
   * This test verifies that organizations can be updated
   */
  test(
    'should update an organization',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      try {
        // Get current organization
        const organization = await sdk.organizations.get(organizationId);

        // Add a new attribute
        if (!organization.attributes) {
          organization.attributes = {};
        }
        organization.attributes.updated = ['true'];

        // Update the organization
        await sdk.organizations.update(organizationId, organization);

        // Verify update was successful
        const updatedOrg = await sdk.organizations.get(organizationId);
        expect(updatedOrg.attributes?.updated).toContain('true');
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Adding a member to an organization
   *
   * This test verifies that members can be added to organizations
   */
  test(
    'should add a member to an organization',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      if (!userId) {
        throw new Error('User ID not available');
      }

      try {
        // Add user as a member with 'member' role
        await sdk.organizations.addMember(organizationId, userId);

        // Verify member was added
        const members = await sdk.organizations.getMembers(organizationId);

        // Check if our user is in the list
        const hasMember = members.some(member => member.id === userId);
        expect(hasMember).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Removing a member from an organization
   *
   * This test verifies that members can be removed from organizations
   */
  test(
    'should remove a member from an organization',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId || !userId) {
        throw new Error('Organization ID or User ID not available');
      }

      try {
        // Remove member
        await sdk.organizations.removeMember(organizationId, userId);

        // Verify member was removed
        const members = await sdk.organizations.getMembers(organizationId);

        // Check that our user is no longer in the list
        const hasMember = members.some(member => member.id === userId);
        expect(hasMember).toBe(false);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Deleting an organization
   *
   * This test verifies that organizations can be deleted
   */

  /**
   * Test: Inviting an existing user to an organization
   *
   * This test verifies that existing users can be invited to an organization
   */
  test(
    'should invite an existing user to an organization',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      if (!userId) {
        throw new Error('User ID not available');
      }

      try {
        // Invite the existing user
        await sdk.organizations.inviteExistingUser(organizationId, userId);
        // This is a success if no error is thrown
        // We can't verify the invitation was sent since it's an async email process
        expect(true).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Getting members count in an organization
   *
   * This test verifies that the members count can be retrieved
   */
  test(
    'should get the count of members in an organization',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      try {
        // Get the members count
        const count = await sdk.organizations.getMembersCount(organizationId);

        // Verify the count is a number
        expect(typeof count).toBe('number');
        expect(count).toBeGreaterThanOrEqual(0);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  /**
   * Test: Inviting a user by email
   *
   * This test verifies that users can be invited by email
   */
  test(
    'should invite a user by email',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      try {
        const email = `invite-test-${Date.now()}@example.com`;

        // Invite a user by email
        await sdk.organizations.inviteUser(organizationId, email, 'Invited', 'User');

        // This is a success if no error is thrown
        // We can't verify the invitation was sent since it's an async email process
        expect(true).toBe(true);
      } catch (error) {
        console.error('Error in test:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );
  test(
    'should delete an organization',
    async () => {
      // Skip test if Organizations API is not supported or if no organization was created
      if (!organizationId) {
        throw new Error('Organization ID not available');
      }

      try {
        // Delete the organization
        await sdk.organizations.delete(organizationId);

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
    },
    TEST_TIMEOUT
  );
});
