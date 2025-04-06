/**
 * Roles by ID API for Keycloak Admin SDK
 *
 * This module provides methods to manage roles directly by their ID in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
import { RoleRepresentation } from '../../types/roles';
import { ManagementPermissionReference } from '../../types/groups';

/**
 * Interface for querying role composites
 */
interface GetRoleCompositesQuery {
  first?: number;
  max?: number;
  search?: string;
}

/**
 * Roles by ID API class
 *
 * Provides methods to manage roles directly by their ID in Keycloak
 */
export class RolesByIdApi {
  /**
   * Constructor for RolesByIdApi
   *
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(private sdk: KeycloakAdminSDK) {}

  /**
   * Get a specific role by ID
   *
   * Endpoint: GET /{realm}/roles-by-id/{role-id}
   *
   * @param roleId - ID of the role
   * @returns Promise resolving to the role representation
   */
  async get(roleId: string): Promise<RoleRepresentation> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation>(`/roles-by-id/${roleId}`, 'GET');
    } catch (error) {
      console.error(`Error getting role by ID ${roleId}:`, error);
      throw new Error(
        `Failed to get role by ID: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a role by ID
   *
   * Endpoint: PUT /{realm}/roles-by-id/{role-id}
   *
   * @param roleId - ID of the role
   * @param role - Updated role representation
   * @returns Promise resolving when the operation completes
   */
  async update(roleId: string, role: RoleRepresentation): Promise<void> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    if (!role) {
      throw new Error('Role representation is required');
    }

    try {
      await this.sdk.request<void>(`/roles-by-id/${roleId}`, 'PUT', role);
    } catch (error) {
      console.error(`Error updating role by ID ${roleId}:`, error);
      throw new Error(
        `Failed to update role by ID: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a role by ID
   *
   * Endpoint: DELETE /{realm}/roles-by-id/{role-id}
   *
   * @param roleId - ID of the role
   * @returns Promise resolving when the operation completes
   */
  async delete(roleId: string): Promise<void> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      await this.sdk.request<void>(`/roles-by-id/${roleId}`, 'DELETE');
    } catch (error) {
      console.error(`Error deleting role by ID ${roleId}:`, error);
      throw new Error(
        `Failed to delete role by ID: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get role composites
   *
   * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites
   *
   * @param roleId - ID of the role
   * @param query - Optional query parameters
   * @returns Promise resolving to an array of role representations
   */
  async getComposites(
    roleId: string,
    query?: GetRoleCompositesQuery
  ): Promise<RoleRepresentation[]> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      // Convert query object to query string for proper request handling
      let endpoint = `/roles-by-id/${roleId}/composites`;
      if (query) {
        const queryParams: string[] = [];
        if (query.first !== undefined) queryParams.push(`first=${query.first}`);
        if (query.max !== undefined) queryParams.push(`max=${query.max}`);
        if (query.search) queryParams.push(`search=${encodeURIComponent(query.search)}`);

        if (queryParams.length > 0) {
          endpoint += `?${queryParams.join('&')}`;
        }
      }

      return this.sdk.request<RoleRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error(`Error getting role composites for role ID ${roleId}:`, error);
      throw new Error(
        `Failed to get role composites: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add composites to a role
   *
   * Endpoint: POST /{realm}/roles-by-id/{role-id}/composites
   *
   * @param roleId - ID of the role
   * @param roles - Array of roles to add as composites
   * @returns Promise resolving when the operation completes
   */
  async addComposites(roleId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`/roles-by-id/${roleId}/composites`, 'POST', roles);
    } catch (error) {
      console.error(`Error adding composites to role ID ${roleId}:`, error);
      throw new Error(
        `Failed to add role composites: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Remove composites from a role
   *
   * Endpoint: DELETE /{realm}/roles-by-id/{role-id}/composites
   *
   * @param roleId - ID of the role
   * @param roles - Array of roles to remove from composites
   * @returns Promise resolving when the operation completes
   */
  async removeComposites(roleId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`/roles-by-id/${roleId}/composites`, 'DELETE', roles);
    } catch (error) {
      console.error(`Error removing composites from role ID ${roleId}:`, error);
      throw new Error(
        `Failed to remove role composites: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get realm-level role composites
   *
   * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites/realm
   *
   * @param roleId - ID of the role
   * @returns Promise resolving to an array of role representations
   */
  async getRealmRoleComposites(roleId: string): Promise<RoleRepresentation[]> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(
        `/roles-by-id/${roleId}/composites/realm`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting realm role composites for role ID ${roleId}:`, error);
      throw new Error(
        `Failed to get realm role composites: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client-level role composites for a specific client
   *
   * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites/clients/{clientId}
   *
   * @param roleId - ID of the role
   * @param clientId - ID of the client
   * @returns Promise resolving to an array of role representations
   */
  async getClientRoleComposites(roleId: string, clientId: string): Promise<RoleRepresentation[]> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(
        `/roles-by-id/${roleId}/composites/clients/${clientId}`,
        'GET'
      );
    } catch (error) {
      console.error(
        `Error getting client role composites for role ID ${roleId} and client ${clientId}:`,
        error
      );
      throw new Error(
        `Failed to get client role composites: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get role permissions
   *
   * Endpoint: GET /{realm}/roles-by-id/{role-id}/management/permissions
   *
   * @param roleId - ID of the role
   * @returns Promise resolving to the management permission reference
   */
  async getPermissions(roleId: string): Promise<ManagementPermissionReference> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      const endpoint = `/roles-by-id/${roleId}/management/permissions`;

      return this.sdk.request<ManagementPermissionReference>(endpoint, 'GET');
    } catch (error) {
      console.error(`Error getting permissions for role ID ${roleId}:`, error);

      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      throw error; // Rethrow the original error for proper debugging
    }
  }

  /**
   * Update role permissions
   *
   * Endpoint: PUT /{realm}/roles-by-id/{role-id}/management/permissions
   *
   * @param roleId - ID of the role
   * @param permissions - Management permission reference
   * @returns Promise resolving to the updated management permission reference
   */
  async updatePermissions(
    roleId: string,
    permissions: ManagementPermissionReference
  ): Promise<ManagementPermissionReference> {
    if (!roleId) {
      throw new Error('Role ID is required');
    }

    if (!permissions) {
      throw new Error('Permissions are required');
    }

    try {
      const endpoint = `/roles-by-id/${roleId}/management/permissions`;

      return this.sdk.request<ManagementPermissionReference>(endpoint, 'PUT', permissions);
    } catch (error) {
      console.error(`Error updating permissions for role ID ${roleId}:`, error);

      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      throw error; // Rethrow the original error for proper debugging
    }
  }
}
