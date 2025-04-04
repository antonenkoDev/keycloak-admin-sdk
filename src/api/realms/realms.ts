import KeycloakAdminSDK from '../../index';
import {
  AdminEventRepresentation,
  ClientPoliciesRepresentation,
  ClientProfilesRepresentation,
  ClientTypesRepresentation,
  EventRepresentation,
  GetAdminEventsParams,
  GetRealmEventsParams,
  GetRealmsParams,
  GlobalRequestResult,
  ManagementPermissionReference,
  RealmEventsConfigRepresentation,
  RealmRepresentation
} from '../../types/realms';

/**
 * API for managing Keycloak realms
 */
export class RealmsApi {
  constructor(private sdk: KeycloakAdminSDK) {}

  /**
   * Get accessible realms
   * Returns a list of accessible realms. The list is filtered based on what realms the caller is allowed to view.
   *
   * Endpoint: GET /admin/realms
   *
   * @param {GetRealmsParams} [params] - Parameters to filter the realms
   * @returns {Promise<RealmRepresentation[]>} A list of accessible realms
   * @throws {Error} If the request fails
   */
  async list(params?: GetRealmsParams): Promise<RealmRepresentation[]> {
    try {
      const query = new URLSearchParams(params as any).toString();
      // This endpoint doesn't include the realm in the path
      const endpoint = `${query ? `?${query}` : ''}`;
      return this.sdk.requestWithoutRealm<RealmRepresentation[]>(endpoint, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to retrieve realms list: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new realm
   * Imports a realm from a full representation of that realm.
   *
   * Endpoint: POST /admin/realms
   *
   * @param {RealmRepresentation} realm - The realm representation to create
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or realm data is invalid
   */
  async create(realm: RealmRepresentation): Promise<void> {
    if (!realm) {
      throw new Error('Realm data is required');
    }

    if (!realm.realm) {
      throw new Error('Realm name is required');
    }

    try {
      // This endpoint doesn't include the realm in the path
      const endpoint = '';
      await this.sdk.requestWithoutRealm<void>(endpoint, 'POST', realm);
    } catch (error) {
      throw new Error(
        `Failed to create realm: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get a specific realm
   * Get the top-level representation of the realm. It will not include nested information like User and Client representations.
   *
   * Endpoint: GET /admin/realms/{realm}
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<RealmRepresentation>} The realm representation
   * @throws {Error} If the request fails or realmName is invalid
   */
  async get(realmName: string): Promise<RealmRepresentation> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      // For this endpoint, we need to use the realm name in the path
      // but not include it in the base URL since we're accessing a specific realm
      return this.sdk.requestForRealm<RealmRepresentation>(realmName, '', 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update a realm
   * Update the top-level information of the realm. Any user, roles or client information in the representation will be ignored.
   *
   * Endpoint: PUT /admin/realms/{realm}
   *
   * @param {string} realmName - The name of the realm
   * @param {RealmRepresentation} realm - The realm representation with updated data
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async update(realmName: string, realm: RealmRepresentation): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!realm) {
      throw new Error('Realm data is required');
    }

    try {
      // For this endpoint, we need to use the realm name in the path
      // but not include it in the base URL since we're updating a specific realm
      await this.sdk.requestForRealm<void>(realmName, '', 'PUT', realm);
    } catch (error) {
      throw new Error(
        `Failed to update realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a realm
   *
   * Endpoint: DELETE /admin/realms/{realm}
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or realmName is invalid
   */
  async delete(realmName: string): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      // For this endpoint, we need to use the realm name in the path
      // but not include it in the base URL since we're deleting a specific realm
      await this.sdk.requestForRealm<void>(realmName, '', 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get the events provider configuration
   * Returns JSON object with events provider configuration
   *
   * Endpoint: GET /admin/realms/{realm}/events/config
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<RealmEventsConfigRepresentation>} The events configuration
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getEventsConfig(realmName: string): Promise<RealmEventsConfigRepresentation> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<RealmEventsConfigRepresentation>(
        realmName,
        '/events/config',
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get events config for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update the events provider
   * Change the events provider and/or its configuration
   *
   * Endpoint: PUT /admin/realms/{realm}/events/config
   *
   * @param {string} realmName - The name of the realm
   * @param {RealmEventsConfigRepresentation} config - The events configuration
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async updateEventsConfig(
    realmName: string,
    config: RealmEventsConfigRepresentation
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!config) {
      throw new Error('Events configuration is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, '/events/config', 'PUT', config);
    } catch (error) {
      throw new Error(
        `Failed to update events config for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get events
   * Returns all events, or filters them based on URL query parameters
   *
   * Endpoint: GET /admin/realms/{realm}/events
   *
   * @param {string} realmName - The name of the realm
   * @param {GetRealmEventsParams} [params] - Parameters to filter the events
   * @returns {Promise<EventRepresentation[]>} A list of events
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getEvents(
    realmName: string,
    params?: GetRealmEventsParams
  ): Promise<EventRepresentation[]> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      const query = new URLSearchParams(params as any).toString();
      const endpoint = `/events${query ? `?${query}` : ''}`;
      return this.sdk.requestForRealm<EventRepresentation[]>(realmName, endpoint, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete all events
   *
   * Endpoint: DELETE /admin/realms/{realm}/events
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or realmName is invalid
   */
  async deleteEvents(realmName: string): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, '/events', 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get admin events
   * Returns all admin events, or filters events based on URL query parameters
   *
   * Endpoint: GET /admin/realms/{realm}/admin-events
   *
   * @param {string} realmName - The name of the realm
   * @param {GetAdminEventsParams} [params] - Parameters to filter the admin events
   * @returns {Promise<AdminEventRepresentation[]>} A list of admin events
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getAdminEvents(
    realmName: string,
    params?: GetAdminEventsParams
  ): Promise<AdminEventRepresentation[]> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      const query = new URLSearchParams(params as any).toString();
      const endpoint = `/admin-events${query ? `?${query}` : ''}`;
      return this.sdk.requestForRealm<AdminEventRepresentation[]>(realmName, endpoint, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get admin events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete all admin events
   *
   * Endpoint: DELETE /admin/realms/{realm}/admin-events
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or realmName is invalid
   */
  async deleteAdminEvents(realmName: string): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, '/admin-events', 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete admin events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Remove all user sessions
   * Any client that has an admin url will also be told to invalidate any sessions they have.
   *
   * Endpoint: POST /admin/realms/{realm}/logout-all
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<GlobalRequestResult>} Result of the logout operation
   * @throws {Error} If the request fails or realmName is invalid
   */
  async logoutAll(realmName: string): Promise<GlobalRequestResult> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<GlobalRequestResult>(realmName, '/logout-all', 'POST');
    } catch (error) {
      throw new Error(
        `Failed to logout all users for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Push the realm's revocation policy
   * Push the realm's revocation policy to any client that has an admin url associated with it.
   *
   * Endpoint: POST /admin/realms/{realm}/push-revocation
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<GlobalRequestResult>} Result of the push operation
   * @throws {Error} If the request fails or realmName is invalid
   */
  async pushRevocation(realmName: string): Promise<GlobalRequestResult> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<GlobalRequestResult>(realmName, '/push-revocation', 'POST');
    } catch (error) {
      throw new Error(
        `Failed to push revocation for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Partial export of existing realm
   * Export a realm into a JSON file.
   *
   * Endpoint: POST /admin/realms/{realm}/partial-export
   *
   * @param {string} realmName - The name of the realm
   * @param {boolean} [exportClients] - Whether to export clients
   * @param {boolean} [exportGroupsAndRoles] - Whether to export groups and roles
   * @returns {Promise<RealmRepresentation>} The exported realm representation
   * @throws {Error} If the request fails or realmName is invalid
   */
  async partialExport(
    realmName: string,
    exportClients?: boolean,
    exportGroupsAndRoles?: boolean
  ): Promise<RealmRepresentation> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      const query = new URLSearchParams();
      if (exportClients !== undefined) {
        query.append('exportClients', String(exportClients));
      }
      if (exportGroupsAndRoles !== undefined) {
        query.append('exportGroupsAndRoles', String(exportGroupsAndRoles));
      }

      const queryString = query.toString();
      const endpoint = `/partial-export${queryString ? `?${queryString}` : ''}`;
      return this.sdk.requestForRealm<RealmRepresentation>(realmName, endpoint, 'POST');
    } catch (error) {
      throw new Error(
        `Failed to export realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Partial import from a JSON file to an existing realm
   *
   * Endpoint: POST /admin/realms/{realm}/partialImport
   *
   * @param {string} realmName - The name of the realm
   * @param {RealmRepresentation} data - The realm data to import
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async partialImport(realmName: string, data: RealmRepresentation): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!data) {
      throw new Error('Import data is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, '/partialImport', 'POST', data);
    } catch (error) {
      throw new Error(
        `Failed to import data to realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Test SMTP connection
   * Test SMTP connection with current logged in user
   *
   * Endpoint: POST /admin/realms/{realm}/testSMTPConnection
   *
   * @param {string} realmName - The name of the realm
   * @param {Record<string, string>} config - SMTP server configuration
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async testSMTPConnection(realmName: string, config: Record<string, string>): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!config) {
      throw new Error('SMTP configuration is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, '/testSMTPConnection', 'POST', config);
    } catch (error) {
      throw new Error(
        `Failed to test SMTP connection for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client session stats
   * Returns a JSON map where the key is the client id and the value is the number of active sessions
   *
   * Endpoint: GET /admin/realms/{realm}/client-session-stats
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<Array<{id: string, active: number}>>} Client session stats
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getClientSessionStats(
    realmName: string
  ): Promise<Array<{ id: string; active: string; offline: string; clientId: string }>> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<
        Array<{ id: string; active: string; offline: string; clientId: string }>
      >(realmName, '/client-session-stats', 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get client session stats for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client policies
   *
   * Endpoint: GET /admin/realms/{realm}/client-policies/policies
   *
   * @param {string} realmName - The name of the realm
   * @param {boolean} [includeGlobalPolicies] - Whether to include global policies
   * @returns {Promise<ClientPoliciesRepresentation>} Client policies
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getClientPolicies(
    realmName: string,
    includeGlobalPolicies?: boolean
  ): Promise<ClientPoliciesRepresentation> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      const query =
        includeGlobalPolicies !== undefined
          ? `?include-global-policies=${includeGlobalPolicies}`
          : '';

      const response = await this.sdk.requestForRealm<ClientPoliciesRepresentation>(
        realmName,
        `/client-policies/policies${query}`,
        'GET'
      );

      // Ensure the response has the expected structure
      return {
        policies: response.policies || [],
        globalPolicies: response.globalPolicies || []
      };
    } catch (error) {
      // Provide more context about the error
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(
          `Client policies endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`
        );
      }

      if (error instanceof Error && error.message.includes('400')) {
        throw new Error(
          `Invalid request to client policies endpoint for realm ${realmName}. The API may have changed in your Keycloak version.`
        );
      }

      throw new Error(
        `Failed to get client policies for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update client policies
   *
   * Endpoint: PUT /admin/realms/{realm}/client-policies/policies
   *
   * @param {string} realmName - The name of the realm
   * @param {ClientPoliciesRepresentation} policies - The client policies to update
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async updateClientPolicies(
    realmName: string,
    policies: ClientPoliciesRepresentation
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!policies) {
      throw new Error('Client policies are required');
    }

    try {
      // Ensure we have the correct structure before sending
      const sanitizedPolicies: ClientPoliciesRepresentation = {
        policies:
          policies.policies?.map(policy => ({
            name: policy.name,
            description: policy.description,
            enabled: policy.enabled,
            conditions: policy.conditions,
            profiles: policy.profiles || []
          })) || [],
        globalPolicies: policies.globalPolicies || []
      };

      await this.sdk.requestForRealm<void>(
        realmName,
        '/client-policies/policies',
        'PUT',
        sanitizedPolicies
      );
    } catch (error) {
      // Provide more context about the error
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(
          `Client policies endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`
        );
      }

      if (error instanceof Error && error.message.includes('400')) {
        throw new Error(
          `Invalid request to update client policies for realm ${realmName}. Check that your policy structure matches the Keycloak API requirements. Common issues: missing 'profiles' array or incorrect condition structure.`
        );
      }

      throw new Error(
        `Failed to update client policies for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client profiles
   *
   * Endpoint: GET /admin/realms/{realm}/client-policies/profiles
   *
   * @param {string} realmName - The name of the realm
   * @param {boolean} [includeGlobalProfiles] - Whether to include global profiles
   * @returns {Promise<ClientProfilesRepresentation>} Client profiles
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getClientProfiles(
    realmName: string,
    includeGlobalProfiles?: boolean
  ): Promise<ClientProfilesRepresentation> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      const query =
        includeGlobalProfiles !== undefined
          ? `?include-global-profiles=${includeGlobalProfiles}`
          : '';

      const response = await this.sdk.requestForRealm<ClientProfilesRepresentation>(
        realmName,
        `/client-policies/profiles${query}`,
        'GET'
      );

      // Ensure the response has the expected structure
      return {
        profiles: response.profiles || [],
        globalProfiles: response.globalProfiles || []
      };
    } catch (error) {
      // Provide more context about the error
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(
          `Client profiles endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`
        );
      }

      if (error instanceof Error && error.message.includes('400')) {
        throw new Error(
          `Invalid request to client profiles endpoint for realm ${realmName}. The API may have changed in your Keycloak version.`
        );
      }

      throw new Error(
        `Failed to get client profiles for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update client profiles
   *
   * Endpoint: PUT /admin/realms/{realm}/client-policies/profiles
   *
   * @param {string} realmName - The name of the realm
   * @param {ClientProfilesRepresentation} profiles - The client profiles to update
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async updateClientProfiles(
    realmName: string,
    profiles: ClientProfilesRepresentation
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!profiles) {
      throw new Error('Client profiles are required');
    }

    try {
      // Ensure we have the correct structure before sending
      const sanitizedProfiles: ClientProfilesRepresentation = {
        profiles:
          profiles.profiles?.map(profile => ({
            name: profile.name,
            description: profile.description,
            executors:
              profile.executors?.map(executor => ({
                executor: executor.executor,
                configuration: executor.configuration || {}
              })) || []
          })) || [],
        globalProfiles: profiles.globalProfiles || []
      };

      await this.sdk.requestForRealm<void>(
        realmName,
        '/client-policies/profiles',
        'PUT',
        sanitizedProfiles
      );
    } catch (error) {
      // Provide more context about the error
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error(
          `Client profiles endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`
        );
      }

      if (error instanceof Error && error.message.includes('400')) {
        throw new Error(
          `Invalid request to update client profiles for realm ${realmName}. Check that your profile structure matches the Keycloak API requirements. Common issues: incorrect executor structure or configuration format.`
        );
      }

      throw new Error(
        `Failed to update client profiles for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get client types
   * List all client types available in the current realm
   *
   * Endpoint: GET /admin/realms/{realm}/client-types
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<ClientTypesRepresentation>} Client types
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getClientTypes(realmName: string): Promise<ClientTypesRepresentation> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<ClientTypesRepresentation>(realmName, '/client-types', 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get client types for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update client types
   * This endpoint allows you to update a realm level client type
   *
   * Endpoint: PUT /admin/realms/{realm}/client-types
   *
   * @param {string} realmName - The name of the realm
   * @param {ClientTypesRepresentation} clientTypes - The client types to update
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async updateClientTypes(
    realmName: string,
    clientTypes: ClientTypesRepresentation
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!clientTypes) {
      throw new Error('Client types are required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, '/client-types', 'PUT', clientTypes);
    } catch (error) {
      throw new Error(
        `Failed to update client types for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get users management permissions
   *
   * Endpoint: GET /admin/realms/{realm}/users-management-permissions
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<ManagementPermissionReference>} Users management permissions
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getUsersManagementPermissions(realmName: string): Promise<ManagementPermissionReference> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<ManagementPermissionReference>(
        realmName,
        '/users-management-permissions',
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get users management permissions for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update users management permissions
   *
   * Endpoint: PUT /admin/realms/{realm}/users-management-permissions
   *
   * @param {string} realmName - The name of the realm
   * @param {ManagementPermissionReference} permissions - The permissions to update
   * @returns {Promise<ManagementPermissionReference>} Updated permissions
   * @throws {Error} If the request fails or parameters are invalid
   */
  async updateUsersManagementPermissions(
    realmName: string,
    permissions: ManagementPermissionReference
  ): Promise<ManagementPermissionReference> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!permissions) {
      throw new Error('Permissions are required');
    }

    try {
      return this.sdk.requestForRealm<ManagementPermissionReference>(
        realmName,
        '/users-management-permissions',
        'PUT',
        permissions
      );
    } catch (error) {
      throw new Error(
        `Failed to update users management permissions for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Convert client representation from an external format
   * Base path for importing clients under this realm
   *
   * Endpoint: POST /admin/realms/{realm}/client-description-converter
   *
   * @param {string} realmName - The name of the realm
   * @param {string} description - The client description in an external format (e.g., OpenID Connect Discovery JSON)
   * @returns {Promise<any>} Converted client representation
   * @throws {Error} If the request fails or parameters are invalid
   */
  async convertClientDescription(realmName: string, description: string): Promise<any> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!description) {
      throw new Error('Client description is required');
    }

    try {
      return this.sdk.requestForRealm<any>(
        realmName,
        '/client-description-converter',
        'POST',
        description
      );
    } catch (error) {
      throw new Error(
        `Failed to convert client description for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get supported locales
   * Returns a list of supported locales for the realm
   *
   * Endpoint: GET /admin/realms/{realm}/localization
   *
   * @param {string} realmName - The name of the realm
   * @returns {Promise<string[]>} List of supported locales
   * @throws {Error} If the request fails or realmName is invalid
   */
  async getLocalizationLocales(realmName: string): Promise<string[]> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.requestForRealm<string[]>(realmName, '/localization', 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get localization locales for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get localization texts for a specific locale
   *
   * Endpoint: GET /admin/realms/{realm}/localization/{locale}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} locale - The locale to get texts for
   * @param {boolean} [useRealmDefaultLocaleFallback] - Whether to use realm default locale as fallback
   * @returns {Promise<Record<string, string>>} Localization texts
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getLocalizationTexts(
    realmName: string,
    locale: string,
    useRealmDefaultLocaleFallback?: boolean
  ): Promise<Record<string, string>> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!locale) {
      throw new Error('Locale is required');
    }

    try {
      const query =
        useRealmDefaultLocaleFallback !== undefined
          ? `?useRealmDefaultLocaleFallback=${useRealmDefaultLocaleFallback}`
          : '';
      return this.sdk.requestForRealm<Record<string, string>>(
        realmName,
        `/localization/${locale}${query}`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get localization texts for realm ${realmName} and locale ${locale}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Add or update localization texts
   * Import localization from uploaded JSON file
   *
   * Endpoint: POST /admin/realms/{realm}/localization/{locale}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} locale - The locale to update
   * @param {Record<string, string>} texts - The localization texts
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async addLocalizationTexts(
    realmName: string,
    locale: string,
    texts: Record<string, string>
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!locale) {
      throw new Error('Locale is required');
    }

    if (!texts || Object.keys(texts).length === 0) {
      throw new Error('Localization texts are required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, `/localization/${locale}`, 'POST', texts);
    } catch (error) {
      throw new Error(
        `Failed to add localization texts for realm ${realmName} and locale ${locale}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete all texts for a locale
   *
   * Endpoint: DELETE /admin/realms/{realm}/localization/{locale}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} locale - The locale to delete
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async deleteLocalizationTexts(realmName: string, locale: string): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!locale) {
      throw new Error('Locale is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, `/localization/${locale}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete localization texts for realm ${realmName} and locale ${locale}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get text for a specific key and locale
   *
   * Endpoint: GET /admin/realms/{realm}/localization/{locale}/{key}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} locale - The locale
   * @param {string} key - The key to get text for
   * @returns {Promise<string>} Localization text
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getLocalizationText(realmName: string, locale: string, key: string): Promise<string> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!locale) {
      throw new Error('Locale is required');
    }

    if (!key) {
      throw new Error('Key is required');
    }

    try {
      return this.sdk.requestForRealm<string>(realmName, `/localization/${locale}/${key}`, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get localization text for realm ${realmName}, locale ${locale}, and key ${key}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Update text for a specific key and locale
   *
   * Endpoint: PUT /admin/realms/{realm}/localization/{locale}/{key}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} locale - The locale
   * @param {string} key - The key to update
   * @param {string} text - The new text
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async updateLocalizationText(
    realmName: string,
    locale: string,
    key: string,
    text: string
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!locale) {
      throw new Error('Locale is required');
    }

    if (!key) {
      throw new Error('Key is required');
    }

    if (text === undefined || text === null) {
      throw new Error('Text is required');
    }

    try {
      await this.sdk.requestForRealm<void>(
        realmName,
        `/localization/${locale}/${key}`,
        'PUT',
        text
      );
    } catch (error) {
      throw new Error(
        `Failed to update localization text for realm ${realmName}, locale ${locale}, and key ${key}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete text for a specific key and locale
   *
   * Endpoint: DELETE /admin/realms/{realm}/localization/{locale}/{key}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} locale - The locale
   * @param {string} key - The key to delete
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async deleteLocalizationText(realmName: string, locale: string, key: string): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!locale) {
      throw new Error('Locale is required');
    }

    if (!key) {
      throw new Error('Key is required');
    }

    try {
      await this.sdk.requestForRealm<void>(realmName, `/localization/${locale}/${key}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete localization text for realm ${realmName}, locale ${locale}, and key ${key}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a specific user session
   * Remove a specific user session. Any client that has an admin url will also be told to invalidate this particular session.
   *
   * Endpoint: DELETE /admin/realms/{realm}/sessions/{session}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} sessionId - The session ID to delete
   * @param {boolean} [isOffline] - Whether this is an offline session
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or parameters are invalid
   */
  async deleteUserSession(
    realmName: string,
    sessionId: string,
    isOffline?: boolean
  ): Promise<void> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    try {
      const query = isOffline !== undefined ? `?isOffline=${isOffline}` : '';
      await this.sdk.requestForRealm<void>(realmName, `/sessions/${sessionId}${query}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete user session for realm ${realmName} and session ${sessionId}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get group by path
   *
   * Endpoint: GET /admin/realms/{realm}/group-by-path/{path}
   *
   * @param {string} realmName - The name of the realm
   * @param {string} path - The group path
   * @returns {Promise<any>} Group representation
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getGroupByPath(realmName: string, path: string): Promise<any> {
    if (!realmName) {
      throw new Error('Realm name is required');
    }

    if (!path) {
      throw new Error('Group path is required');
    }

    try {
      return this.sdk.requestForRealm<any>(realmName, `/group-by-path/${path}`, 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get group by path for realm ${realmName} and path ${path}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
