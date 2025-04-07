/**
 * Client Role Mappings API for Keycloak Admin SDK
 * Provides methods for managing client-level role mappings for users and groups
 */

import KeycloakClient from '../../index';
import { RoleRepresentation } from '../../types/roles';

/**
 * Base class for client role mappings operations
 */
export abstract class BaseClientRoleMappingsApi {
  protected sdk: KeycloakClient;

  protected abstract getBasePath(id: string): string;

  /**
   * Creates a new instance of the Base Client Role Mappings API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get client-level role mappings for the user or group, and the app
   *
   * @param {string} id - The user or group ID
   * @param {string} clientId - The client ID (not client-id)
   * @returns {Promise<RoleRepresentation[]>} List of role mappings
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getClientRoleMappings(id: string, clientId: string): Promise<RoleRepresentation[]> {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(
        `${this.getBasePath(id)}/role-mappings/clients/${clientId}`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add client-level roles to the user or group role mapping
   *
   * @param {string} id - The user or group ID
   * @param {string} clientId - The client ID (not client-id)
   * @param {RoleRepresentation[]} roles - The roles to add
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async addClientRoleMappings(
    id: string,
    clientId: string,
    roles: RoleRepresentation[]
  ): Promise<void> {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('Roles array is required and must not be empty');
    }

    try {
      await this.sdk.request<void>(
        `${this.getBasePath(id)}/role-mappings/clients/${clientId}`,
        'POST',
        roles
      );
    } catch (error) {
      throw new Error(
        `Failed to add client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete client-level roles from user or group role mapping
   *
   * @param {string} id - The user or group ID
   * @param {string} clientId - The client ID (not client-id)
   * @param {RoleRepresentation[]} roles - The roles to delete
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async deleteClientRoleMappings(
    id: string,
    clientId: string,
    roles: RoleRepresentation[]
  ): Promise<void> {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('Roles array is required and must not be empty');
    }

    try {
      await this.sdk.request<void>(
        `${this.getBasePath(id)}/role-mappings/clients/${clientId}`,
        'DELETE',
        roles
      );
    } catch (error) {
      throw new Error(
        `Failed to delete client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get available client-level roles that can be mapped to the user or group
   *
   * @param {string} id - The user or group ID
   * @param {string} clientId - The client ID (not client-id)
   * @returns {Promise<RoleRepresentation[]>} List of available roles
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getAvailableClientRoleMappings(
    id: string,
    clientId: string
  ): Promise<RoleRepresentation[]> {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(
        `${this.getBasePath(id)}/role-mappings/clients/${clientId}/available`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get available client role mappings: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get effective client-level role mappings
   * This recurses any composite roles
   *
   * @param {string} id - The user or group ID
   * @param {string} clientId - The client ID (not client-id)
   * @param {boolean} [briefRepresentation=true] - If false, return roles with their attributes
   * @returns {Promise<RoleRepresentation[]>} List of effective role mappings
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getEffectiveClientRoleMappings(
    id: string,
    clientId: string,
    briefRepresentation: boolean = true
  ): Promise<RoleRepresentation[]> {
    if (!id) {
      throw new Error('ID is required');
    }

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      const queryParams = briefRepresentation ? {} : { briefRepresentation: false };

      return this.sdk.request<RoleRepresentation[]>(
        `${this.getBasePath(id)}/role-mappings/clients/${clientId}/composite`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      throw new Error(
        `Failed to get effective client role mappings: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

/**
 * API for managing client role mappings for users
 */
export class UserClientRoleMappingsApi extends BaseClientRoleMappingsApi {
  /**
   * Get the base path for user role mappings
   *
   * @param {string} userId - The user ID
   * @returns {string} The base path
   */
  protected getBasePath(userId: string): string {
    return `/users/${userId}`;
  }
}

/**
 * API for managing client role mappings for groups
 */
export class GroupClientRoleMappingsApi extends BaseClientRoleMappingsApi {
  /**
   * Get the base path for group role mappings
   *
   * @param {string} groupId - The group ID
   * @returns {string} The base path
   */
  protected getBasePath(groupId: string): string {
    return `/groups/${groupId}`;
  }
}
