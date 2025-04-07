/**
 * Organizations API for Keycloak Admin SDK
 *
 * This module provides methods to manage organizations in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */

import KeycloakClient from '../../index';
import {
  OrganizationMemberRepresentation,
  OrganizationQuery,
  OrganizationRepresentation
} from '../../types/organizations';
import { IdentityProviderRepresentation } from '../../types/identity-providers';

/**
 * Organizations API
 *
 * Provides methods to manage organizations in Keycloak
 */
export class OrganizationsApi {
  private sdk: KeycloakClient;

  /**
   * Constructor for OrganizationsApi
   *
   * @param sdk - KeycloakClient instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get all organizations with optional filtering
   *
   * Endpoint: GET /{realm}/organizations
   *
   * @param query - Query parameters for filtering organizations
   * @returns Promise resolving to an array of organization representations
   */
  async list(query?: OrganizationQuery): Promise<OrganizationRepresentation[]> {
    try {
      let endpoint = '/organizations';
      const queryParams: string[] = [];

      if (query) {
        if (query.search) {
          queryParams.push(`search=${encodeURIComponent(query.search)}`);
        }

        if (query.first !== undefined) {
          queryParams.push(`first=${query.first}`);
        }

        if (query.max !== undefined) {
          queryParams.push(`max=${query.max}`);
        }

        if (query.exact !== undefined) {
          queryParams.push(`exact=${query.exact}`);
        }
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      return this.sdk.request<OrganizationRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error('Error listing organizations:', error);
      throw new Error(
        `Failed to list organizations: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new organization
   *
   * Endpoint: POST /{realm}/organizations
   *
   * @param organization - Organization representation to create
   * @returns Promise resolving to the ID of the created organization
   */
  async create(organization: OrganizationRepresentation): Promise<string> {
    if (!organization) {
      throw new Error('Organization data is required');
    }

    if (!organization.name) {
      throw new Error('Organization name is required');
    }

    try {
      // Make the POST request to create the organization
      // Keycloak returns a 201 Created with a Location header containing the organization ID
      // Our enhanced request utility will extract the ID from the Location header
      const result = await this.sdk.request<{ id: string }>('/organizations', 'POST', organization);

      if (result && result.id) {
        return result.id;
      }

      // Fallback to finding the organization by name if the ID wasn't extracted from the Location header

      const organizations = await this.list({ search: organization.name, exact: true });

      const createdOrg = organizations.find(org => org.name === organization.name);
      if (createdOrg && createdOrg.id) {
        return createdOrg.id;
      }

      throw new Error('Organization was created but could not be found');
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new Error(
        `Failed to create organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get an organization by ID
   *
   * Endpoint: GET /{realm}/organizations/{id}
   *
   * @param id - Organization ID
   * @returns Promise resolving to the organization representation
   */
  async get(id: string): Promise<OrganizationRepresentation> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    try {
      return this.sdk.request<OrganizationRepresentation>(`/organizations/${id}`, 'GET');
    } catch (error) {
      console.error(`Error getting organization with ID ${id}:`, error);
      throw new Error(
        `Failed to get organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update an organization
   *
   * Endpoint: PUT /{realm}/organizations/{id}
   *
   * @param id - Organization ID
   * @param organization - Updated organization representation
   * @returns Promise resolving when the update is complete
   */
  async update(id: string, organization: OrganizationRepresentation): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!organization) {
      throw new Error('Organization data is required');
    }

    try {
      await this.sdk.request<void>(`/organizations/${id}`, 'PUT', organization);
    } catch (error) {
      console.error(`Error updating organization with ID ${id}:`, error);
      throw new Error(
        `Failed to update organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete an organization
   *
   * Endpoint: DELETE /{realm}/organizations/{id}
   *
   * @param id - Organization ID
   * @returns Promise resolving when the deletion is complete
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    try {
      await this.sdk.request<void>(`/organizations/${id}`, 'DELETE');
    } catch (error) {
      console.error(`Error deleting organization with ID ${id}:`, error);
      throw new Error(
        `Failed to delete organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get organization members
   *
   * Endpoint: GET /{realm}/organizations/{id}/members
   *
   * @param id - Organization ID
   * @param first - First result index (optional)
   * @param max - Maximum number of results (optional)
   * @returns Promise resolving to an array of organization member representations
   */
  async getMembers(
    id: string,
    first?: number,
    max?: number
  ): Promise<OrganizationMemberRepresentation[]> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    try {
      let endpoint = `/organizations/${id}/members`;
      const queryParams: string[] = [];

      if (first !== undefined) {
        queryParams.push(`first=${first}`);
      }

      if (max !== undefined) {
        queryParams.push(`max=${max}`);
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      return this.sdk.request<OrganizationMemberRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error(`Error getting members for organization with ID ${id}:`, error);
      throw new Error(
        `Failed to get organization members: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add a member to an organization
   *
   * Endpoint: POST /{realm}/organizations/{id}/members/{userId}
   *
   * @param id - Organization ID
   * @param userId - User ID to add as member
   * @returns Promise resolving when the member is added
   */
  async addMember(id: string, userId: string): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // Using raw data flag as the last parameter
      await this.sdk.request<void>(`/organizations/${id}/members`, 'POST', userId);
    } catch (error) {
      console.error(`Error adding member ${userId} to organization ${id}:`, error);
      throw new Error(
        `Failed to add organization member: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Remove a member from an organization
   *
   * Endpoint: DELETE /{realm}/organizations/{id}/members/{userId}
   *
   * @param id - Organization ID
   * @param userId - User ID to remove
   * @returns Promise resolving when the member is removed
   */
  async removeMember(id: string, userId: string): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      await this.sdk.request<void>(`/organizations/${id}/members/${userId}`, 'DELETE');
    } catch (error) {
      console.error(`Error removing member ${userId} from organization ${id}:`, error);
      throw new Error(
        `Failed to remove organization member: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Invite an existing user to the organization
   *
   * Endpoint: POST /{realm}/organizations/{id}/members/invite-existing-user
   *
   * @param id - Organization ID
   * @param userId - User ID to invite
   * @returns Promise resolving when the invitation is sent
   */
  async inviteExistingUser(id: string, userId: string): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // The API expects a form parameter 'id'
      const formData = new URLSearchParams();
      formData.append('id', userId);

      await this.sdk.request<void>(
        `/organizations/${id}/members/invite-existing-user`,
        'POST',
        formData.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    } catch (error) {
      console.error(`Error inviting existing user ${userId} to organization ${id}:`, error);
      throw new Error(
        `Failed to invite existing user to organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Invite a user to the organization by email
   *
   * Endpoint: POST /{realm}/organizations/{id}/members/invite-user
   *
   * If the user with the given e-mail address exists, it sends an invitation link,
   * otherwise it sends a registration link.
   *
   * @param id - Organization ID
   * @param email - Email address of the user to invite
   * @param firstName - Optional first name for new users
   * @param lastName - Optional last name for new users
   * @returns Promise resolving when the invitation is sent
   */
  async inviteUser(
    id: string,
    email: string,
    firstName?: string,
    lastName?: string
  ): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    try {
      // The API expects form parameters
      const formData = new URLSearchParams();
      formData.append('email', email);

      if (firstName) {
        formData.append('firstName', firstName);
      }

      if (lastName) {
        formData.append('lastName', lastName);
      }

      await this.sdk.request<void>(
        `/organizations/${id}/members/invite-user`,
        'POST',
        formData.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
    } catch (error) {
      console.error(`Error inviting user with email ${email} to organization ${id}:`, error);
      throw new Error(
        `Failed to invite user to organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get all identity providers associated with an organization
   *
   * Endpoint: GET /{realm}/organizations/{id}/identity-providers
   *
   * @param id - Organization ID
   * @returns Promise resolving to an array of identity provider representations
   */
  async getIdentityProviders(id: string): Promise<IdentityProviderRepresentation[]> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    try {
      return this.sdk.request<IdentityProviderRepresentation[]>(
        `/organizations/${id}/identity-providers`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting identity providers for organization ${id}:`, error);
      throw new Error(
        `Failed to get organization identity providers: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a specific identity provider associated with an organization
   *
   * Endpoint: GET /{realm}/organizations/{id}/identity-providers/{alias}
   *
   * @param id - Organization ID
   * @param alias - Identity provider alias
   * @returns Promise resolving to the identity provider representation
   */
  async getIdentityProvider(id: string, alias: string): Promise<IdentityProviderRepresentation> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      return this.sdk.request<IdentityProviderRepresentation>(
        `/organizations/${id}/identity-providers/${alias}`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting identity provider ${alias} for organization ${id}:`, error);
      throw new Error(
        `Failed to get organization identity provider: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add an identity provider to an organization
   *
   * Endpoint: POST /{realm}/organizations/{id}/identity-providers
   *
   * @param id - Organization ID
   * @param providerAlias - Identity provider alias
   * @returns Promise resolving when the identity provider is added
   */
  async addIdentityProvider(id: string, providerAlias: string): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!providerAlias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      await this.sdk.request<void>(
        `/organizations/${id}/identity-providers`,
        'POST',
        providerAlias
      );
    } catch (error) {
      console.error(
        `Error adding identity provider ${providerAlias} to organization ${id}:`,
        error
      );
      throw new Error(
        `Failed to add identity provider to organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Remove an identity provider from an organization
   *
   * Endpoint: DELETE /{realm}/organizations/{id}/identity-providers/{alias}
   *
   * @param id - Organization ID
   * @param alias - Identity provider alias
   * @returns Promise resolving when the identity provider is removed
   */
  async removeIdentityProvider(id: string, alias: string): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      await this.sdk.request<void>(`/organizations/${id}/identity-providers/${alias}`, 'DELETE');
    } catch (error) {
      console.error(`Error removing identity provider ${alias} from organization ${id}:`, error);
      throw new Error(
        `Failed to remove identity provider from organization: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get the count of members in an organization
   *
   * Endpoint: GET /{realm}/organizations/{id}/members/count
   *
   * @param id - Organization ID
   * @returns Promise resolving to the number of members in the organization
   */
  async getMembersCount(id: string): Promise<number> {
    if (!id) {
      throw new Error('Organization ID is required');
    }

    try {
      return this.sdk.request<number>(`/organizations/${id}/members/count`, 'GET');
    } catch (error) {
      console.error(`Error getting members count for organization ${id}:`, error);
      throw new Error(
        `Failed to get organization members count: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
