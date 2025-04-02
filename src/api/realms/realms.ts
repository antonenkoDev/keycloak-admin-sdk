import KeycloakAdminSDK from '../../index';
import {
    RealmRepresentation,
    GetRealmsParams,
    RealmEventsConfigRepresentation,
    EventRepresentation,
    GetRealmEventsParams,
    AdminEventRepresentation,
    GetAdminEventsParams,
    GlobalRequestResult
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
            throw new Error(`Failed to retrieve realms list: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to create realm: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to get realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to update realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to delete realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            return this.sdk.requestForRealm<RealmEventsConfigRepresentation>(realmName, '/events/config', 'GET');
        } catch (error) {
            throw new Error(`Failed to get events config for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateEventsConfig(realmName: string, config: RealmEventsConfigRepresentation): Promise<void> {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        
        if (!config) {
            throw new Error('Events configuration is required');
        }

        try {
            await this.sdk.requestForRealm<void>(realmName, '/events/config', 'PUT', config);
        } catch (error) {
            throw new Error(`Failed to update events config for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getEvents(realmName: string, params?: GetRealmEventsParams): Promise<EventRepresentation[]> {
        if (!realmName) {
            throw new Error('Realm name is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/events${query ? `?${query}` : ''}`;
            return this.sdk.requestForRealm<EventRepresentation[]>(realmName, endpoint, 'GET');
        } catch (error) {
            throw new Error(`Failed to get events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to delete events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getAdminEvents(realmName: string, params?: GetAdminEventsParams): Promise<AdminEventRepresentation[]> {
        if (!realmName) {
            throw new Error('Realm name is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/admin-events${query ? `?${query}` : ''}`;
            return this.sdk.requestForRealm<AdminEventRepresentation[]>(realmName, endpoint, 'GET');
        } catch (error) {
            throw new Error(`Failed to get admin events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to delete admin events for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to logout all users for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to push revocation for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to export realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to import data to realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
            throw new Error(`Failed to test SMTP connection for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
