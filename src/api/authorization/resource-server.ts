/**
 * Resource Server API for Keycloak Admin SDK
 * Focused on managing resource server configuration
 */

import KeycloakClient from '../../index';
import {
  ResourceRepresentation,
  ResourceRepresentationResponse,
  ResourceServerRepresentation
} from '../../types/authorization';

/**
 * API for managing Resource Server configuration in Keycloak
 *
 * A Resource Server is a client application that hosts protected resources
 * and relies on authorization policies to decide whether access should be granted.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_resource_server
 */
export class ResourceServerApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Resource Server API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get the resource server configuration
   *
   * Endpoint: GET /clients/{clientId}/authz/resource-server
   *
   * @param clientId - UUID of the client
   * @returns Resource server configuration
   */
  public async getResourceServer(clientId: string): Promise<ResourceServerRepresentation> {
    try {
      return this.sdk.request<ResourceServerRepresentation>(
        `/clients/${clientId}/authz/resource-server`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get resource server: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a resource
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/resource
   *
   * @param clientUuid - UUID of the client
   * @param resource - Resource to create
   * @returns Created resource
   */
  public async createResource(
    clientUuid: string,
    resource: ResourceRepresentation
  ): Promise<ResourceRepresentationResponse> {
    try {
      return await this.sdk.request<ResourceRepresentationResponse>(
        `/clients/${clientUuid}/authz/resource-server/resource`,
        'POST',
        resource
      );
    } catch (error) {
      throw new Error(
        `Failed to create resource: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a resource by ID
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
   *
   * @param clientUuid - UUID of the client
   * @param resourceId - ID of the resource
   * @returns Resource
   */
  public async getResource(
    clientUuid: string,
    resourceId: string
  ): Promise<ResourceRepresentation> {
    try {
      return this.sdk.request<ResourceRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get resource: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update the resource server configuration
   *
   * Endpoint: PUT /clients/{clientUuid}/authz/resource-server
   *
   * @param clientUuid - UUID of the client
   * @param config - Resource server configuration
   */
  public async updateResourceServer(
    clientUuid: string,
    config: ResourceServerRepresentation
  ): Promise<void> {
    try {
      await this.sdk.request(`/clients/${clientUuid}/authz/resource-server`, 'PUT', config);
    } catch (error) {
      throw new Error(
        `Failed to update resource server: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get resources associated with the resource server
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource
   *
   * @param clientUuid - UUID of the client
   * @param options - Query parameters
   * @returns List of resources
   */
  public async getResources(
    clientUuid: string,
    options?: {
      deep?: boolean;
      exactName?: boolean;
      first?: number;
      max?: number;
      name?: string;
      owner?: string;
      scope?: string;
      type?: string;
      uri?: string;
      matchingUri?: string;
    }
  ): Promise<ResourceRepresentation[]> {
    try {
      return this.sdk.request<ResourceRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/resource`,
        'GET',
        undefined,
        options
      );
    } catch (error) {
      throw new Error(
        `Failed to get resources: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Import a resource server configuration
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/import
   *
   * @param clientUuid - UUID of the client
   * @param config - Resource server configuration to import
   */
  public async importResourceServer(
    clientUuid: string,
    config: ResourceServerRepresentation
  ): Promise<void> {
    try {
      await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/import`, 'POST', config);
    } catch (error) {
      throw new Error(
        `Failed to import resource server: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get resource server settings
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/settings
   *
   * @param clientUuid - UUID of the client
   * @returns Resource server settings
   */
  public async getSettings(clientUuid: string): Promise<ResourceServerRepresentation> {
    try {
      return this.sdk.request<ResourceServerRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/settings`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get resource server settings: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Search for a resource by name
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/search
   *
   * @param clientUuid - UUID of the client
   * @param name - Name to search for
   * @returns Resource if found
   */
  public async searchResource(clientUuid: string, name: string): Promise<ResourceRepresentation> {
    try {
      return this.sdk.request<ResourceRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/resource/search`,
        'GET',
        undefined,
        { name }
      );
    } catch (error) {
      throw new Error(
        `Failed to search resource: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a resource
   *
   * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
   *
   * @param clientUuid - UUID of the client
   * @param resourceId - ID of the resource
   * @param resource - Updated resource
   */
  public async updateResource(
    clientUuid: string,
    resourceId: string,
    resource: ResourceRepresentation
  ): Promise<void> {
    try {
      await this.sdk.request(
        `/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`,
        'PUT',
        resource
      );
    } catch (error) {
      throw new Error(
        `Failed to update resource: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a resource
   *
   * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
   *
   * @param clientUuid - UUID of the client
   * @param resourceId - ID of the resource
   */
  public async deleteResource(clientUuid: string, resourceId: string): Promise<void> {
    try {
      await this.sdk.request(
        `/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`,
        'DELETE'
      );
    } catch (error) {
      throw new Error(
        `Failed to delete resource: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
