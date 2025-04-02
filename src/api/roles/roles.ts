/**
 * Roles API for Keycloak Admin SDK
 * 
 * This module provides methods to manage realm and client roles in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_roles
 */

import KeycloakAdminSDK from '../../index';
import { RoleRepresentation, RoleQuery } from '../../types/roles';
import { GroupRepresentation } from '../../types/groups';
import { UserRepresentation } from '../../types/users';
import { ManagementPermissionReference } from '../../types/groups';
import { RolesByIdApi } from './roles-by-id';

/**
 * Roles API
 * 
 * Provides methods to manage realm and client roles in Keycloak
 */
export class RolesApi {
  private sdk: KeycloakAdminSDK;
  /**
   * Roles by ID API for direct ID-based operations
   */
  public byId: RolesByIdApi;

  /**
   * Constructor for RolesApi
   * 
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
    this.byId = new RolesByIdApi(sdk);
  }

  /**
   * Get all realm roles
   * 
   * Endpoint: GET /{realm}/roles
   * 
   * @param query - Query parameters for filtering roles
   * @returns Promise resolving to an array of role representations
   */
  async list(query?: RoleQuery): Promise<RoleRepresentation[]> {
    try {
      let endpoint = '/roles';
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
        
        if (query.briefRepresentation !== undefined) {
          queryParams.push(`briefRepresentation=${query.briefRepresentation}`);
        }
      }
      
      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }
      
