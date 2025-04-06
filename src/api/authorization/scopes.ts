/**
 * Scopes API for Keycloak Admin SDK
 * Focused on managing authorization scopes
 */

import KeycloakAdminSDK from '../../index';
import {
  PolicyRepresentation,
  ResourceRepresentation,
  ScopeRepresentation
} from '../../types/authorization';

/**
 * API for managing authorization scopes in Keycloak
 *
 * A scope is a bounded extent of access that is possible to perform on a resource.
 * In authorization policy terminology, a scope is one of the potentially many verbs
 * that can logically apply to a resource.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_scope
 */
export class ScopesApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Creates a new instance of the Scopes API
   *
   * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get scopes
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope
   *
   * @param clientUuid - UUID of the client
   * @param options - Query parameters
   * @returns List of scopes
   */
  public async getScopes(
    clientUuid: string,
    options?: {
      deep?: boolean;
      exactName?: boolean;
      first?: number;
      max?: number;
      name?: string;
    }
  ): Promise<ScopeRepresentation[]> {
    try {
      return this.sdk.request<ScopeRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/scope`,
        'GET',
        undefined,
        options
      );
    } catch (error) {
      throw new Error(
        `Failed to get scopes: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a scope
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/scope
   *
   * @param clientUuid - UUID of the client
   * @param scope - Scope to create
   */
  public async createScope(clientUuid: string, scope: ScopeRepresentation): Promise<void> {
    try {
      await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope`, 'POST', scope);
    } catch (error) {
      throw new Error(
        `Failed to create scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a scope by ID
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/{scopeId}
   *
   * @param clientUuid - UUID of the client
   * @param scopeId - ID of the scope
   * @returns Scope
   */
  public async getScope(clientUuid: string, scopeId: string): Promise<ScopeRepresentation> {
    try {
      return this.sdk.request<ScopeRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/scope/${scopeId}`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a scope
   *
   * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/scope/{scopeId}
   *
   * @param clientUuid - UUID of the client
   * @param scopeId - ID of the scope
   * @param scope - Updated scope
   */
  public async updateScope(
    clientUuid: string,
    scopeId: string,
    scope: ScopeRepresentation
  ): Promise<void> {
    try {
      await this.sdk.request(
        `/clients/${clientUuid}/authz/resource-server/scope/${scopeId}`,
        'PUT',
        scope
      );
    } catch (error) {
      throw new Error(
        `Failed to update scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a scope
   *
   * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/scope/{scopeId}
   *
   * @param clientUuid - UUID of the client
   * @param scopeId - ID of the scope
   */
  public async deleteScope(clientUuid: string, scopeId: string): Promise<void> {
    try {
      await this.sdk.request(
        `/clients/${clientUuid}/authz/resource-server/scope/${scopeId}`,
        'DELETE'
      );
    } catch (error) {
      throw new Error(
        `Failed to delete scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get scope permissions
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/{scopeId}/permissions
   *
   * @param clientUuid - UUID of the client
   * @param scopeId - ID of the scope
   * @returns List of permissions
   */
  public async getScopePermissions(
    clientUuid: string,
    scopeId: string
  ): Promise<PolicyRepresentation[]> {
    try {
      return this.sdk.request<PolicyRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/scope/${scopeId}/permissions`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get scope permissions: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get scope resources
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/{scopeId}/resources
   *
   * @param clientUuid - UUID of the client
   * @param scopeId - ID of the scope
   * @returns List of resources
   */
  public async getScopeResources(
    clientUuid: string,
    scopeId: string
  ): Promise<ResourceRepresentation[]> {
    try {
      return this.sdk.request<ResourceRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/scope/${scopeId}/resources`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get scope resources: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Search for a scope by name
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/search
   *
   * @param clientUuid - UUID of the client
   * @param name - Name to search for
   * @param exactName - Optional flag to search for exact name match
   * @returns List of scopes matching the search criteria
   * @throws Error if the search fails
   */
  public async searchScope(
    clientUuid: string,
    name: string,
    exactName?: boolean
  ): Promise<ScopeRepresentation> {
    try {
      const queryParams: Record<string, string | boolean | undefined> = { name };

      if (exactName !== undefined) {
        queryParams.exactName = exactName;
      }

      return this.sdk.request<ScopeRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/scope/search`,
        'GET',
        undefined,
        queryParams
      );
    } catch (error) {
      throw new Error(
        `Failed to search scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
