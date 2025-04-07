/**
 * Clients API for Keycloak Admin SDK
 * Provides methods for managing clients in Keycloak
 */

import KeycloakAdminSDK from '../../index';
import {
  ClientRepresentation,
  ClientScopeRepresentation,
  CredentialRepresentation,
  UserSessionRepresentation
} from '../../types/clients';
import { RoleRepresentation } from '../../types/roles';
import { ClientCertificatesApi } from './certificates/client-certificates';
import { ClientInitialAccessApi } from './client-registration/client-initial-access';
import { ClientRegistrationPolicyApi } from './client-registration/client-registration-policy';
import { ClientScopesApi } from './client-scopes/client-scopes';
import { ClientRoleMappingsApi } from './client-role-mappings/client-role-mappings';

/**
 * API for managing Keycloak clients
 */
export class ClientsApi {
  private sdk: KeycloakAdminSDK;
  /**
   * Client certificates API for managing client certificates
   */
  public certificates: ClientCertificatesApi;

  /**
   * Client initial access API for managing client registration tokens
   */
  public initialAccess: ClientInitialAccessApi;

  /**
   * Client registration policy API for managing registration policies
   */
  public registrationPolicy: ClientRegistrationPolicyApi;

  /**
   * API for managing Keycloak client scopes
   */
  public clientScopes: ClientScopesApi;

  /**
   * Client Role Mappings API
   */
  public clientRoleMappings: ClientRoleMappingsApi;