      return this.sdk.request<RoleRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error('Error listing realm roles:', error);
      throw new Error(`Failed to list realm roles: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a new realm role
   * 
   * Endpoint: POST /{realm}/roles
   * 
   * @param role - Role representation to create
   * @returns Promise resolving to the ID of the created role
   */
  async create(role: RoleRepresentation): Promise<string> {
    if (!role) {
      throw new Error('Role data is required');
    }
    
    if (!role.name) {
      throw new Error('Role name is required');
    }
    
    try {
      // Make the POST request to create the role
      // Keycloak returns a 201 Created with a Location header containing the role ID
      // Our enhanced request utility will extract the ID from the Location header
      await this.sdk.request<void>('/roles', 'POST', role);
      
      // Get the created role to return its ID
      const createdRole = await this.getByName(role.name);
      if (!createdRole || !createdRole.id) {
        throw new Error(`Role was created but could not be found by name: ${role.name}`);
      }
      
      console.log(`Created realm role with ID: ${createdRole.id}`);
      return createdRole.id;
    } catch (error) {
      console.error('Error creating realm role:', error);
      throw new Error(`Failed to create realm role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a realm role by name
   * 
   * Endpoint: GET /{realm}/roles/{role-name}
   * 
   * @param name - Role name
   * @returns Promise resolving to the role representation
   */
  async getByName(name: string): Promise<RoleRepresentation> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      return this.sdk.request<RoleRepresentation>(`/roles/${name}`, 'GET');
    } catch (error) {
      console.error(`Error getting realm role by name ${name}:`, error);
      throw new Error(`Failed to get realm role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a role by ID
   * 
   * Endpoint: GET /{realm}/roles-by-id/{id}
   * 
   * @param id - Role ID
   * @returns Promise resolving to the role representation
   * @deprecated Use byId.get() instead
   */
  async getById(id: string): Promise<RoleRepresentation> {
    console.warn('RolesApi.getById() is deprecated. Use RolesApi.byId.get() instead.');
    return this.byId.get(id);
  }

  /**
   * Update a realm role
   * 
   * Endpoint: PUT /{realm}/roles/{role-name}
   * 
   * @param name - Role name
   * @param role - Updated role representation
   * @returns Promise resolving when the update is complete
   */
  async update(name: string, role: RoleRepresentation): Promise<void> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    if (!role) {
      throw new Error('Role data is required');
    }
    
    try {
      await this.sdk.request<void>(`/roles/${name}`, 'PUT', role);
    } catch (error) {
      console.error(`Error updating realm role ${name}:`, error);
      throw new Error(`Failed to update realm role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete a realm role
   * 
   * Endpoint: DELETE /{realm}/roles/{role-name}
   * 
   * @param name - Role name
   * @returns Promise resolving when the deletion is complete
   */
  async delete(name: string): Promise<void> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      await this.sdk.request<void>(`/roles/${name}`, 'DELETE');
    } catch (error) {
      console.error(`Error deleting realm role ${name}:`, error);
      throw new Error(`Failed to delete realm role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get role composites
   * 
   * Endpoint: GET /{realm}/roles/{role-name}/composites
   * 
   * @param name - Role name
   * @returns Promise resolving to an array of composite roles
   */
  async getComposites(name: string): Promise<RoleRepresentation[]> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      return this.sdk.request<RoleRepresentation[]>(`/roles/${name}/composites`, 'GET');
    } catch (error) {
      console.error(`Error getting composites for role ${name}:`, error);
      throw new Error(`Failed to get role composites: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add composites to a role
   * 
   * Endpoint: POST /{realm}/roles/{role-name}/composites
   * 
   * @param name - Role name
   * @param roles - Array of roles to add as composites
   * @returns Promise resolving when the composites are added
   */
  async addComposites(name: string, roles: RoleRepresentation[]): Promise<void> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }
    
    try {
      await this.sdk.request<void>(`/roles/${name}/composites`, 'POST', roles);
    } catch (error) {
      console.error(`Error adding composites to role ${name}:`, error);
      throw new Error(`Failed to add role composites: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Remove composites from a role
   * 
   * Endpoint: DELETE /{realm}/roles/{role-name}/composites
   * 
   * @param name - Role name
   * @param roles - Array of roles to remove from composites
   * @returns Promise resolving when the composites are removed
   */
  async removeComposites(name: string, roles: RoleRepresentation[]): Promise<void> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }
    
    try {
      await this.sdk.request<void>(`/roles/${name}/composites`, 'DELETE', roles);
    } catch (error) {
      console.error(`Error removing composites from role ${name}:`, error);
      throw new Error(`Failed to remove role composites: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get realm role composites
   * 
   * Endpoint: GET /{realm}/roles/{role-name}/composites/realm
   * 
   * @param name - Role name
   * @returns Promise resolving to an array of realm role composites
   */
  async getRealmRoleComposites(name: string): Promise<RoleRepresentation[]> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      return this.sdk.request<RoleRepresentation[]>(`/roles/${name}/composites/realm`, 'GET');
    } catch (error) {
      console.error(`Error getting realm composites for role ${name}:`, error);
      throw new Error(`Failed to get realm role composites: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get client role composites for a specific client
   * 
   * Endpoint: GET /{realm}/roles/{role-name}/composites/clients/{client-uuid}
   * 
   * @param name - Role name
   * @param clientId - Client ID
   * @returns Promise resolving to an array of client role composites
   */
  async getClientRoleComposites(name: string, clientId: string): Promise<RoleRepresentation[]> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    
    try {
      return this.sdk.request<RoleRepresentation[]>(`/roles/${name}/composites/clients/${clientId}`, 'GET');
    } catch (error) {
      console.error(`Error getting client composites for role ${name} and client ${clientId}:`, error);
      throw new Error(`Failed to get client role composites: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get users with a specific role
   * 
   * Endpoint: GET /{realm}/roles/{role-name}/users
   * 
   * @param name - Role name
   * @param query - Query parameters for pagination and representation
   * @returns Promise resolving to an array of users with the role
   */
  async getUsersWithRole(name: string, query?: { first?: number; max?: number; briefRepresentation?: boolean }): Promise<UserRepresentation[]> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      let endpoint = `/roles/${name}/users`;
      const queryParams: string[] = [];
      
      if (query) {
        if (query.first !== undefined) {
          queryParams.push(`first=${query.first}`);
        }
        
        if (query.max !== undefined) {
          queryParams.push(`max=${query.max}`);
        }
        
        if (query.briefRepresentation !== undefined) {
          queryParams.push(`briefRepresentation=${query.briefRepresentation}`);
        }
      }
      
      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }
      
      return this.sdk.request<UserRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error(`Error getting users with role ${name}:`, error);
      throw new Error(`Failed to get users with role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get groups with a specific role
   * 
   * Endpoint: GET /{realm}/roles/{role-name}/groups
   * 
   * @param name - Role name
   * @param query - Query parameters for pagination and representation
   * @returns Promise resolving to an array of groups with the role
   */
  async getGroupsWithRole(name: string, query?: { first?: number; max?: number; briefRepresentation?: boolean }): Promise<GroupRepresentation[]> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      let endpoint = `/roles/${name}/groups`;
      const queryParams: string[] = [];
      
      if (query) {
        if (query.first !== undefined) {
          queryParams.push(`first=${query.first}`);
        }
        
        if (query.max !== undefined) {
          queryParams.push(`max=${query.max}`);
        }
        
        if (query.briefRepresentation !== undefined) {
          queryParams.push(`briefRepresentation=${query.briefRepresentation}`);
        }
      }
      
      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }
      
      return this.sdk.request<GroupRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error(`Error getting groups with role ${name}:`, error);
      throw new Error(`Failed to get groups with role: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get role permissions
   * 
   * Endpoint: GET /{realm}/roles/{role-name}/management/permissions
   * 
   * @param name - Role name
   * @returns Promise resolving to the management permission reference
   */
  async getPermissions(name: string): Promise<ManagementPermissionReference> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    try {
      return this.sdk.request<ManagementPermissionReference>(`/roles/${name}/management/permissions`, 'GET');
    } catch (error) {
      console.error(`Error getting permissions for role ${name}:`, error);
      throw new Error(`Failed to get role permissions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update role permissions
   * 
   * Endpoint: PUT /{realm}/roles/{role-name}/management/permissions
   * 
   * @param name - Role name
   * @param permissions - Management permission reference
   * @returns Promise resolving to the updated management permission reference
   */
  async updatePermissions(name: string, permissions: ManagementPermissionReference): Promise<ManagementPermissionReference> {
    if (!name) {
      throw new Error('Role name is required');
    }
    
    if (!permissions) {
      throw new Error('Permissions data is required');
    }
    
    try {
      return this.sdk.request<ManagementPermissionReference>(`/roles/${name}/management/permissions`, 'PUT', permissions);
    } catch (error) {
      console.error(`Error updating permissions for role ${name}:`, error);
      throw new Error(`Failed to update role permissions: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
