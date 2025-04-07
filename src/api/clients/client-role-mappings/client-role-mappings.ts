/**
 * Client Role Mappings API
 *
 * This module provides methods to manage client role mappings for users and groups in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import { RoleRepresentation } from '../../../types/roles';
import KeycloakClient from '../../../index';

/**
 * Client Role Mappings API
 *
 * Provides methods to manage client role mappings for users and groups
 */
export class ClientRoleMappingsApi {
  private sdk: KeycloakClient;

  /**
   * Constructor for ClientRoleMappingsApi
   *
   * @param sdk - KeycloakClient instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get client-level role mappings for a user
   *
   * @param userId - User ID
   * @param clientId - Client ID (not client ID)
   * @returns Promise resolving to an array of role representations
   */
  async getUserClientRoleMappings(userId: string, clientId: string): Promise<RoleRepresentation[]> {
    if (!userId) throw new Error('User ID is required');
    if (!clientId) throw new Error('Client ID is required');

    return this.sdk.request<RoleRepresentation[]>(
      `/users/${userId}/role-mappings/clients/${clientId}`,
      'GET'
    );
  }

  /**
   * Add client-level roles to a user
   *
   * @param userId - User ID
   * @param clientId - Client ID (not client ID)
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addUserClientRoleMappings(
    userId: string,
    clientId: string,
    roles: RoleRepresentation[]
  ): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (!clientId) throw new Error('Client ID is required');
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    await this.sdk.request<void>(
      `/users/${userId}/role-mappings/clients/${clientId}`,
      'POST',
      roles
    );
  }

  /**
   * Delete client-level roles from a user
   *
   * @param userId - User ID
   * @param clientId - Client ID (not client ID)
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async deleteUserClientRoleMappings(
    userId: string,
    clientId: string,
    roles: RoleRepresentation[]
  ): Promise<void> {
    if (!userId) throw new Error('User ID is required');
    if (!clientId) throw new Error('Client ID is required');
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    await this.sdk.request<void>(
      `/users/${userId}/role-mappings/clients/${clientId}`,
      'DELETE',
      roles
    );
  }

  /**
   * Get available client-level roles that can be mapped to a user
   *
   * @param userId - User ID
   * @param clientId - Client ID (not client ID)
   * @returns Promise resolving to an array of available role representations
   */
  async getAvailableUserClientRoleMappings(
    userId: string,
    clientId: string
  ): Promise<RoleRepresentation[]> {
    if (!userId) throw new Error('User ID is required');
    if (!clientId) throw new Error('Client ID is required');

    return this.sdk.request<RoleRepresentation[]>(
      `/users/${userId}/role-mappings/clients/${clientId}/available`,
      'GET'
    );
  }

  /**
   * Get effective client-level role mappings for a user (including composite roles)
   *
   * @param userId - User ID
   * @param clientId - Client ID (not client ID)
   * @param briefRepresentation - If false, return roles with their attributes
   * @returns Promise resolving to an array of effective role representations
   */
  async getEffectiveUserClientRoleMappings(
    userId: string,
    clientId: string,
    briefRepresentation: boolean = true
  ): Promise<RoleRepresentation[]> {
    if (!userId) throw new Error('User ID is required');
    if (!clientId) throw new Error('Client ID is required');

    const queryParams = briefRepresentation ? '' : '?briefRepresentation=false';

    return this.sdk.request<RoleRepresentation[]>(
      `/users/${userId}/role-mappings/clients/${clientId}/composite${queryParams}`,
      'GET'
    );
  }

  /**
   * Get client-level role mappings for a group
   *
   * @param groupId - Group ID
   * @param clientId - Client ID (not client ID)
   * @returns Promise resolving to an array of role representations
   */
  async getGroupClientRoleMappings(
    groupId: string,
    clientId: string
  ): Promise<RoleRepresentation[]> {
    if (!groupId) throw new Error('Group ID is required');
    if (!clientId) throw new Error('Client ID is required');

    return this.sdk.request<RoleRepresentation[]>(
      `/groups/${groupId}/role-mappings/clients/${clientId}`,
      'GET'
    );
  }

  /**
   * Add client-level roles to a group
   *
   * @param groupId - Group ID
   * @param clientId - Client ID (not client ID)
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addGroupClientRoleMappings(
    groupId: string,
    clientId: string,
    roles: RoleRepresentation[]
  ): Promise<void> {
    if (!groupId) throw new Error('Group ID is required');
    if (!clientId) throw new Error('Client ID is required');
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    await this.sdk.request<void>(
      `/groups/${groupId}/role-mappings/clients/${clientId}`,
      'POST',
      roles
    );
  }

  /**
   * Delete client-level roles from a group
   *
   * @param groupId - Group ID
   * @param clientId - Client ID (not client ID)
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async deleteGroupClientRoleMappings(
    groupId: string,
    clientId: string,
    roles: RoleRepresentation[]
  ): Promise<void> {
    if (!groupId) throw new Error('Group ID is required');
    if (!clientId) throw new Error('Client ID is required');
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    await this.sdk.request<void>(
      `/groups/${groupId}/role-mappings/clients/${clientId}`,
      'DELETE',
      roles
    );
  }

  /**
   * Get available client-level roles that can be mapped to a group
   *
   * @param groupId - Group ID
   * @param clientId - Client ID (not client ID)
   * @returns Promise resolving to an array of available role representations
   */
  async getAvailableGroupClientRoleMappings(
    groupId: string,
    clientId: string
  ): Promise<RoleRepresentation[]> {
    if (!groupId) throw new Error('Group ID is required');
    if (!clientId) throw new Error('Client ID is required');

    return this.sdk.request<RoleRepresentation[]>(
      `/groups/${groupId}/role-mappings/clients/${clientId}/available`,
      'GET'
    );
  }

  /**
   * Get effective client-level role mappings for a group (including composite roles)
   *
   * @param groupId - Group ID
   * @param clientId - Client ID (not client ID)
   * @param briefRepresentation - If false, return roles with their attributes
   * @returns Promise resolving to an array of effective role representations
   */
  async getEffectiveGroupClientRoleMappings(
    groupId: string,
    clientId: string,
    briefRepresentation: boolean = true
  ): Promise<RoleRepresentation[]> {
    if (!groupId) throw new Error('Group ID is required');
    if (!clientId) throw new Error('Client ID is required');

    const queryParams = briefRepresentation ? '' : '?briefRepresentation=false';

    return this.sdk.request<RoleRepresentation[]>(
      `/groups/${groupId}/role-mappings/clients/${clientId}/composite${queryParams}`,
      'GET'
    );
  }
}
