/**
 * Keycloak Admin SDK
 * A TypeScript SDK for interacting with the Keycloak Admin REST API
 */

import { UsersApi } from './api/users/users';
import { GroupsApi } from './api/groups';
import { RealmsApi } from './api/realms/realms';
import { ClientsApi } from './api/clients';
import { ClientScopesApi } from './api/client-scopes/client-scopes';
import { ClientRoleMappingsApi } from './api/client-role-mappings/client-role-mappings';
import { OrganizationsApi } from './api/organizations/organizations';
import { IdentityProvidersApi } from './api/identity-providers/identity-providers';
import { RolesApi } from './api/roles/roles';
import { RoleMappingsApiFactory } from './api/role-mappings';
import { ScopeMappingsApiFactory } from './api/scope-mappings';
import { KeysApi } from './api/keys';
import { ResourceServerApi } from './api/authorization';
import { KeycloakConfig } from './types/auth';
import { getToken } from './utils/auth';
import { HttpMethod, makeRequest } from './utils/request';

/**
 * Main SDK class for interacting with the Keycloak Admin REST API
 */
class KeycloakAdminSDK {
  private baseUrl: string;
  private adminUrl: string;
  private config: KeycloakConfig;
  private token: string | null = null;

  // API endpoints
  public users: UsersApi;
  public groups: GroupsApi;
  public realms: RealmsApi;
  public clients: ClientsApi;
  public clientScopes: ClientScopesApi;
  public clientRoleMappings: ClientRoleMappingsApi;
  public organizations: OrganizationsApi;
  public identityProviders: IdentityProvidersApi;
  public roles: RolesApi;
  public roleMappings: RoleMappingsApiFactory;
  public scopeMappings: ScopeMappingsApiFactory;
  public keys: KeysApi;
  public resourceServer: ResourceServerApi;

  /**
   * Creates a new instance of the Keycloak Admin SDK
   *
   * @param {KeycloakConfig} config - Configuration for connecting to Keycloak
   */
  constructor(config: KeycloakConfig) {
    this.config = config;
    this.adminUrl = `${config.baseUrl}/admin`;
    this.baseUrl = `${config.baseUrl}/admin/realms/${config.realm}`;

    // Initialize API endpoints
    this.users = new UsersApi(this);
    this.groups = new GroupsApi(this);
    this.realms = new RealmsApi(this);
    this.clients = new ClientsApi(this);
    this.clientScopes = new ClientScopesApi(this);
    this.clientRoleMappings = new ClientRoleMappingsApi(this);
    this.organizations = new OrganizationsApi(this);
    this.identityProviders = new IdentityProvidersApi(this);
    this.roles = new RolesApi(this);
    this.roleMappings = new RoleMappingsApiFactory(this);
    this.scopeMappings = new ScopeMappingsApiFactory(this);
    this.keys = new KeysApi(this);
    this.resourceServer = new ResourceServerApi(this);
  }

  /**
   * Gets a valid authentication token
   *
   * @returns {Promise<string>} A valid authentication token
   */
  async getValidToken(): Promise<string> {
    try {
      // Return cached token if available
      if (this.token) {
        return this.token;
      }

      // Get a new token

      this.token = await getToken(this.config);
      return this.token;
    } catch (error) {
      console.error('Failed to get valid token:', error);
      throw new Error(
        `Authentication failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Makes an authenticated request to the Keycloak Admin REST API for the configured realm
   *
   * @param {string} endpoint - The API endpoint to call
   * @param {HttpMethod} method - The HTTP method to use
   * @param {any} [body] - Optional request body
   * @param {Record<string, any>} [queryParams] - Optional query parameters
   * @returns {Promise<T>} The response data
   */
  async request<T>(
    endpoint: string,
    method: HttpMethod,
    body?: any,
    options?: { headers?: Record<string, string> } | Record<string, any>
  ): Promise<T> {
    // Extract query parameters if they exist in options
    const queryParams = options && !options.headers ? options : undefined;
    try {
      const token = await this.getValidToken();

      // Add query parameters if provided
      let fullUrl = `${this.baseUrl}${endpoint}`;
      if (queryParams && Object.keys(queryParams).length > 0) {
        const queryString = Object.entries(queryParams)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');

        if (queryString) {
          fullUrl += `?${queryString}`;
        }
      }
      // Pass options to makeRequest if they contain headers
      const requestOptions = options && options.headers ? options : undefined;
      return makeRequest<T>(fullUrl, method, token, body, requestOptions);
    } catch (error) {
      console.error(`Request failed for endpoint ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Makes an authenticated request to the Keycloak Admin REST API without including a realm in the URL
   * Used for global admin endpoints like /admin/realms
   *
   * @param {string} endpoint - The API endpoint to call
   * @param {HttpMethod} method - The HTTP method to use
   * @param {any} [body] - Optional request body
   * @returns {Promise<T>} The response data
   */
  async requestWithoutRealm<T>(
    endpoint: string,
    method: HttpMethod,
    body?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    try {
      const token = await this.getValidToken();
      const url = `${this.adminUrl}/realms${endpoint}`;

      return makeRequest<T>(url, method, token, body);
    } catch (error) {
      console.error(`Request without realm failed for endpoint ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Makes an authenticated request to the Keycloak Admin REST API for a specific realm
   * Used when accessing a realm other than the one configured in the SDK
   *
   * @param {string} realmName - The name of the realm to access
   * @param {string} endpoint - The API endpoint to call
   * @param {HttpMethod} method - The HTTP method to use
   * @param {any} [body] - Optional request body
   * @returns {Promise<T>} The response data
   */
  async requestForRealm<T>(
    realmName: string,
    endpoint: string,
    method: HttpMethod,
    body?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    try {
      const token = await this.getValidToken();
      const url = `${this.adminUrl}/realms/${realmName}${endpoint}`;
      return makeRequest<T>(url, method, token, body);
    } catch (error) {
      console.error(`Request for realm ${realmName} failed for endpoint ${endpoint}:`, error);
      throw error;
    }
  }
}

export default KeycloakAdminSDK;
