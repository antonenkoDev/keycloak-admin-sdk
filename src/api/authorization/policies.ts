/**
 * Policies API for Keycloak Admin SDK
 * Focused on managing authorization policies
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
 * API for managing authorization policies in Keycloak
 *
 * Policies define the conditions that must be satisfied to grant access to an object.
 * Unlike permissions, you do not specify the object being protected but rather the conditions
 * that must be satisfied for access to a given object (resource or scope).
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_policy
 */
export class PoliciesApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Policies API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
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
    try {
      if (!policy.type) {
        throw new Error('Policy type is required');
      }

      // Extract the policy type from the policy object
      const policyType = policy.type;

      return this.sdk.request<PolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/policy/${policyType}`,
        'POST',
        policy
      );
    } catch (error) {
      throw new Error(
        `Failed to create policy: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a policy
   *
   * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/policy/{type}/{policyId}
   *
   * @param clientUuid - UUID of the client
   * @param policyId - PolicyId to update
   * @param policyData - PolicyData to update
   * @returns Created policy
   * @throws Error if policy creation fails
   */
  public async updatePolicy(
    clientUuid: string,
    policyId: string,
    policyData: PolicyRepresentation
  ): Promise<PolicyRepresentation> {
    try {
      if (!policyData.type) {
        throw new Error('Policy type is required');
      }

      // Extract the policy type from the policy object
      const policyType = policyData.type;

      return this.sdk.request<PolicyRepresentation>(
        `/clients/${clientUuid}/authz/resource-server/policy/${policyType}/${policyId}`,
        'PUT',
        policyData
      );
    } catch (error) {
      throw new Error(
        `Failed to update policy: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a policy
   *
   * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/policy/{policyId}
   *
   * @param clientUuid - UUID of the client
   * @param policyId - ID of the policy to delete
   */
  public async deletePolicy(clientUuid: string, policyId: string): Promise<void> {
    try {
      await this.sdk.request(
        `/clients/${clientUuid}/authz/resource-server/policy/${policyId}`,
        'DELETE'
      );
    } catch (error) {
      throw new Error(
        `Failed to delete policy: ${error instanceof Error ? error.message : String(error)}`
      );
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
}
