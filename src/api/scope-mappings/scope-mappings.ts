/**
 * Scope Mappings API for Keycloak Admin SDK
 * 
 * This module provides a base class for managing scope mappings in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
import { RoleRepresentation } from '../../types/roles';
import { MappingsRepresentation } from '../../types/role-mappings';
import { EffectiveRoleMappingsQuery } from '../../types/role-mappings';

/**
 * Base Scope Mappings API
 * 
 * Provides common methods for managing scope mappings that can be used by both clients and client scopes
 */
export abstract class BaseScopeMappingsApi {
  protected sdk: KeycloakAdminSDK;
  protected abstract resourcePath: string;

  /**
   * Constructor for BaseScopeMappingsApi
   * 
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get all scope mappings for the resource
   * 
   * @returns Promise resolving to the mappings representation
   */
  async getAll(): Promise<MappingsRepresentation> {
    try {
      return this.sdk.request<MappingsRepresentation>(`${this.resourcePath}/scope-mappings`, 'GET');
    } catch (error) {
      console.error(`Error getting all scope mappings for ${this.resourcePath}:`, error);
      throw new Error(`Failed to get all scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get realm-level roles associated with the resource's scope
   * 
   * @returns Promise resolving to an array of role representations
   */
  async getRealmScopeMappings(): Promise<RoleRepresentation[]> {
    try {
      return this.sdk.request<RoleRepresentation[]>(`${this.resourcePath}/scope-mappings/realm`, 'GET');
    } catch (error) {
      console.error(`Error getting realm scope mappings for ${this.resourcePath}:`, error);
      throw new Error(`Failed to get realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add realm-level roles to the resource's scope
   * 
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addRealmScopeMappings(roles: RoleRepresentation[]): Promise<void> {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`${this.resourcePath}/scope-mappings/realm`, 'POST', roles);
    } catch (error) {
      console.error(`Error adding realm scope mappings for ${this.resourcePath}:`, error);
      throw new Error(`Failed to add realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete realm-level roles from the resource's scope
   * 
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async deleteRealmScopeMappings(roles: RoleRepresentation[]): Promise<void> {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`${this.resourcePath}/scope-mappings/realm`, 'DELETE', roles);
    } catch (error) {
      console.error(`Error deleting realm scope mappings for ${this.resourcePath}:`, error);
      throw new Error(`Failed to delete realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get available realm-level roles that can be mapped to the resource's scope
   * 
   * @returns Promise resolving to an array of role representations
   */
  async getAvailableRealmScopeMappings(): Promise<RoleRepresentation[]> {
    try {
      return this.sdk.request<RoleRepresentation[]>(`${this.resourcePath}/scope-mappings/realm/available`, 'GET');
    } catch (error) {
      console.error(`Error getting available realm scope mappings for ${this.resourcePath}:`, error);
      throw new Error(`Failed to get available realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get effective realm-level roles associated with the resource's scope
   * 
   * @param query - Optional query parameters
   * @returns Promise resolving to an array of role representations
   */
  async getEffectiveRealmScopeMappings(query?: EffectiveRoleMappingsQuery): Promise<RoleRepresentation[]> {
    try {
      const queryParams = query ? { briefRepresentation: query.briefRepresentation } : undefined;
      return this.sdk.request<RoleRepresentation[]>(
        `${this.resourcePath}/scope-mappings/realm/composite`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      console.error(`Error getting effective realm scope mappings for ${this.resourcePath}:`, error);
      throw new Error(`Failed to get effective realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get client-level roles associated with the resource's scope
   * 
   * @param clientId - ID of the client
   * @returns Promise resolving to an array of role representations
   */
  async getClientScopeMappings(clientId: string): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(`${this.resourcePath}/scope-mappings/clients/${clientId}`, 'GET');
    } catch (error) {
      console.error(`Error getting client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
      throw new Error(`Failed to get client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add client-level roles to the resource's scope
   * 
   * @param clientId - ID of the client
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addClientScopeMappings(clientId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`${this.resourcePath}/scope-mappings/clients/${clientId}`, 'POST', roles);
    } catch (error) {
      console.error(`Error adding client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
      throw new Error(`Failed to add client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete client-level roles from the resource's scope
   * 
   * @param clientId - ID of the client
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async deleteClientScopeMappings(clientId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`${this.resourcePath}/scope-mappings/clients/${clientId}`, 'DELETE', roles);
    } catch (error) {
      console.error(`Error deleting client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
      throw new Error(`Failed to delete client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get available client-level roles that can be mapped to the resource's scope
   * 
   * @param clientId - ID of the client
   * @returns Promise resolving to an array of role representations
   */
  async getAvailableClientScopeMappings(clientId: string): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(`${this.resourcePath}/scope-mappings/clients/${clientId}/available`, 'GET');
    } catch (error) {
      console.error(`Error getting available client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
      throw new Error(`Failed to get available client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get effective client-level roles associated with the resource's scope
   * 
   * @param clientId - ID of the client
   * @param query - Optional query parameters
   * @returns Promise resolving to an array of role representations
   */
  async getEffectiveClientScopeMappings(clientId: string, query?: EffectiveRoleMappingsQuery): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      const queryParams = query ? { briefRepresentation: query.briefRepresentation } : undefined;
      return this.sdk.request<RoleRepresentation[]>(
        `${this.resourcePath}/scope-mappings/clients/${clientId}/composite`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      console.error(`Error getting effective client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
      throw new Error(`Failed to get effective client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
