/**
 * Organizations API for Keycloak Admin SDK
 * 
 * This module provides methods to manage organizations in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */

import KeycloakAdminSDK from '../../index';
import { OrganizationRepresentation, OrganizationQuery, OrganizationMemberRepresentation } from '../../types/organizations';

/**
 * Organizations API
 * 
 * Provides methods to manage organizations in Keycloak
 */
export class OrganizationsApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Constructor for OrganizationsApi
   * 
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
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
      throw new Error(`Failed to list organizations: ${error instanceof Error ? error.message : String(error)}`);
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
      const result = await this.sdk.request<{id: string}>('/organizations', 'POST', organization);
      
      if (result && result.id) {
        console.log(`Created organization with ID: ${result.id}`);
        return result.id;
      }
      
      // Fallback to finding the organization by name if the ID wasn't extracted from the Location header
      console.log('ID not found in response, falling back to finding organization by name');
      const organizations = await this.list({ search: organization.name, exact: true });
      
      const createdOrg = organizations.find(org => org.name === organization.name);
      if (createdOrg && createdOrg.id) {
        console.log(`Found organization with ID: ${createdOrg.id}`);
        return createdOrg.id;
      }
      
      throw new Error('Organization was created but could not be found');
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : String(error)}`);
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
      throw new Error(`Failed to get organization: ${error instanceof Error ? error.message : String(error)}`);
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
      throw new Error(`Failed to update organization: ${error instanceof Error ? error.message : String(error)}`);
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
      throw new Error(`Failed to delete organization: ${error instanceof Error ? error.message : String(error)}`);
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
  async getMembers(id: string, first?: number, max?: number): Promise<OrganizationMemberRepresentation[]> {
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
      throw new Error(`Failed to get organization members: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add a member to an organization
   * 
   * Endpoint: POST /{realm}/organizations/{id}/members/{userId}
   * 
   * @param id - Organization ID
   * @param userId - User ID to add as member
   * @param roles - Optional array of roles to assign to the member
   * @returns Promise resolving when the member is added
   */
  async addMember(id: string, userId: string, roles?: string[]): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    try {
      const payload = roles ? { roles } : {};
      await this.sdk.request<void>(`/organizations/${id}/members/${userId}`, 'POST', payload);
    } catch (error) {
      console.error(`Error adding member ${userId} to organization ${id}:`, error);
      throw new Error(`Failed to add organization member: ${error instanceof Error ? error.message : String(error)}`);
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
      throw new Error(`Failed to remove organization member: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update member roles in an organization
   * 
   * Endpoint: PUT /{realm}/organizations/{id}/members/{userId}
   * 
   * @param id - Organization ID
   * @param userId - User ID
   * @param roles - Array of roles to assign to the member
   * @returns Promise resolving when the roles are updated
   */
  async updateMemberRoles(id: string, userId: string, roles: string[]): Promise<void> {
    if (!id) {
      throw new Error('Organization ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!roles || !Array.isArray(roles)) {
      throw new Error('Roles array is required');
    }
    
    try {
      await this.sdk.request<void>(`/organizations/${id}/members/${userId}`, 'PUT', { roles });
    } catch (error) {
      console.error(`Error updating roles for member ${userId} in organization ${id}:`, error);
      throw new Error(`Failed to update organization member roles: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