  /**
   * Creates a new instance of the Clients API
   *
   * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;

    // Initialize all sub-APIs
    this.certificates = new ClientCertificatesApi(sdk);
    this.initialAccess = new ClientInitialAccessApi(sdk);
    this.registrationPolicy = new ClientRegistrationPolicyApi(sdk);
    this.clientScopes = new ClientScopesApi(sdk);
    this.clientRoleMappings = new ClientRoleMappingsApi(sdk);
  }

  /**
   * Get all clients in a realm
   *
   * Endpoint: GET /{realm}/clients
   *
   * @param {string} [clientId] - Filter by clientId
   * @param {number} [first] - First result index
   * @param {number} [max] - Maximum number of results
   * @returns {Promise<ClientRepresentation[]>} List of clients
   * @throws {Error} If the request fails
   */
  async findAll(clientId?: string, first?: number, max?: number): Promise<ClientRepresentation[]> {
    try {
      let endpoint = '/clients';
      const queryParams: string[] = [];

      if (clientId) {
        queryParams.push(`clientId=${encodeURIComponent(clientId)}`);
      }

      if (first !== undefined) {
        queryParams.push(`first=${first}`);
      }

      if (max !== undefined) {
        queryParams.push(`max=${max}`);
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      return this.sdk.request<ClientRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get clients: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new client
   *
   * Endpoint: POST /{realm}/clients
   *
   * @param {ClientRepresentation} client - The client to create
   * @returns {Promise<string>} The ID of the created client
   * @throws {Error} If the request fails or client data is invalid
   */
  async create(client: ClientRepresentation): Promise<string> {
    if (!client) {
      throw new Error('Client data is required');
    }

    if (!client.clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return await this.sdk.request<string>('/clients', 'POST', client);
    } catch (error) {
      throw new Error(
        `Failed to create client: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a client by ID
   *
   * Endpoint: GET /{realm}/clients/{id}
   *
   * @param {string} id - The client ID
   * @returns {Promise<ClientRepresentation>} The client representation
   * @throws {Error} If the request fails or ID is invalid
   */
  async findById(id: string): Promise<ClientRepresentation> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<ClientRepresentation>(`/clients/${id}`, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get client: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a client
   *
   * Endpoint: PUT /{realm}/clients/{id}
   *
   * @param {string} id - The client ID
   * @param {ClientRepresentation} client - The updated client data
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async update(id: string, client: ClientRepresentation): Promise<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    if (!client) {
      throw new Error('Client data is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${id}`, 'PUT', client);
    } catch (error) {
      throw new Error(
        `Failed to update client: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a client
   *
   * Endpoint: DELETE /{realm}/clients/{id}
   *
   * @param {string} id - The client ID
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or ID is invalid
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${id}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete client: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client secret
   *
   * Endpoint: GET /{realm}/clients/{id}/client-secret
   *
   * @param {string} id - The client ID
   * @returns {Promise<CredentialRepresentation>} The client secret
   * @throws {Error} If the request fails or ID is invalid
   */
  async getClientSecret(id: string): Promise<CredentialRepresentation> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<CredentialRepresentation>(`/clients/${id}/client-secret`, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get client secret: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate a new client secret
   *
   * Endpoint: POST /{realm}/clients/{id}/client-secret
   *
   * @param {string} id - The client ID
   * @returns {Promise<CredentialRepresentation>} The new client secret
   * @throws {Error} If the request fails or ID is invalid
   */
  async generateClientSecret(id: string): Promise<CredentialRepresentation> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<CredentialRepresentation>(`/clients/${id}/client-secret`, 'POST');
    } catch (error) {
      throw new Error(
        `Failed to generate client secret: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get default client scopes
   *
   * Endpoint: GET /{realm}/clients/{id}/default-client-scopes
   *
   * @param {string} id - The client ID
   * @returns {Promise<ClientScopeRepresentation[]>} List of default client scopes
   * @throws {Error} If the request fails or ID is invalid
   */
  async getDefaultClientScopes(id: string): Promise<ClientScopeRepresentation[]> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<ClientScopeRepresentation[]>(
        `/clients/${id}/default-client-scopes`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get default client scopes: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add default client scope
   *
   * Endpoint: PUT /{realm}/clients/{id}/default-client-scopes/{scopeId}
   *
   * @param {string} id - The client ID
   * @param {string} scopeId - The scope ID
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async addDefaultClientScope(id: string, scopeId: string): Promise<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    if (!scopeId) {
      throw new Error('Scope ID is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${id}/default-client-scopes/${scopeId}`, 'PUT');
    } catch (error) {
      throw new Error(
        `Failed to add default client scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Remove default client scope
   *
   * Endpoint: DELETE /{realm}/clients/{id}/default-client-scopes/{scopeId}
   *
   * @param {string} id - The client ID
   * @param {string} scopeId - The scope ID
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async removeDefaultClientScope(id: string, scopeId: string): Promise<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    if (!scopeId) {
      throw new Error('Scope ID is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${id}/default-client-scopes/${scopeId}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to remove default client scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get optional client scopes
   *
   * Endpoint: GET /{realm}/clients/{id}/optional-client-scopes
   *
   * @param {string} id - The client ID
   * @returns {Promise<ClientScopeRepresentation[]>} List of optional client scopes
   * @throws {Error} If the request fails or ID is invalid
   */
  async getOptionalClientScopes(id: string): Promise<ClientScopeRepresentation[]> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<ClientScopeRepresentation[]>(
        `/clients/${id}/optional-client-scopes`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get optional client scopes: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add optional client scope
   *
   * Endpoint: PUT /{realm}/clients/{id}/optional-client-scopes/{scopeId}
   *
   * @param {string} id - The client ID
   * @param {string} scopeId - The scope ID
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async addOptionalClientScope(id: string, scopeId: string): Promise<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    if (!scopeId) {
      throw new Error('Scope ID is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${id}/optional-client-scopes/${scopeId}`, 'PUT');
    } catch (error) {
      throw new Error(
        `Failed to add optional client scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Remove optional client scope
   *
   * Endpoint: DELETE /{realm}/clients/{id}/optional-client-scopes/{scopeId}
   *
   * @param {string} id - The client ID
   * @param {string} scopeId - The scope ID
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async removeOptionalClientScope(id: string, scopeId: string): Promise<void> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    if (!scopeId) {
      throw new Error('Scope ID is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${id}/optional-client-scopes/${scopeId}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to remove optional client scope: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get user sessions for client
   *
   * Endpoint: GET /{realm}/clients/{id}/user-sessions
   *
   * @param {string} id - The client ID
   * @param {number} [first] - First result index
   * @param {number} [max] - Maximum number of results
   * @returns {Promise<UserSessionRepresentation[]>} List of user sessions
   * @throws {Error} If the request fails or ID is invalid
   */
  async getUserSessions(
    id: string,
    first?: number,
    max?: number
  ): Promise<UserSessionRepresentation[]> {
    if (!id) {
      throw new Error('Client ID is required');
    }

    try {
      let endpoint = `/clients/${id}/user-sessions`;
      const queryParams: string[] = [];

      if (first !== undefined) {
        queryParams.push(`first=${first}`);
      }

      if (max !== undefined) {
        queryParams.push(`max=${max}`);
      }

      if (queryParams.length > 0) {
        endpoint += `?${queryParams.join('&')}`;
      }

      return this.sdk.request<UserSessionRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get user sessions: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Test OIDC client registration endpoint
   *
   * Endpoint: POST /{realm}/clients/registration-access-token
   *
   * @param {string} clientId - The client ID
   * @returns {Promise<Record<string, any>>} The registration access token
   * @throws {Error} If the request fails or clientId is invalid
   */
  async getRegistrationAccessToken(clientId: string): Promise<Record<string, any>> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<Record<string, any>>('/clients/registration-access-token', 'POST', {
        clientId
      });
    } catch (error) {
      throw new Error(
        `Failed to get registration access token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get all roles for a client
   *
   * Endpoint: GET /{realm}/clients/{id}/roles
   *
   * @param {string} clientId - Client ID
   * @returns {Promise<RoleRepresentation[]>} List of client roles
   * @throws {Error} If the request fails
   */
  async listRoles(clientId: string): Promise<RoleRepresentation[]> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(`/clients/${clientId}/roles`, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to list roles for client: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a role by name for a client
   *
   * Endpoint: GET /{realm}/clients/{id}/roles/{role-name}
   *
   * @param {string} clientId - Client ID
   * @param {string} roleName - Role name
   * @returns {Promise<RoleRepresentation>} Role representation
   * @throws {Error} If the request fails
   */
  async getRole(clientId: string, roleName: string): Promise<RoleRepresentation> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    if (!roleName) {
      throw new Error('Role name is required');
    }

    try {
      return this.sdk.request<RoleRepresentation>(`/clients/${clientId}/roles/${roleName}`, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get role: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new role for a client
   *
   * Endpoint: POST /{realm}/clients/{id}/roles
   *
   * @param {string} clientId - Client ID
   * @param {RoleRepresentation} role - Role representation
   * @returns {Promise<string>} ID of the created role
   * @throws {Error} If the request fails
   */
  async createRole(clientId: string, role: RoleRepresentation): Promise<string> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    if (!role) {
      throw new Error('Role representation is required');
    }
    if (!role.name) {
      throw new Error('Role name is required');
    }

    try {
      // Create the role
      await this.sdk.request<void>(`/clients/${clientId}/roles`, 'POST', role);

      // Get the created role to return its ID
      const createdRole = await this.getRole(clientId, role.name);
      return createdRole.id || '';
    } catch (error) {
      throw new Error(
        `Failed to create role: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a role for a client
   *
   * Endpoint: PUT /{realm}/clients/{id}/roles/{role-name}
   *
   * @param {string} clientId - Client ID
   * @param {string} roleName - Role name
   * @param {RoleRepresentation} role - Updated role representation
   * @returns {Promise<void>}
   * @throws {Error} If the request fails
   */
  async updateRole(clientId: string, roleName: string, role: RoleRepresentation): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    if (!roleName) {
      throw new Error('Role name is required');
    }
    if (!role) {
      throw new Error('Role representation is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${clientId}/roles/${roleName}`, 'PUT', role);
    } catch (error) {
      throw new Error(
        `Failed to update role: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a role from a client
   *
   * Endpoint: DELETE /{realm}/clients/{id}/roles/{role-name}
   *
   * @param {string} clientId - Client ID
   * @param {string} roleName - Role name
   * @returns {Promise<void>}
   * @throws {Error} If the request fails
   */
  async deleteRole(clientId: string, roleName: string): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    if (!roleName) {
      throw new Error('Role name is required');
    }

    try {
      await this.sdk.request<void>(`/clients/${clientId}/roles/${roleName}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete role: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
