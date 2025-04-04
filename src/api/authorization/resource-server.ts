/**
 * Authorization Resource Server API for Keycloak Admin SDK
 * Provides methods for managing authorization resource servers in Keycloak
 */

import KeycloakAdminSDK from '../../index';
import {
  AbstractPolicyRepresentation,
  PolicyEvaluationRequest,
  PolicyEvaluationResponse,
  PolicyProviderRepresentation,
  PolicyRepresentation,
  ResourceRepresentation,
  ResourceServerRepresentation,
  ScopeRepresentation
} from '../../types/authorization';

/**
 * API for managing Authorization Resource Servers in Keycloak
 *
 * @see https://www.keycloak.org/docs-api/22.0.1/rest-api/index.html
 */
export class ResourceServerApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Creates a new instance of the Authorization Resource Server API
   *
   * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
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
  public async createResource(clientUuid: string, resource: ResourceRepresentation): Promise<void> {
    try {
      await this.sdk.request<ResourceRepresentation>(
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

  /**
   * Create a scope
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/scope
   *
   * @param clientUuid - UUID of the client
   * @param scope - Scope to create
   * @returns Created scope
   */
  public async createScope(clientUuid: string, scope: ScopeRepresentation): Promise<void> {
    try {
      await this.sdk.request<ScopeRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/scope`,
        'POST',
        scope
      );
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
    if (!clientUuid) {
      throw new Error('Client UUID is required');
    }

    if (!name) {
      throw new Error('Name parameter is required for scope search');
    }

    try {
      // Construct query parameters with name and optional exactName flag
      const queryParams: Record<string, string | boolean> = { name };

      // Add exactName parameter if provided
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
        `Failed to search scope with name '${name}': ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get scopes
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
   * Get policies
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/policy
   *
   * @param clientUuid - UUID of the client
   * @param options - Query parameters
   * @returns List of policies
   */
  public async getPolicies(
    clientUuid: string,
    options?: {
      first?: number;
      max?: number;
      name?: string;
      permission?: boolean;
      resource?: string;
      scope?: string;
      type?: string;
      owner?: string;
      fields?: string;
      policyId?: string;
    }
  ): Promise<AbstractPolicyRepresentation[]> {
    try {
      return this.sdk.request<AbstractPolicyRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/policy`,
        'GET',
        undefined,
        options
      );
    } catch (error) {
      throw new Error(
        `Failed to get policies: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a policy
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/policy/{type}
   *
   * @param clientUuid - UUID of the client
   * @param policy - Policy to create
   * @returns Created policy
   * @throws Error if policy creation fails
   */
  public async createPolicy(
    clientUuid: string,
    policy: PolicyRepresentation
  ): Promise<PolicyRepresentation> {
    if (!clientUuid) {
      throw new Error('Client UUID is required');
    }

    if (!policy) {
      throw new Error('Policy object is required');
    }

    if (!policy.type) {
      throw new Error('Policy type is required');
    }

    try {
      // Create a deep copy of the policy to avoid modifying the original
      const policyToSend = structuredClone(policy);

      // Extract the type for the URL path but remove it from the payload
      // Some Keycloak versions don't expect type in the payload when it's in the URL
      const policyType = policyToSend.type;

      // Ensure config values are properly formatted
      // Keycloak expects string values for config properties
      if (policyToSend.config) {
        Object.keys(policyToSend.config).forEach(key => {
          const value = policyToSend.config![key];
          if (typeof value !== 'string') {
            policyToSend.config![key] = JSON.stringify(value);
          }
        });
      }

      // Keycloak expects the policy type in the URL path
      const response = await this.sdk.request<PolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/policy/${policyType}`,
        'POST',
        policyToSend
      );

      // If response is empty but no error was thrown, return the original policy with generated ID
      if (!response || !response.id) {
        // Try to get the created policy by name

        const policies = await this.getPolicies(clientUuid);
        const createdPolicy = policies.find(p => p.name === policy.name);
        if (createdPolicy && createdPolicy.id) {
          return createdPolicy;
        } else {
          throw new Error('Error creating Policy');
        }
      }

      return response;
    } catch (error) {
      // Provide detailed error information for debugging
      const errorDetails = error instanceof Error ? error.message : String(error);
      console.error(`Policy creation error for type '${policy.type}':`, errorDetails);

      throw new Error(`Failed to create policy of type '${policy.type}': ${errorDetails}`);
    }
  }

  /**
   * Get policy providers
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/policy/providers
   *
   * @param clientUuid - UUID of the client
   * @returns List of policy providers
   */
  public async getPolicyProviders(clientUuid: string): Promise<PolicyProviderRepresentation[]> {
    try {
      return this.sdk.request<PolicyProviderRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/policy/providers`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get policy providers: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Search for a policy by name
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/policy/search
   *
   * @param clientUuid - UUID of the client
   * @param name - Name to search for
   * @param fields - Fields to include
   * @returns Policy if found
   */
  public async searchPolicy(
    clientUuid: string,
    name: string,
    fields?: string
  ): Promise<AbstractPolicyRepresentation> {
    try {
      return this.sdk.request<AbstractPolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/policy/search`,
        'GET',
        undefined,
        { name, fields }
      );
    } catch (error) {
      throw new Error(
        `Failed to search policy: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Evaluate policies
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/policy/evaluate
   *
   * @param clientUuid - UUID of the client
   * @param request - Evaluation request
   * @returns Evaluation response
   */
  public async evaluatePolicy(
    clientUuid: string,
    request: PolicyEvaluationRequest
  ): Promise<PolicyEvaluationResponse> {
    try {
      return this.sdk.request<PolicyEvaluationResponse>(
        `/clients/${clientUuid}/authz/resource-server/policy/evaluate`,
        'POST',
        request
      );
    } catch (error) {
      throw new Error(
        `Failed to evaluate policy: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get permissions
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/permission
   *
   * @param clientUuid - UUID of the client
   * @param options - Query parameters
   * @returns List of permissions
   */
  public async getPermissions(
    clientUuid: string,
    options?: {
      first?: number;
      max?: number;
      name?: string;
      resource?: string;
      scope?: string;
      type?: string;
      owner?: string;
      fields?: string;
      permission?: boolean;
      policyId?: string;
    }
  ): Promise<AbstractPolicyRepresentation[]> {
    try {
      return this.sdk.request<AbstractPolicyRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/permission`,
        'GET',
        undefined,
        options
      );
    } catch (error) {
      throw new Error(
        `Failed to get permissions: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a permission
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/permission
   *
   * @param clientUuid - UUID of the client
   * @param permission - Permission to create
   * @returns Created permission
   */
  public async createPermission(
    clientUuid: string,
    permission: PolicyRepresentation
  ): Promise<PolicyRepresentation> {
    try {
      return this.sdk.request<PolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/permission`,
        'POST',
        permission
      );
    } catch (error) {
      throw new Error(
        `Failed to create permission: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get permission providers
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/permission/providers
   *
   * @param clientUuid - UUID of the client
   * @returns List of permission providers
   */
  public async getPermissionProviders(clientUuid: string): Promise<PolicyProviderRepresentation[]> {
    try {
      return this.sdk.request<PolicyProviderRepresentation[]>(
        `/clients/${clientUuid}/authz/resource-server/permission/providers`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get permission providers: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Search for a permission by name
   *
   * Endpoint: GET /clients/{clientUuid}/authz/resource-server/permission/search
   *
   * @param clientUuid - UUID of the client
   * @param name - Name to search for
   * @param fields - Fields to include
   * @returns Permission if found
   */
  public async searchPermission(
    clientUuid: string,
    name: string,
    fields?: string
  ): Promise<AbstractPolicyRepresentation> {
    try {
      return this.sdk.request<AbstractPolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/permission/search`,
        'GET',
        undefined,
        { name, fields }
      );
    } catch (error) {
      throw new Error(
        `Failed to search permission: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Evaluate permissions
   *
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/permission/evaluate
   *
   * @param clientUuid - UUID of the client
   * @param request - Evaluation request
   * @returns Evaluation response
   */
  public async evaluatePermission(
    clientUuid: string,
    request: PolicyEvaluationRequest
  ): Promise<PolicyEvaluationResponse> {
    try {
      return this.sdk.request<PolicyEvaluationResponse>(
        `/clients/${clientUuid}/authz/resource-server/permission/evaluate`,
        'POST',
        request
      );
    } catch (error) {
      throw new Error(
        `Failed to evaluate permission: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
