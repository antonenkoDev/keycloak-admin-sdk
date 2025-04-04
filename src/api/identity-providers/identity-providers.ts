/**
 * Identity Providers API for Keycloak Admin SDK
 *
 * This module provides methods to manage identity providers in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_identity_providers
 */

import KeycloakAdminSDK from '../../index';
import { IdentityProviderRepresentation } from '../../types/identity-providers';
import {
  IdentityProviderMapperRepresentation,
  IdentityProviderMapperTypeRepresentation
} from '../../types/identity-provider-mappers';

/**
 * Identity Providers API
 *
 * Provides methods to manage identity providers in Keycloak
 */
export class IdentityProvidersApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Constructor for IdentityProvidersApi
   *
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get all identity providers
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/instances
   *
   * @param briefRepresentation - Whether to return brief representations
   * @param first - Pagination offset
   * @param max - Maximum results size (defaults to 100)
   * @param search - Filter providers by name
   * @returns Promise resolving to an array of identity provider representations
   */
  async findAll(options?: {
    briefRepresentation?: boolean;
    first?: number;
    max?: number;
    search?: string;
    realmOnly?: boolean;
  }): Promise<IdentityProviderRepresentation[]> {
    try {
      return this.sdk.request<IdentityProviderRepresentation[]>(
        '/identity-provider/instances',
        'GET',
        undefined,
        options
      );
    } catch (error) {
      console.error('Error listing identity providers:', error);
      throw new Error(
        `Failed to list identity providers: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new identity provider
   *
   * Endpoint: POST /admin/realms/{realm}/identity-provider/instances
   *
   * @param provider - Identity provider representation to create
   * @returns Promise resolving to the alias of the created identity provider
   */
  async create(provider: IdentityProviderRepresentation): Promise<string> {
    if (!provider) {
      throw new Error('Identity provider data is required');
    }

    if (!provider.alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      // Make the POST request to create the identity provider
      // Keycloak returns a 201 Created status
      await this.sdk.request<void>('/identity-provider/instances', 'POST', provider);

      // Return the alias as the identifier
      return provider.alias;
    } catch (error) {
      console.error('Error creating identity provider:', error);
      throw new Error(
        `Failed to create identity provider: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get an identity provider by alias
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}
   *
   * @param alias - Identity provider alias
   * @returns Promise resolving to the identity provider representation
   */
  async get(alias: string): Promise<IdentityProviderRepresentation> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      return this.sdk.request<IdentityProviderRepresentation>(
        `/identity-provider/instances/${alias}`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting identity provider with alias ${alias}:`, error);
      throw new Error(
        `Failed to get identity provider: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update an identity provider
   *
   * Endpoint: PUT /admin/realms/{realm}/identity-provider/instances/{alias}
   *
   * @param alias - Identity provider alias
   * @param provider - Updated identity provider representation
   * @returns Promise resolving when the update is complete
   */
  async update(alias: string, provider: IdentityProviderRepresentation): Promise<void> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    if (!provider) {
      throw new Error('Identity provider data is required');
    }

    try {
      await this.sdk.request<void>(`/identity-provider/instances/${alias}`, 'PUT', provider);
    } catch (error) {
      console.error(`Error updating identity provider with alias ${alias}:`, error);
      throw new Error(
        `Failed to update identity provider: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete an identity provider
   *
   * Endpoint: DELETE /admin/realms/{realm}/identity-provider/instances/{alias}
   *
   * @param alias - Identity provider alias
   * @returns Promise resolving when the deletion is complete
   */
  async delete(alias: string): Promise<void> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      await this.sdk.request<void>(`/identity-provider/instances/${alias}`, 'DELETE');
    } catch (error) {
      console.error(`Error deleting identity provider with alias ${alias}:`, error);
      throw new Error(
        `Failed to delete identity provider: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get the factory for a specific identity provider type
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/providers/{provider_id}
   *
   * @param providerId - Identity provider type ID (e.g., 'oidc', 'saml')
   * @returns Promise resolving to the identity provider factory
   */
  async getProviderFactory(providerId: string): Promise<Record<string, any>> {
    if (!providerId) {
      throw new Error('Provider ID is required');
    }

    try {
      return this.sdk.request<Record<string, any>>(
        `/identity-provider/providers/${providerId}`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting provider factory for ${providerId}:`, error);
      throw new Error(
        `Failed to get provider factory: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a specific provider type
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/providers/{provider_id}
   *
   * @param providerId - The ID of the provider type to get
   * @returns Promise resolving to the provider type configuration
   */
  async getProviderType(providerId: string): Promise<Record<string, any>> {
    if (!providerId) {
      throw new Error('Provider ID is required');
    }

    try {
      return this.sdk.request<Record<string, any>>(
        `/identity-provider/providers/${providerId}`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting provider type ${providerId}:`, error);
      throw new Error(
        `Failed to get provider type: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Import an identity provider from a JSON file
   *
   * Endpoint: POST /admin/realms/{realm}/identity-provider/import-config
   *
   * @param providerJson - JSON string containing the provider configuration
   * @returns Promise resolving to the imported identity provider representation
   */
  async importFromJson(providerJson: string): Promise<IdentityProviderRepresentation> {
    if (!providerJson) {
      throw new Error('Provider JSON is required');
    }

    try {
      const formData = new FormData();
      const blob = new Blob([providerJson], { type: 'application/json' });
      formData.append('file', blob);

      return this.sdk.request<IdentityProviderRepresentation>(
        '/identity-provider/import-config',
        'POST',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } catch (error) {
      console.error('Error importing identity provider from JSON:', error);
      throw new Error(
        `Failed to import identity provider: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get all mappers for an identity provider
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mappers
   *
   * @param alias - Identity provider alias
   * @returns Promise resolving to an array of identity provider mapper representations
   */
  async getMappers(alias: string): Promise<IdentityProviderMapperRepresentation[]> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      return this.sdk.request<IdentityProviderMapperRepresentation[]>(
        `/identity-provider/instances/${alias}/mappers`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting mappers for identity provider ${alias}:`, error);
      throw new Error(
        `Failed to get identity provider mappers: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new mapper for an identity provider
   *
   * Endpoint: POST /admin/realms/{realm}/identity-provider/instances/{alias}/mappers
   *
   * @param alias - Identity provider alias
   * @param mapper - Identity provider mapper representation to create
   * @returns Promise resolving to the ID of the created mapper
   */
  async createMapper(alias: string, mapper: IdentityProviderMapperRepresentation): Promise<string> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    if (!mapper) {
      throw new Error('Mapper data is required');
    }

    try {
      // According to the Keycloak API, this endpoint returns 201 Created with the ID in the response
      const response = await this.sdk.request<{ id: string }>(
        `/identity-provider/instances/${alias}/mappers`,
        'POST',
        mapper
      );

      if (response && response.id) {
        return response.id;
      } else {
        // If we don't get an ID back, use the name as a fallback
        console.warn('No ID returned from create mapper endpoint, using name as ID');
        return mapper.name || '';
      }
    } catch (error) {
      console.error(`Error creating mapper for identity provider ${alias}:`, error);
      throw new Error(
        `Failed to create identity provider mapper: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a specific mapper for an identity provider
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
   *
   * @param alias - Identity provider alias
   * @param id - Mapper ID
   * @returns Promise resolving to the identity provider mapper representation
   */
  async getMapper(alias: string, id: string): Promise<IdentityProviderMapperRepresentation> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    if (!id) {
      throw new Error('Mapper ID is required');
    }

    try {
      return this.sdk.request<IdentityProviderMapperRepresentation>(
        `/identity-provider/instances/${alias}/mappers/${id}`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting mapper ${id} for identity provider ${alias}:`, error);
      throw new Error(
        `Failed to get identity provider mapper: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a mapper for an identity provider
   *
   * Endpoint: PUT /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
   *
   * @param alias - Identity provider alias
   * @param id - Mapper ID
   * @param mapper - Updated identity provider mapper representation
   * @returns Promise resolving when the update is complete
   */
  async updateMapper(
    alias: string,
    id: string,
    mapper: IdentityProviderMapperRepresentation
  ): Promise<void> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    if (!id) {
      throw new Error('Mapper ID is required');
    }

    if (!mapper) {
      throw new Error('Mapper data is required');
    }

    try {
      await this.sdk.request<void>(
        `/identity-provider/instances/${alias}/mappers/${id}`,
        'PUT',
        mapper
      );
    } catch (error) {
      console.error(`Error updating mapper ${id} for identity provider ${alias}:`, error);
      throw new Error(
        `Failed to update identity provider mapper: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a mapper for an identity provider
   *
   * Endpoint: DELETE /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
   *
   * @param alias - Identity provider alias
   * @param id - Mapper ID
   * @returns Promise resolving when the deletion is complete
   */
  async deleteMapper(alias: string, id: string): Promise<void> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    if (!id) {
      throw new Error('Mapper ID is required');
    }

    try {
      await this.sdk.request<void>(`/identity-provider/instances/${alias}/mappers/${id}`, 'DELETE');
    } catch (error) {
      console.error(`Error deleting mapper ${id} for identity provider ${alias}:`, error);
      throw new Error(
        `Failed to delete identity provider mapper: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get available mapper types for an identity provider
   *
   * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mapper-types
   *
   * @param alias - Identity provider alias
   * @returns Promise resolving to a map of identity provider mapper type representations
   */
  async getMapperTypes(
    alias: string
  ): Promise<Record<string, IdentityProviderMapperTypeRepresentation>> {
    if (!alias) {
      throw new Error('Identity provider alias is required');
    }

    try {
      // According to the Keycloak API documentation, this returns a Map of mapper types
      return this.sdk.request<Record<string, IdentityProviderMapperTypeRepresentation>>(
        `/identity-provider/instances/${alias}/mapper-types`,
        'GET'
      );
    } catch (error) {
      console.error(`Error getting mapper types for identity provider ${alias}:`, error);
      throw new Error(
        `Failed to get identity provider mapper types: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
