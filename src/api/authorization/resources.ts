/**
 * Resources API for Keycloak Admin SDK
 * Focused on managing protected resources
 */

import KeycloakClient from '../../index';
import {
  PolicyRepresentation,
  ResourceRepresentation,
  ResourceRepresentationResponse,
  ScopeRepresentation
} from '../../types/authorization';

/**
 * API for managing protected resources in Keycloak Authorization Services
 *
 * A resource is part of the assets of an application and the organization.
 * It can be a set of one or more endpoints, a classic web resource such as an HTML page, etc.
 * In authorization policy terminology, a resource is the object being protected.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_resource
 */
export class ResourcesApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Resources API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
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
      return this.sdk.request<ResourceRepresentationResponse>(
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

  /**
   * Get resource permissions
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}/permissions
   *
   * @param clientUuid - UUID of the client
   * @param resourceId - ID of the resource
   * @returns List of permissions
   */
  public async getResourcePermissions(
    clientUuid: string,
    resourceId: string
  ): Promise<PolicyRepresentation[]> {
    try {
      return this.sdk.request<PolicyRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/resource/${resourceId}/permissions`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get resource permissions: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get resource scopes
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}/scopes
   *
   * @param clientUuid - UUID of the client
   * @param resourceId - ID of the resource
   * @returns List of scopes
   */
  public async getResourceScopes(
    clientUuid: string,
    resourceId: string
  ): Promise<ScopeRepresentation[]> {
    try {
      return this.sdk.request<ScopeRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/resource/${resourceId}/scopes`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get resource scopes: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get resource attributes
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}/attributes
   *
   * @param clientUuid - UUID of the client
   * @param resourceId - ID of the resource
   * @returns Resource attributes
   */
  public async getResourceAttributes(
    clientUuid: string,
    resourceId: string
  ): Promise<Record<string, string[]>> {
    try {
      return this.sdk.request<Record<string, string[]>>(
        `/clients/${clientUuid}/authz/resource-server/resource/${resourceId}/attributes`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get resource attributes: ${error instanceof Error ? error.message : String(error)}`
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
}
