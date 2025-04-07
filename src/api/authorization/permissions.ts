/**
 * Permissions API for Keycloak Admin SDK
 * Focused on managing authorization permissions
 */

import KeycloakClient from '../../index';
import {
  AbstractPolicyRepresentation,
  PolicyEvaluationRequest,
  PolicyEvaluationResponse,
  PolicyProviderRepresentation,
  PolicyRepresentation
} from '../../types/authorization';

/**
 * API for managing permissions in Keycloak Authorization Services
 *
 * A permission associates the object being protected with the policies that must be evaluated
 * to determine whether access is granted. Permissions can be resource-based or scope-based.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_permission
 */
export class PermissionsApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Permissions API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
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
   * Endpoint: POST /clients/{clientUuid}/authz/resource-server/permission/{type}
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
      if (!permission.type) {
        throw new Error('Permission type is required');
      }

      // Extract the permission type from the permission object
      const permissionType = permission.type;

      return this.sdk.request<PolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/permission/${permissionType}`,
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
   * Update a permission
   *
   * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/permission/{type}/{permissionId}
   *
   * @param clientUuid - UUID of the client
   * @param permissionId - ID of the permission
   * @param permission - Updated permission data
   * @returns Updated permission
   */
  public async updatePermission(
    clientUuid: string,
    permissionId: string,
    permission: PolicyRepresentation
  ): Promise<PolicyRepresentation> {
    try {
      if (!permission.type) {
        throw new Error('Permission type is required');
      }

      // Extract the permission type from the permission object
      const permissionType = permission.type;

      return this.sdk.request<PolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/permission/${permissionType}/${permissionId}`,
        'PUT',
        permission
      );
    } catch (error) {
      throw new Error(
        `Failed to update permission: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a permission
   *
   * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/permission/{permissionId}
   *
   * @param clientUuid - UUID of the client
   * @param permissionId - ID of the permission to delete
   */
  public async deletePermission(clientUuid: string, permissionId: string): Promise<void> {
    try {
      await this.sdk.request(
        `/clients/${clientUuid}/authz/resource-server/permission/${permissionId}`,
        'DELETE'
      );
    } catch (error) {
      throw new Error(
        `Failed to delete permission: ${error instanceof Error ? error.message : String(error)}`
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
