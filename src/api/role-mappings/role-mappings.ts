/**
 * Role Mappings API for Keycloak Admin SDK
 *
 * This module provides a base class for managing role mappings in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakClient from '../../index';
import { RoleRepresentation } from '../../types/roles';
import { MappingsRepresentation } from '../../types/role-mappings';

/**
 * Base Role Mappings API
 *
 * Provides common methods for managing role mappings that can be used by both users and groups
 */
export abstract class BaseRoleMappingsApi {
  protected sdk: KeycloakClient;
  protected abstract resourcePath: string;

  /**
   * Constructor for BaseRoleMappingsApi
   *
   * @param sdk - KeycloakClient instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get all role mappings for the resource
   *
   * @returns Promise resolving to the mappings representation
   */
  async getAll(): Promise<MappingsRepresentation> {
    try {
      return this.sdk.request<MappingsRepresentation>(`${this.resourcePath}/role-mappings`, 'GET');
    } catch (error) {
      console.error(`Error getting all role mappings for ${this.resourcePath}:`, error);
      throw new Error(
        `Failed to get all role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get realm-level role mappings
   *
   * @returns Promise resolving to an array of role representations
   */
  async getRealmRoleMappings(): Promise<RoleRepresentation[]> {
    try {
      return this.sdk.request<RoleRepresentation[]>(
        `${this.resourcePath}/role-mappings/realm`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting realm role mappings for ${this.resourcePath}:`, error);
      throw new Error(
        `Failed to get realm role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add realm-level role mappings
   *
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addRealmRoleMappings(roles: RoleRepresentation[]): Promise<void> {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`${this.resourcePath}/role-mappings/realm`, 'POST', roles);
    } catch (error) {
      console.error(`Error adding realm role mappings for ${this.resourcePath}:`, error);
      throw new Error(
        `Failed to add realm role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete realm-level role mappings
   *
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async deleteRealmRoleMappings(roles: RoleRepresentation[]): Promise<void> {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`${this.resourcePath}/role-mappings/realm`, 'DELETE', roles);
    } catch (error) {
      console.error(`Error deleting realm role mappings for ${this.resourcePath}:`, error);
      throw new Error(
        `Failed to delete realm role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get available realm-level role mappings
   *
   * @returns Promise resolving to an array of role representations
   */
  async getAvailableRealmRoleMappings(): Promise<RoleRepresentation[]> {
    try {
      return this.sdk.request<RoleRepresentation[]>(
        `${this.resourcePath}/role-mappings/realm/available`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting available realm role mappings for ${this.resourcePath}:`, error);
      throw new Error(
        `Failed to get available realm role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get effective realm-level role mappings
   *
   * @param briefRepresentation - If false, return roles with their attributes
   * @returns Promise resolving to an array of role representations
   */
  async getEffectiveRealmRoleMappings(
    briefRepresentation: boolean = true
  ): Promise<RoleRepresentation[]> {
    try {
      let endpoint = `${this.resourcePath}/role-mappings/realm/composite`;

      // Add query parameters if needed
      if (!briefRepresentation) {
        endpoint += `?briefRepresentation=false`;
      }

      return this.sdk.request<RoleRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error(`Error getting effective realm role mappings for ${this.resourcePath}:`, error);
      throw new Error(
        `Failed to get effective realm role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client-level role mappings
   *
   * @param clientId - Client ID
   * @returns Promise resolving to an array of role representations
   */
  async getClientRoleMappings(clientId: string): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(
        `${this.resourcePath}/role-mappings/clients/${clientId}`,
        'GET'
      );
    } catch (error) {
      console.error(
        `Error getting client role mappings for ${this.resourcePath} and client ${clientId}:`,
        error
      );
      throw new Error(
        `Failed to get client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add client-level role mappings
   *
   * @param clientId - Client ID
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addClientRoleMappings(clientId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(
        `${this.resourcePath}/role-mappings/clients/${clientId}`,
        'POST',
        roles
      );
    } catch (error) {
      console.error(
        `Error adding client role mappings for ${this.resourcePath} and client ${clientId}:`,
        error
      );
      throw new Error(
        `Failed to add client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete client-level role mappings
   *
   * @param clientId - Client ID
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async deleteClientRoleMappings(clientId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(
        `${this.resourcePath}/role-mappings/clients/${clientId}`,
        'DELETE',
        roles
      );
    } catch (error) {
      console.error(
        `Error deleting client role mappings for ${this.resourcePath} and client ${clientId}:`,
        error
      );
      throw new Error(
        `Failed to delete client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get available client-level role mappings
   *
   * @param clientId - Client ID
   * @returns Promise resolving to an array of role representations
   */
  async getAvailableClientRoleMappings(clientId: string): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(
        `${this.resourcePath}/role-mappings/clients/${clientId}/available`,
        'GET'
      );
    } catch (error) {
      console.error(
        `Error getting available client role mappings for ${this.resourcePath} and client ${clientId}:`,
        error
      );
      throw new Error(
        `Failed to get available client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get effective client-level role mappings
   *
   * @param clientId - Client ID
   * @param briefRepresentation - If false, return roles with their attributes
   * @returns Promise resolving to an array of role representations
   */
  async getEffectiveClientRoleMappings(
    clientId: string,
    briefRepresentation: boolean = true
  ): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      let endpoint = `${this.resourcePath}/role-mappings/clients/${clientId}/composite`;

      // Add query parameters if needed
      if (!briefRepresentation) {
        endpoint += `?briefRepresentation=false`;
      }

      return this.sdk.request<RoleRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      console.error(
        `Error getting effective client role mappings for ${this.resourcePath} and client ${clientId}:`,
        error
      );
      throw new Error(
        `Failed to get effective client role mappings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
