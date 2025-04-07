'use strict';

class ConsentsApi {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get consents granted by the user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<ConsentRepresentation[]>} A list of consents granted by the user.
     */
    async list(userId) {
        const endpoint = `/users/${userId}/consents`;
        return this.sdk.request(endpoint, 'GET');
    }
    /**
     * Revoke consent and offline tokens for a particular client from the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} clientId - The ID of the client.
     * @returns {Promise<void>}
     */
    async revoke(userId, clientId) {
        const endpoint = `/users/${userId}/consents/${clientId}`;
        await this.sdk.request(endpoint, 'DELETE');
    }
}

class CredentialsApi {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get credentials for a user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<CredentialRepresentation[]>} A list of user credentials.
     */
    async list(userId) {
        const endpoint = `/users/${userId}/credentials`;
        return this.sdk.request(endpoint, 'GET');
    }
    /**
     * Remove a credential for a user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential to remove.
     * @returns {Promise<void>}
     */
    async remove(userId, credentialId) {
        const endpoint = `/users/${userId}/credentials/${credentialId}`;
        await this.sdk.request(endpoint, 'DELETE');
    }
    /**
     * Move a credential to a position behind another credential.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential to move.
     * @param {string} newPreviousCredentialId - The ID of the credential that will be the previous element in the list.
     * @returns {Promise<void>}
     */
    async moveAfter(userId, credentialId, newPreviousCredentialId) {
        const endpoint = `/users/${userId}/credentials/${credentialId}/moveAfter/${newPreviousCredentialId}`;
        await this.sdk.request(endpoint, 'POST');
    }
    /**
     * Move a credential to the first position in the credentials list of the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential to move.
     * @returns {Promise<void>}
     */
    async moveToFirst(userId, credentialId) {
        const endpoint = `/users/${userId}/credentials/${credentialId}/moveToFirst`;
        await this.sdk.request(endpoint, 'POST');
    }
    /**
     * Update a credential label for a user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential.
     * @param {string} label - The new label for the credential.
     * @returns {Promise<void>}
     */
    async updateLabel(userId, credentialId, label) {
        const endpoint = `/users/${userId}/credentials/${credentialId}/userLabel`;
        await this.sdk.request(endpoint, 'PUT', label);
    }
    /**
     * Disable all credentials for a user of a specific type.
     *
     * @param {string} userId - The ID of the user.
     * @param {string[]} types - The types of credentials to disable.
     * @returns {Promise<void>}
     */
    async disableTypes(userId, types) {
        const endpoint = `/users/${userId}/disable-credential-types`;
        await this.sdk.request(endpoint, 'PUT', types);
    }
    /**
     * Reset password for a user.
     *
     * @param {string} userId - The ID of the user.
     * @param {CredentialRepresentation} credential - The new credential representation.
     * @returns {Promise<void>}
     */
    async resetPassword(userId, credential) {
        const endpoint = `/users/${userId}/reset-password`;
        await this.sdk.request(endpoint, 'PUT', credential);
    }
}

let GroupsApi$1 = class GroupsApi {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get groups associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {object} [params] - Optional query parameters.
     * @param {boolean} [params.briefRepresentation] - Whether to return brief representations.
     * @param {number} [params.first] - Pagination offset.
     * @param {number} [params.max] - Maximum results size.
     * @param {string} [params.search] - Search term.
     * @returns {Promise<GroupRepresentation[]>} A list of groups.
     */
    async list(userId, params) {
        const query = new URLSearchParams(params).toString();
        const endpoint = `/users/${userId}/groups${query ? `?${query}` : ''}`;
        return this.sdk.request(endpoint, 'GET');
    }
    /**
     * Get the count of groups associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} [search] - Search term.
     * @returns {Promise<number>} The count of groups.
     */
    async count(userId, search) {
        const query = new URLSearchParams(search ? { search } : {}).toString();
        const endpoint = `/users/${userId}/groups/count${query ? `?${query}` : ''}`;
        return this.sdk.request(endpoint, 'GET');
    }
    /**
     * Add a user to a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    async add(userId, groupId) {
        const endpoint = `/users/${userId}/groups/${groupId}`;
        await this.sdk.request(endpoint, 'PUT');
    }
    /**
     * Remove a user from a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    async remove(userId, groupId) {
        const endpoint = `/users/${userId}/groups/${groupId}`;
        await this.sdk.request(endpoint, 'DELETE');
    }
};

/**
 * Role Mappings API for Users in Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for users in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Role Mappings API for Users
 *
 * Provides methods to manage role mappings for users in Keycloak
 */
let UserRoleMappingsApi$1 = class UserRoleMappingsApi {
    sdk;
    /**
     * Constructor for UserRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get realm-level role mappings for a user
     *
     * Endpoint: GET /{realm}/users/{id}/role-mappings/realm
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of role representations
     */
    async getRealmRoleMappings(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            return this.sdk.request(`/users/${userId}/role-mappings/realm`, 'GET');
        }
        catch (error) {
            console.error(`Error getting realm role mappings for user ${userId}:`, error);
            throw new Error(`Failed to get realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add realm-level role mappings to a user
     *
     * Endpoint: POST /{realm}/users/{id}/role-mappings/realm
     *
     * @param userId - User ID
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addRealmRoles(userId, roles) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`/users/${userId}/role-mappings/realm`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding realm roles to user ${userId}:`, error);
            throw new Error(`Failed to add realm roles: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove realm-level role mappings from a user
     *
     * Endpoint: DELETE /{realm}/users/{id}/role-mappings/realm
     *
     * @param userId - User ID
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async removeRealmRoles(userId, roles) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`/users/${userId}/role-mappings/realm`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error removing realm roles from user ${userId}:`, error);
            throw new Error(`Failed to remove realm roles: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available realm-level roles that can be mapped to a user
     *
     * Endpoint: GET /{realm}/users/{id}/role-mappings/realm/available
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of available role representations
     */
    async getAvailableRealmRoleMappings(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            return this.sdk.request(`/users/${userId}/role-mappings/realm/available`, 'GET');
        }
        catch (error) {
            console.error(`Error getting available realm role mappings for user ${userId}:`, error);
            throw new Error(`Failed to get available realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get effective realm-level role mappings for a user (including composite roles)
     *
     * Endpoint: GET /{realm}/users/{id}/role-mappings/realm/composite
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of effective role representations
     */
    async getEffectiveRealmRoleMappings(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            return this.sdk.request(`/users/${userId}/role-mappings/realm/composite`, 'GET');
        }
        catch (error) {
            console.error(`Error getting effective realm role mappings for user ${userId}:`, error);
            throw new Error(`Failed to get effective realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};

class UsersApi {
    sdk;
    consents;
    credentials;
    groups;
    roleMappings;
    constructor(sdk) {
        this.sdk = sdk;
        this.consents = new ConsentsApi(sdk);
        this.credentials = new CredentialsApi(sdk);
        this.groups = new GroupsApi$1(sdk);
        this.roleMappings = new UserRoleMappingsApi$1(sdk);
    }
    /**
     * Get realm-level role mappings for a user
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of role representations
     */
    async getRealmRoleMappings(userId) {
        return this.roleMappings.getRealmRoleMappings(userId);
    }
    /**
     * Add realm-level role mappings to a user
     *
     * @param userId - User ID
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addRealmRoles(userId, roles) {
        return this.roleMappings.addRealmRoles(userId, roles);
    }
    /**
     * Remove realm-level role mappings from a user
     *
     * @param userId - User ID
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async removeRealmRoles(userId, roles) {
        return this.roleMappings.removeRealmRoles(userId, roles);
    }
    /**
     * Get available realm-level roles that can be mapped to a user
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of available role representations
     */
    async getAvailableRealmRoleMappings(userId) {
        return this.roleMappings.getAvailableRealmRoleMappings(userId);
    }
    /**
     * Get effective realm-level role mappings for a user (including composite roles)
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of effective role representations
     */
    async getEffectiveRealmRoleMappings(userId) {
        return this.roleMappings.getEffectiveRealmRoleMappings(userId);
    }
    /**
     * Get a list of users.
     *
     * Endpoint: GET /admin/realms/{realm}/users
     *
     * @param {GetUsersParams} [params] - Parameters to filter the users
     * @returns {Promise<UserRepresentation[]>} A list of users
     * @throws {Error} If the request fails
     */
    async list(params) {
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users${query ? `?${query}` : ''}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to retrieve users list: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new user.
     *
     * Endpoint: POST /admin/realms/{realm}/users
     *
     * @param {UserRepresentation} user - The user representation to create
     * @returns {Promise<string>} The ID of the created user
     * @throws {Error} If the request fails or user data is invalid
     */
    async create(user) {
        if (!user) {
            throw new Error('User data is required');
        }
        try {
            // Ensure username is provided (required by Keycloak)
            if (!user.username) {
                throw new Error('Username is required');
            }
            // Create a separate endpoint for user creation
            const endpoint = `/users`;
            // Make the POST request to create the user
            // Keycloak returns a 201 Created with a Location header containing the user ID
            // Our enhanced request utility will extract the ID from the Location header
            const result = await this.sdk.request(endpoint, 'POST', user);
            // Fallback to the old method if the ID wasn't extracted from the Location header
            const users = await this.list({ username: user.username, exact: true });
            if (users && users.length > 0 && users[0].id) {
                return users[0].id;
            }
            throw new Error('User was created but could not be found');
        }
        catch (error) {
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get representation of the user.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}
     *
     * @param {string} userId - The ID of the user
     * @param {GetUserParams} [params] - Parameters for the request
     * @returns {Promise<UserRepresentation>} The user representation
     * @throws {Error} If the request fails or userId is invalid
     */
    async get(userId, params) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users/${userId}${query ? `?${query}` : ''}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update the user.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/{id}
     *
     * @param {string} userId - The ID of the user
     * @param {UserRepresentation} user - The user representation with updated data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async update(userId, user) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!user) {
            throw new Error('User data is required');
        }
        try {
            const endpoint = `/users/${userId}`;
            await this.sdk.request(endpoint, 'PUT', user);
        }
        catch (error) {
            throw new Error(`Failed to update user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete the user.
     *
     * Endpoint: DELETE /admin/realms/{realm}/users/{id}
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or userId is invalid
     */
    async delete(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/users/${userId}`;
            await this.sdk.request(endpoint, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get the number of users that match the given criteria.
     *
     * Endpoint: GET /admin/realms/{realm}/users/count
     *
     * @param {CountUsersParams} [params] - Parameters to filter the users
     * @returns {Promise<number>} The number of users
     * @throws {Error} If the request fails
     */
    async count(params) {
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users/count${query ? `?${query}` : ''}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to count users: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get the configuration for the user profile.
     *
     * Endpoint: GET /admin/realms/{realm}/users/profile
     *
     * @returns {Promise<UPConfig>} The user profile configuration
     * @throws {Error} If the request fails
     */
    async getUserProfileConfig() {
        try {
            const endpoint = `/users/profile`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get user profile configuration: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Set the configuration for the user profile.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/profile
     *
     * @param {UPConfig} config - The user profile configuration to set
     * @returns {Promise<UPConfig>} The updated user profile configuration
     * @throws {Error} If the request fails
     */
    async setUserProfileConfig(config) {
        if (!config) {
            throw new Error('User profile configuration is required');
        }
        const endpoint = `/users/profile`;
        return this.sdk.request(endpoint, 'PUT', config);
    }
    /**
     * Get the UserProfileMetadata from the configuration.
     *
     * Endpoint: GET /admin/realms/{realm}/users/profile/metadata
     *
     * @returns {Promise<UserProfileMetadata>} The user profile metadata
     * @throws {Error} If the request fails
     */
    async getUserProfileMetadata() {
        try {
            const endpoint = `/users/profile/metadata`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get user profile metadata: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Return credential types, which are provided by the user storage where user is stored.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/configured-user-storage-credential-types
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<string[]>} A list of credential types
     * @throws {Error} If the request fails or userId is invalid
     */
    async getUserStorageCredentialTypes(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/users/${userId}/configured-user-storage-credential-types`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get user storage credential types for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Send an email to the user with a link they can click to execute particular actions.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/{id}/execute-actions-email
     *
     * @param {string} userId - The ID of the user
     * @param {string[]} actions - The actions the user can execute
     * @param {ExecuteActionsEmailParams} [params] - Optional parameters for the request
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async executeActionsEmail(userId, actions, params) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!actions || !Array.isArray(actions) || actions.length === 0) {
            throw new Error('At least one action is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users/${userId}/execute-actions-email${query ? `?${query}` : ''}`;
            await this.sdk.request(endpoint, 'PUT', actions);
        }
        catch (error) {
            throw new Error(`Failed to send actions email to user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Send an email-verification email to the user.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/{id}/send-verify-email
     *
     * @param {string} userId - The ID of the user
     * @param {SendVerifyEmailParams} [params] - Optional parameters for the request
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or userId is invalid
     */
    async sendVerifyEmail(userId, params) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/users/${userId}/send-verify-email${query ? `?${query}` : ''}`;
            await this.sdk.request(endpoint, 'PUT');
        }
        catch (error) {
            throw new Error(`Failed to send verification email to user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get sessions associated with the user.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/sessions
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<UserSessionRepresentation[]>} A list of user sessions
     * @throws {Error} If the request fails or userId is invalid
     */
    async getUserSessions(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/users/${userId}/sessions`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get sessions for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get social logins associated with the user.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/federated-identity
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<FederatedIdentityRepresentation[]>} A list of federated identities
     * @throws {Error} If the request fails or userId is invalid
     */
    async getFederatedIdentities(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/users/${userId}/federated-identity`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get federated identities for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add a social login provider to the user.
     *
     * Endpoint: POST /admin/realms/{realm}/users/{id}/federated-identity/{provider}
     *
     * @param {string} userId - The ID of the user
     * @param {string} provider - The ID of the social login provider
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async addFederatedIdentity(userId, provider) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!provider) {
            throw new Error('Provider ID is required');
        }
        try {
            const endpoint = `/users/${userId}/federated-identity/${provider}`;
            await this.sdk.request(endpoint, 'POST');
        }
        catch (error) {
            throw new Error(`Failed to add federated identity ${provider} to user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove a social login provider from the user.
     *
     * Endpoint: DELETE /admin/realms/{realm}/users/{id}/federated-identity/{provider}
     *
     * @param {string} userId - The ID of the user
     * @param {string} provider - The ID of the social login provider
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async removeFederatedIdentity(userId, provider) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!provider) {
            throw new Error('Provider ID is required');
        }
        try {
            const endpoint = `/users/${userId}/federated-identity/${provider}`;
            await this.sdk.request(endpoint, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to remove federated identity ${provider} from user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Impersonate the user.
     *
     * Endpoint: POST /admin/realms/{realm}/users/{id}/impersonation
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<Record<string, any>>} The impersonation response
     * @throws {Error} If the request fails or userId is invalid
     */
    async impersonate(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/users/${userId}/impersonation`;
            return this.sdk.request(endpoint, 'POST');
        }
        catch (error) {
            throw new Error(`Failed to impersonate user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove all user sessions associated with the user.
     *
     * Endpoint: POST /admin/realms/{realm}/users/{id}/logout
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or userId is invalid
     */
    async logout(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/users/${userId}/logout`;
            await this.sdk.request(endpoint, 'POST');
        }
        catch (error) {
            throw new Error(`Failed to logout user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get offline sessions associated with the user and client.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/offline-sessions/{clientId}
     *
     * @param {string} userId - The ID of the user
     * @param {string} clientId - The ID of the client
     * @returns {Promise<UserSessionRepresentation[]>} A list of user sessions
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getOfflineSessions(userId, clientId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            const endpoint = `/users/${userId}/offline-sessions/${clientId}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get offline sessions for user ${userId} and client ${clientId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * API for managing Keycloak groups
 */
class GroupsApi {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get group hierarchy. Only name and id are returned.
     * SubGroups are only returned when using the search or q parameter.
     *
     * Endpoint: GET /admin/realms/{realm}/groups
     *
     * @param {GetGroupsParams} [params] - Parameters to filter the groups
     * @returns {Promise<GroupRepresentation[]>} A list of groups
     * @throws {Error} If the request fails
     */
    async list(params) {
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/groups${query ? `?${query}` : ''}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to retrieve groups list: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Returns the groups count.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/count
     *
     * @param {GetGroupsCountParams} [params] - Parameters to filter the count
     * @returns {Promise<Record<string, number>>} The count of groups
     * @throws {Error} If the request fails
     */
    async count(params) {
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/groups/count${query ? `?${query}` : ''}`;
            const response = await this.sdk.request(endpoint, 'GET');
            return response.count;
        }
        catch (error) {
            throw new Error(`Failed to count groups: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create or add a top level realm group.
     *
     * Endpoint: POST /admin/realms/{realm}/groups
     *
     * @param {GroupRepresentation} group - The group to create
     * @returns {Promise<string>} The ID of the created group
     * @throws {Error} If the request fails or group data is invalid
     */
    async create(group) {
        if (!group) {
            throw new Error('Group data is required');
        }
        try {
            const endpoint = `/groups`;
            // Make the POST request to create the group
            // Keycloak returns a 201 Created with a Location header containing the group ID
            // Our enhanced request utility will extract the ID from the Location header
            const result = await this.sdk.request(endpoint, 'POST', group);
            if (result && result.id) {
                return result.id;
            }
            // Fallback to finding the group by name if the ID wasn't extracted from the Location header
            if (group.name) {
                const groups = await this.list({ search: group.name });
                const createdGroup = groups.find(g => g.name === group.name);
                if (createdGroup && createdGroup.id) {
                    return createdGroup.id;
                }
            }
            throw new Error('Group was created but could not be found');
        }
        catch (error) {
            throw new Error(`Failed to create group: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a specific group by ID.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}
     *
     * @param {string} groupId - The ID of the group
     * @returns {Promise<GroupRepresentation>} The group representation
     * @throws {Error} If the request fails or groupId is invalid
     */
    async get(groupId) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        try {
            const endpoint = `/groups/${groupId}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update group, ignores subgroups.
     *
     * Endpoint: PUT /admin/realms/{realm}/groups/{group-id}
     *
     * @param {string} groupId - The ID of the group
     * @param {GroupRepresentation} group - The group representation with updated data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async update(groupId, group) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        if (!group) {
            throw new Error('Group data is required');
        }
        try {
            const endpoint = `/groups/${groupId}`;
            await this.sdk.request(endpoint, 'PUT', group);
        }
        catch (error) {
            throw new Error(`Failed to update group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete a group.
     *
     * Endpoint: DELETE /admin/realms/{realm}/groups/{group-id}
     *
     * @param {string} groupId - The ID of the group
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or groupId is invalid
     */
    async delete(groupId) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        try {
            const endpoint = `/groups/${groupId}`;
            await this.sdk.request(endpoint, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Return a paginated list of subgroups that have a parent group corresponding to the group ID.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}/children
     *
     * @param {string} groupId - The ID of the parent group
     * @param {GetGroupChildrenParams} [params] - Parameters to filter the children
     * @returns {Promise<GroupRepresentation[]>} A list of child groups
     * @throws {Error} If the request fails or groupId is invalid
     */
    async getChildren(groupId, params) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/groups/${groupId}/children${query ? `?${query}` : ''}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get children for group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Set or create child group.
     * This will just set the parent if it exists. Create it and set the parent if the group doesn't exist.
     *
     * Endpoint: POST /admin/realms/{realm}/groups/{group-id}/children
     *
     * @param {string} groupId - The ID of the parent group
     * @param {GroupRepresentation} child - The child group to create or set
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async createChild(groupId, child) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        if (!child) {
            throw new Error('Child group data is required');
        }
        try {
            const endpoint = `/groups/${groupId}/children`;
            await this.sdk.request(endpoint, 'POST', child);
        }
        catch (error) {
            throw new Error(`Failed to create child group for parent ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add a user to a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    async addMember(userId, groupId) {
        return this.sdk.users.groups.add(userId, groupId);
    }
    /**
     * Get users in a group.
     * Returns a stream of users, filtered according to query parameters.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}/members
     *
     * @param {string} groupId - The ID of the group
     * @param {GetGroupMembersParams} [params] - Parameters to filter the members
     * @returns {Promise<UserRepresentation[]>} A list of users in the group
     * @throws {Error} If the request fails or groupId is invalid
     */
    async getMembers(groupId, params) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/groups/${groupId}/members${query ? `?${query}` : ''}`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get members for group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get management permissions for a group.
     * Return object stating whether client Authorization permissions have been initialized or not and a reference.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}/management/permissions
     *
     * @param {string} groupId - The ID of the group
     * @returns {Promise<ManagementPermissionReference>} The management permissions reference
     * @throws {Error} If the request fails or groupId is invalid
     */
    async getManagementPermissions(groupId) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        try {
            const endpoint = `/groups/${groupId}/management/permissions`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get management permissions for group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Set management permissions for a group.
     *
     * Endpoint: PUT /admin/realms/{realm}/groups/{group-id}/management/permissions
     *
     * @param {string} groupId - The ID of the group
     * @param {ManagementPermissionReference} permissions - The management permissions to set
     * @returns {Promise<ManagementPermissionReference>} The updated management permissions reference
     * @throws {Error} If the request fails or parameters are invalid
     */
    async setManagementPermissions(groupId, permissions) {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        if (!permissions) {
            throw new Error('Permissions data is required');
        }
        try {
            const endpoint = `/groups/${groupId}/management/permissions`;
            return this.sdk.request(endpoint, 'PUT', permissions);
        }
        catch (error) {
            throw new Error(`Failed to set management permissions for group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * API for managing Keycloak realms
 */
class RealmsApi {
    sdk;
    constructor(sdk) {
        this.sdk = sdk;
    }
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
    async list(params) {
        try {
            const query = new URLSearchParams(params).toString();
            // This endpoint doesn't include the realm in the path
            const endpoint = `${query ? `?${query}` : ''}`;
            return this.sdk.requestWithoutRealm(endpoint, 'GET');
        }
        catch (error) {
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
    async create(realm) {
        if (!realm) {
            throw new Error('Realm data is required');
        }
        if (!realm.realm) {
            throw new Error('Realm name is required');
        }
        try {
            // This endpoint doesn't include the realm in the path
            const endpoint = '';
            await this.sdk.requestWithoutRealm(endpoint, 'POST', realm);
        }
        catch (error) {
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
    async get(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            // For this endpoint, we need to use the realm name in the path
            // but not include it in the base URL since we're accessing a specific realm
            return this.sdk.requestForRealm(realmName, '', 'GET');
        }
        catch (error) {
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
    async update(realmName, realm) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!realm) {
            throw new Error('Realm data is required');
        }
        try {
            // For this endpoint, we need to use the realm name in the path
            // but not include it in the base URL since we're updating a specific realm
            await this.sdk.requestForRealm(realmName, '', 'PUT', realm);
        }
        catch (error) {
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
    async delete(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            // For this endpoint, we need to use the realm name in the path
            // but not include it in the base URL since we're deleting a specific realm
            await this.sdk.requestForRealm(realmName, '', 'DELETE');
        }
        catch (error) {
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
    async getEventsConfig(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/events/config', 'GET');
        }
        catch (error) {
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
    async updateEventsConfig(realmName, config) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!config) {
            throw new Error('Events configuration is required');
        }
        try {
            await this.sdk.requestForRealm(realmName, '/events/config', 'PUT', config);
        }
        catch (error) {
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
    async getEvents(realmName, params) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/events${query ? `?${query}` : ''}`;
            return this.sdk.requestForRealm(realmName, endpoint, 'GET');
        }
        catch (error) {
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
    async deleteEvents(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            await this.sdk.requestForRealm(realmName, '/events', 'DELETE');
        }
        catch (error) {
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
    async getAdminEvents(realmName, params) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            const query = new URLSearchParams(params).toString();
            const endpoint = `/admin-events${query ? `?${query}` : ''}`;
            return this.sdk.requestForRealm(realmName, endpoint, 'GET');
        }
        catch (error) {
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
    async deleteAdminEvents(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            await this.sdk.requestForRealm(realmName, '/admin-events', 'DELETE');
        }
        catch (error) {
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
    async logoutAll(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/logout-all', 'POST');
        }
        catch (error) {
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
    async pushRevocation(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/push-revocation', 'POST');
        }
        catch (error) {
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
    async partialExport(realmName, exportClients, exportGroupsAndRoles) {
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
            return this.sdk.requestForRealm(realmName, endpoint, 'POST');
        }
        catch (error) {
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
    async partialImport(realmName, data) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!data) {
            throw new Error('Import data is required');
        }
        try {
            await this.sdk.requestForRealm(realmName, '/partialImport', 'POST', data);
        }
        catch (error) {
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
    async testSMTPConnection(realmName, config) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!config) {
            throw new Error('SMTP configuration is required');
        }
        try {
            await this.sdk.requestForRealm(realmName, '/testSMTPConnection', 'POST', config);
        }
        catch (error) {
            throw new Error(`Failed to test SMTP connection for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getClientSessionStats(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/client-session-stats', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client session stats for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getClientPolicies(realmName, includeGlobalPolicies) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            const query = includeGlobalPolicies !== undefined
                ? `?include-global-policies=${includeGlobalPolicies}`
                : '';
            const response = await this.sdk.requestForRealm(realmName, `/client-policies/policies${query}`, 'GET');
            // Ensure the response has the expected structure
            return {
                policies: response.policies || [],
                globalPolicies: response.globalPolicies || []
            };
        }
        catch (error) {
            // Provide more context about the error
            if (error instanceof Error && error.message.includes('404')) {
                throw new Error(`Client policies endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`);
            }
            if (error instanceof Error && error.message.includes('400')) {
                throw new Error(`Invalid request to client policies endpoint for realm ${realmName}. The API may have changed in your Keycloak version.`);
            }
            throw new Error(`Failed to get client policies for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateClientPolicies(realmName, policies) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!policies) {
            throw new Error('Client policies are required');
        }
        try {
            // Ensure we have the correct structure before sending
            const sanitizedPolicies = {
                policies: policies.policies?.map(policy => ({
                    name: policy.name,
                    description: policy.description,
                    enabled: policy.enabled,
                    conditions: policy.conditions,
                    profiles: policy.profiles || []
                })) || [],
                globalPolicies: policies.globalPolicies || []
            };
            await this.sdk.requestForRealm(realmName, '/client-policies/policies', 'PUT', sanitizedPolicies);
        }
        catch (error) {
            // Provide more context about the error
            if (error instanceof Error && error.message.includes('404')) {
                throw new Error(`Client policies endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`);
            }
            if (error instanceof Error && error.message.includes('400')) {
                throw new Error(`Invalid request to update client policies for realm ${realmName}. Check that your policy structure matches the Keycloak API requirements. Common issues: missing 'profiles' array or incorrect condition structure.`);
            }
            throw new Error(`Failed to update client policies for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getClientProfiles(realmName, includeGlobalProfiles) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            const query = includeGlobalProfiles !== undefined
                ? `?include-global-profiles=${includeGlobalProfiles}`
                : '';
            const response = await this.sdk.requestForRealm(realmName, `/client-policies/profiles${query}`, 'GET');
            // Ensure the response has the expected structure
            return {
                profiles: response.profiles || [],
                globalProfiles: response.globalProfiles || []
            };
        }
        catch (error) {
            // Provide more context about the error
            if (error instanceof Error && error.message.includes('404')) {
                throw new Error(`Client profiles endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`);
            }
            if (error instanceof Error && error.message.includes('400')) {
                throw new Error(`Invalid request to client profiles endpoint for realm ${realmName}. The API may have changed in your Keycloak version.`);
            }
            throw new Error(`Failed to get client profiles for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateClientProfiles(realmName, profiles) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!profiles) {
            throw new Error('Client profiles are required');
        }
        try {
            // Ensure we have the correct structure before sending
            const sanitizedProfiles = {
                profiles: profiles.profiles?.map(profile => ({
                    name: profile.name,
                    description: profile.description,
                    executors: profile.executors?.map(executor => ({
                        executor: executor.executor,
                        configuration: executor.configuration || {}
                    })) || []
                })) || [],
                globalProfiles: profiles.globalProfiles || []
            };
            await this.sdk.requestForRealm(realmName, '/client-policies/profiles', 'PUT', sanitizedProfiles);
        }
        catch (error) {
            // Provide more context about the error
            if (error instanceof Error && error.message.includes('404')) {
                throw new Error(`Client profiles endpoint not available in this Keycloak version for realm ${realmName}. This feature may require Keycloak 12+ or Enterprise.`);
            }
            if (error instanceof Error && error.message.includes('400')) {
                throw new Error(`Invalid request to update client profiles for realm ${realmName}. Check that your profile structure matches the Keycloak API requirements. Common issues: incorrect executor structure or configuration format.`);
            }
            throw new Error(`Failed to update client profiles for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getClientTypes(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/client-types', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client types for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateClientTypes(realmName, clientTypes) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!clientTypes) {
            throw new Error('Client types are required');
        }
        try {
            await this.sdk.requestForRealm(realmName, '/client-types', 'PUT', clientTypes);
        }
        catch (error) {
            throw new Error(`Failed to update client types for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getUsersManagementPermissions(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/users-management-permissions', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get users management permissions for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateUsersManagementPermissions(realmName, permissions) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!permissions) {
            throw new Error('Permissions are required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/users-management-permissions', 'PUT', permissions);
        }
        catch (error) {
            throw new Error(`Failed to update users management permissions for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async convertClientDescription(realmName, description) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!description) {
            throw new Error('Client description is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/client-description-converter', 'POST', description);
        }
        catch (error) {
            throw new Error(`Failed to convert client description for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getLocalizationLocales(realmName) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, '/localization', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get localization locales for realm ${realmName}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getLocalizationTexts(realmName, locale, useRealmDefaultLocaleFallback) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!locale) {
            throw new Error('Locale is required');
        }
        try {
            const query = useRealmDefaultLocaleFallback !== undefined
                ? `?useRealmDefaultLocaleFallback=${useRealmDefaultLocaleFallback}`
                : '';
            return this.sdk.requestForRealm(realmName, `/localization/${locale}${query}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get localization texts for realm ${realmName} and locale ${locale}: ${error instanceof Error ? error.message : String(error)}`);
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
    async addLocalizationTexts(realmName, locale, texts) {
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
            await this.sdk.requestForRealm(realmName, `/localization/${locale}`, 'POST', texts);
        }
        catch (error) {
            throw new Error(`Failed to add localization texts for realm ${realmName} and locale ${locale}: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteLocalizationTexts(realmName, locale) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!locale) {
            throw new Error('Locale is required');
        }
        try {
            await this.sdk.requestForRealm(realmName, `/localization/${locale}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete localization texts for realm ${realmName} and locale ${locale}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getLocalizationText(realmName, locale, key) {
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
            const response = await this.sdk.requestForRealm(realmName, `/localization/${locale}/${key}`, 'GET');
            return response.text;
        }
        catch (error) {
            throw new Error(`Failed to get localization text for realm ${realmName}, locale ${locale}, and key ${key}: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateLocalizationText(realmName, locale, key, text) {
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
            await this.sdk.requestForRealm(realmName, `/localization/${locale}/${key}`, 'PUT', text, { headers: { 'Content-Type': 'text/plain' } });
        }
        catch (error) {
            throw new Error(`Failed to update localization text for realm ${realmName}, locale ${locale}, and key ${key}: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteLocalizationText(realmName, locale, key) {
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
            await this.sdk.requestForRealm(realmName, `/localization/${locale}/${key}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete localization text for realm ${realmName}, locale ${locale}, and key ${key}: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteUserSession(realmName, sessionId, isOffline) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!sessionId) {
            throw new Error('Session ID is required');
        }
        try {
            const query = isOffline !== undefined ? `?isOffline=${isOffline}` : '';
            await this.sdk.requestForRealm(realmName, `/sessions/${sessionId}${query}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete user session for realm ${realmName} and session ${sessionId}: ${error instanceof Error ? error.message : String(error)}`);
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
    async getGroupByPath(realmName, path) {
        if (!realmName) {
            throw new Error('Realm name is required');
        }
        if (!path) {
            throw new Error('Group path is required');
        }
        try {
            return this.sdk.requestForRealm(realmName, `/group-by-path/${path}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get group by path for realm ${realmName} and path ${path}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Client Certificates API for Keycloak Admin SDK
 * Provides methods for managing client certificates in Keycloak
 */
/**
 * API for managing Keycloak client certificates
 */
class ClientCertificatesApi {
    sdk;
    /**
     * Creates a new instance of the Client Certificates API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get certificate information for a client
     *
     * Endpoint: GET /{realm}/clients/{client-uuid}/certificates/{attr}
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @returns {Promise<CertificateRepresentation>} Certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getCertificateInfo(clientId, attr) {
        if (!clientId) {
            throw new Error('Client UUID is required');
        }
        if (!attr) {
            throw new Error('Certificate attribute is required');
        }
        try {
            return this.sdk.request(`/clients/${clientId}/certificates/${attr}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get certificate info: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Generate a new certificate with new key pair
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/generate
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @returns {Promise<CertificateRepresentation>} Generated certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    async generateCertificate(clientId, attr) {
        if (!clientId) {
            throw new Error('Client UUID is required');
        }
        if (!attr) {
            throw new Error('Certificate attribute is required');
        }
        try {
            return this.sdk.request(`/clients/${clientId}/certificates/${attr}/generate`, 'POST');
        }
        catch (error) {
            throw new Error(`Failed to generate certificate: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Upload only certificate, not private key
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/upload-certificate
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {CertificateRepresentation} certificate - Certificate data with certificate field
     * @returns {Promise<CertificateRepresentation>} Updated certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    async uploadCertificate(clientId, attr, certificate) {
        if (!clientId) {
            throw new Error('Client UUID is required');
        }
        if (!attr) {
            throw new Error('Certificate attribute is required');
        }
        if (!certificate || !certificate.certificate) {
            throw new Error('Certificate data with certificate field is required');
        }
        try {
            return this.sdk.request(`/clients/${clientId}/certificates/${attr}/upload-certificate`, 'POST', certificate);
        }
        catch (error) {
            throw new Error(`Failed to upload certificate: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Upload certificate and eventually private key
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/upload
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {CertificateRepresentation} certificate - Certificate data with certificate and privateKey fields
     * @returns {Promise<CertificateRepresentation>} Updated certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    async uploadCertificateWithKey(clientId, attr, certificate) {
        if (!clientId) {
            throw new Error('Client UUID is required');
        }
        if (!attr) {
            throw new Error('Certificate attribute is required');
        }
        if (!certificate || !certificate.certificate) {
            throw new Error('Certificate data with certificate field is required');
        }
        try {
            return this.sdk.request(`/clients/${clientId}/certificates/${attr}/upload`, 'POST', certificate);
        }
        catch (error) {
            throw new Error(`Failed to upload certificate with key: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a keystore file for the client, containing private key and public certificate
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/download
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {KeyStoreConfig} config - Keystore configuration
     * @returns {Promise<ArrayBuffer>} Keystore file as binary data
     * @throws {Error} If the request fails or parameters are invalid
     */
    async downloadKeystore(clientId, attr, config) {
        if (!clientId) {
            throw new Error('Client UUID is required');
        }
        if (!attr) {
            throw new Error('Certificate attribute is required');
        }
        if (!config) {
            throw new Error('Keystore configuration is required');
        }
        try {
            // Use custom headers for binary response
            const options = {
                headers: {
                    Accept: 'application/octet-stream'
                }
            };
            const response = await this.sdk.request(`/clients/${clientId}/certificates/${attr}/download`, 'POST', config, options);
            return response.text;
        }
        catch (error) {
            throw new Error(`Failed to download keystore: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Generate a new keypair and certificate, and get the private key file
     * Only generated public certificate is saved in Keycloak DB - the private key is not.
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/generate-and-download
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {KeyStoreConfig} config - Keystore configuration
     * @returns {Promise<ArrayBuffer>} Generated keystore file as binary data
     * @throws {Error} If the request fails or parameters are invalid
     */
    async generateAndDownloadKeystore(clientId, attr, config) {
        if (!clientId) {
            throw new Error('Client UUID is required');
        }
        if (!attr) {
            throw new Error('Certificate attribute is required');
        }
        if (!config) {
            throw new Error('Keystore configuration is required');
        }
        try {
            // Use custom headers for binary response
            const options = {
                headers: {
                    Accept: 'application/octet-stream'
                }
            };
            return this.sdk.request(`/clients/${clientId}/certificates/${attr}/generate-and-download`, 'POST', config, options);
        }
        catch (error) {
            throw new Error(`Failed to generate and download keystore: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Client Initial Access API for Keycloak Admin SDK
 * Provides methods for managing client initial access tokens in Keycloak
 */
/**
 * API for managing Keycloak client initial access tokens
 */
class ClientInitialAccessApi {
    sdk;
    /**
     * Creates a new instance of the Client Initial Access API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all client initial access tokens
     *
     * Endpoint: GET /{realm}/clients-initial-access
     *
     * @returns {Promise<ClientInitialAccessPresentation[]>} List of client initial access tokens
     * @throws {Error} If the request fails
     */
    async findAll() {
        try {
            return this.sdk.request('/clients-initial-access', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client initial access tokens: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new client initial access token
     *
     * Endpoint: POST /{realm}/clients-initial-access
     *
     * @param {ClientInitialAccessCreatePresentation} token - The token configuration
     * @returns {Promise<ClientInitialAccessCreatePresentation>} The created token with ID and token value
     * @throws {Error} If the request fails or token configuration is invalid
     */
    async create(token) {
        if (!token) {
            throw new Error('Token configuration is required');
        }
        try {
            // Return the full response which includes the token value
            return this.sdk.request('/clients-initial-access', 'POST', token);
        }
        catch (error) {
            throw new Error(`Failed to create client initial access token: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete a client initial access token
     *
     * Endpoint: DELETE /{realm}/clients-initial-access/{id}
     *
     * @param {string} id - The token ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or ID is invalid
     */
    async delete(id) {
        if (!id) {
            throw new Error('Token ID is required');
        }
        try {
            await this.sdk.request(`/clients-initial-access/${id}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete client initial access token: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Client Registration Policy API for Keycloak Admin SDK
 * Provides methods for managing client registration policies in Keycloak
 */
/**
 * API for managing Keycloak client registration policies
 */
class ClientRegistrationPolicyApi {
    sdk;
    /**
     * Creates a new instance of the Client Registration Policy API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all client registration policy providers
     * Base path for retrieve providers with the configProperties properly filled
     *
     * Endpoint: GET /{realm}/client-registration-policy/providers
     *
     * @returns {Promise<ComponentTypeRepresentation[]>} List of client registration policy providers
     * @throws {Error} If the request fails
     */
    async getProviders() {
        try {
            return this.sdk.request('/client-registration-policy/providers', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client registration policy providers: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Client Scopes API for Keycloak Admin SDK
 * Provides methods for managing client scopes in Keycloak
 */
/**
 * API for managing Keycloak client scopes
 */
class ClientScopesApi {
    sdk;
    /**
     * Creates a new instance of the Client Scopes API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all client scopes in a realm
     *
     * Endpoint: GET /{realm}/client-scopes
     *
     * @returns {Promise<ClientScopeRepresentation[]>} List of client scopes
     * @throws {Error} If the request fails
     */
    async findAll() {
        try {
            return this.sdk.request('/client-scopes', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client scopes: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new client scope
     *
     * Endpoint: POST /{realm}/client-scopes
     *
     * @param {ClientScopeRepresentation} clientScope - The client scope to create
     * @returns {Promise<string>} The ID of the created client scope
     * @throws {Error} If the request fails or client scope data is invalid
     */
    async create(clientScope) {
        if (!clientScope) {
            throw new Error('Client scope data is required');
        }
        if (!clientScope.name) {
            throw new Error('Client scope name is required');
        }
        try {
            // Make the request to create the client scope
            return await this.sdk.request('/client-scopes', 'POST', clientScope);
        }
        catch (error) {
            throw new Error(`Failed to create client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a client scope by ID
     *
     * Endpoint: GET /{realm}/client-scopes/{id}
     *
     * @param {string} id - The client scope ID
     * @returns {Promise<ClientScopeRepresentation>} The client scope representation
     * @throws {Error} If the request fails or ID is invalid
     */
    async findById(id) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        try {
            return this.sdk.request(`/client-scopes/${id}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update a client scope
     *
     * Endpoint: PUT /{realm}/client-scopes/{id}
     *
     * @param {string} id - The client scope ID
     * @param {ClientScopeRepresentation} clientScope - The updated client scope data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async update(id, clientScope) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        if (!clientScope) {
            throw new Error('Client scope data is required');
        }
        try {
            await this.sdk.request(`/client-scopes/${id}`, 'PUT', clientScope);
        }
        catch (error) {
            throw new Error(`Failed to update client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete a client scope
     *
     * Endpoint: DELETE /{realm}/client-scopes/{id}
     *
     * @param {string} id - The client scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or ID is invalid
     */
    async delete(id) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        try {
            await this.sdk.request(`/client-scopes/${id}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get protocol mappers for a client scope
     *
     * Endpoint: GET /{realm}/client-scopes/{id}/protocol-mappers/models
     *
     * @param {string} id - The client scope ID
     * @returns {Promise<ProtocolMapperRepresentation[]>} List of protocol mappers
     * @throws {Error} If the request fails or ID is invalid
     */
    async getProtocolMappers(id) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        try {
            return this.sdk.request(`/client-scopes/${id}/protocol-mappers/models`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get protocol mappers: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a protocol mapper for a client scope
     *
     * Endpoint: POST /{realm}/client-scopes/{id}/protocol-mappers/models
     *
     * @param {string} id - The client scope ID
     * @param {ProtocolMapperRepresentation} mapper - The protocol mapper to create
     * @returns {Promise<string>} The ID of the created protocol mapper
     * @throws {Error} If the request fails or parameters are invalid
     */
    async createProtocolMapper(id, mapper) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        if (!mapper) {
            throw new Error('Protocol mapper data is required');
        }
        if (!mapper.name) {
            throw new Error('Protocol mapper name is required');
        }
        if (!mapper.protocol) {
            throw new Error('Protocol mapper protocol is required');
        }
        try {
            // Create the protocol mapper
            await this.sdk.request(`/client-scopes/${id}/protocol-mappers/models`, 'POST', mapper);
            // Get all protocol mappers to find the ID of the one we just created
            const mappers = await this.getProtocolMappers(id);
            const createdMapper = mappers.find(m => m.name === mapper.name);
            if (createdMapper && createdMapper.id) {
                return createdMapper.id;
            }
            throw new Error('Protocol mapper was created but ID could not be retrieved');
        }
        catch (error) {
            throw new Error(`Failed to create protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a protocol mapper by ID for a client scope
     *
     * Endpoint: GET /{realm}/client-scopes/{id}/protocol-mappers/models/{mapperId}
     *
     * @param {string} id - The client scope ID
     * @param {string} mapperId - The protocol mapper ID
     * @returns {Promise<ProtocolMapperRepresentation>} The protocol mapper representation
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getProtocolMapper(id, mapperId) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        if (!mapperId) {
            throw new Error('Protocol mapper ID is required');
        }
        try {
            return this.sdk.request(`/client-scopes/${id}/protocol-mappers/models/${mapperId}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update a protocol mapper for a client scope
     *
     * Endpoint: PUT /{realm}/client-scopes/{id}/protocol-mappers/models/{mapperId}
     *
     * @param {string} id - The client scope ID
     * @param {string} mapperId - The protocol mapper ID
     * @param {ProtocolMapperRepresentation} mapper - The updated protocol mapper data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async updateProtocolMapper(id, mapperId, mapper) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        if (!mapperId) {
            throw new Error('Protocol mapper ID is required');
        }
        if (!mapper) {
            throw new Error('Protocol mapper data is required');
        }
        try {
            // First get the current mapper to ensure we have all required fields
            const currentMapper = await this.getProtocolMapper(id, mapperId);
            // Create a merged mapper with current values and updates
            // This follows the Open/Closed principle by extending functionality without modifying existing code
            const updatedMapper = {
                ...currentMapper,
                // Override with new values from the mapper parameter
                ...mapper,
                // Ensure ID is preserved
                id: mapperId
            };
            // Send the update request
            await this.sdk.request(`/client-scopes/${id}/protocol-mappers/models/${mapperId}`, 'PUT', updatedMapper);
        }
        catch (error) {
            // Provide detailed error information for better debugging
            if (error instanceof Error) {
                throw new Error(`Failed to update protocol mapper: ${error.message}${error.stack ? '\n' + error.stack : ''}`);
            }
            else {
                throw new Error(`Failed to update protocol mapper: ${String(error)}`);
            }
        }
    }
    /**
     * Delete a protocol mapper from a client scope
     *
     * Endpoint: DELETE /{realm}/client-scopes/{id}/protocol-mappers/models/{mapperId}
     *
     * @param {string} id - The client scope ID
     * @param {string} mapperId - The protocol mapper ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async deleteProtocolMapper(id, mapperId) {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        if (!mapperId) {
            throw new Error('Protocol mapper ID is required');
        }
        try {
            await this.sdk.request(`/client-scopes/${id}/protocol-mappers/models/${mapperId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Client Role Mappings API
 *
 * This module provides methods to manage client role mappings for users and groups in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Client Role Mappings API
 *
 * Provides methods to manage client role mappings for users and groups
 */
class ClientRoleMappingsApi {
    sdk;
    /**
     * Constructor for ClientRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get client-level role mappings for a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of role representations
     */
    async getUserClientRoleMappings(userId, clientId) {
        if (!userId)
            throw new Error('User ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        return this.sdk.request(`/users/${userId}/role-mappings/clients/${clientId}`, 'GET');
    }
    /**
     * Add client-level roles to a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addUserClientRoleMappings(userId, clientId, roles) {
        if (!userId)
            throw new Error('User ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        await this.sdk.request(`/users/${userId}/role-mappings/clients/${clientId}`, 'POST', roles);
    }
    /**
     * Delete client-level roles from a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async deleteUserClientRoleMappings(userId, clientId, roles) {
        if (!userId)
            throw new Error('User ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        await this.sdk.request(`/users/${userId}/role-mappings/clients/${clientId}`, 'DELETE', roles);
    }
    /**
     * Get available client-level roles that can be mapped to a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of available role representations
     */
    async getAvailableUserClientRoleMappings(userId, clientId) {
        if (!userId)
            throw new Error('User ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        return this.sdk.request(`/users/${userId}/role-mappings/clients/${clientId}/available`, 'GET');
    }
    /**
     * Get effective client-level role mappings for a user (including composite roles)
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of effective role representations
     */
    async getEffectiveUserClientRoleMappings(userId, clientId, briefRepresentation = true) {
        if (!userId)
            throw new Error('User ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        const queryParams = briefRepresentation ? '' : '?briefRepresentation=false';
        return this.sdk.request(`/users/${userId}/role-mappings/clients/${clientId}/composite${queryParams}`, 'GET');
    }
    /**
     * Get client-level role mappings for a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of role representations
     */
    async getGroupClientRoleMappings(groupId, clientId) {
        if (!groupId)
            throw new Error('Group ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        return this.sdk.request(`/groups/${groupId}/role-mappings/clients/${clientId}`, 'GET');
    }
    /**
     * Add client-level roles to a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addGroupClientRoleMappings(groupId, clientId, roles) {
        if (!groupId)
            throw new Error('Group ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        await this.sdk.request(`/groups/${groupId}/role-mappings/clients/${clientId}`, 'POST', roles);
    }
    /**
     * Delete client-level roles from a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async deleteGroupClientRoleMappings(groupId, clientId, roles) {
        if (!groupId)
            throw new Error('Group ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        await this.sdk.request(`/groups/${groupId}/role-mappings/clients/${clientId}`, 'DELETE', roles);
    }
    /**
     * Get available client-level roles that can be mapped to a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of available role representations
     */
    async getAvailableGroupClientRoleMappings(groupId, clientId) {
        if (!groupId)
            throw new Error('Group ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        return this.sdk.request(`/groups/${groupId}/role-mappings/clients/${clientId}/available`, 'GET');
    }
    /**
     * Get effective client-level role mappings for a group (including composite roles)
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of effective role representations
     */
    async getEffectiveGroupClientRoleMappings(groupId, clientId, briefRepresentation = true) {
        if (!groupId)
            throw new Error('Group ID is required');
        if (!clientId)
            throw new Error('Client ID is required');
        const queryParams = briefRepresentation ? '' : '?briefRepresentation=false';
        return this.sdk.request(`/groups/${groupId}/role-mappings/clients/${clientId}/composite${queryParams}`, 'GET');
    }
}

/**
 * Clients API for Keycloak Admin SDK
 * Provides methods for managing clients in Keycloak
 */
/**
 * API for managing Keycloak clients
 */
class ClientsApi {
    sdk;
    /**
     * Client certificates API for managing client certificates
     */
    certificates;
    /**
     * Client initial access API for managing client registration tokens
     */
    initialAccess;
    /**
     * Client registration policy API for managing registration policies
     */
    registrationPolicy;
    /**
     * API for managing Keycloak client scopes
     */
    clientScopes;
    /**
     * Client Role Mappings API
     */
    clientRoleMappings;
    /**
     * Creates a new instance of the Clients API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
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
    async findAll(clientId, first, max) {
        try {
            let endpoint = '/clients';
            const queryParams = [];
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
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get clients: ${error instanceof Error ? error.message : String(error)}`);
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
    async create(client) {
        if (!client) {
            throw new Error('Client data is required');
        }
        if (!client.clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return await this.sdk.request('/clients', 'POST', client);
        }
        catch (error) {
            throw new Error(`Failed to create client: ${error instanceof Error ? error.message : String(error)}`);
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
    async findById(id) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/clients/${id}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client: ${error instanceof Error ? error.message : String(error)}`);
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
    async update(id, client) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        if (!client) {
            throw new Error('Client data is required');
        }
        try {
            await this.sdk.request(`/clients/${id}`, 'PUT', client);
        }
        catch (error) {
            throw new Error(`Failed to update client: ${error instanceof Error ? error.message : String(error)}`);
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
    async delete(id) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            await this.sdk.request(`/clients/${id}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete client: ${error instanceof Error ? error.message : String(error)}`);
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
    async getClientSecret(id) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/clients/${id}/client-secret`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client secret: ${error instanceof Error ? error.message : String(error)}`);
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
    async generateClientSecret(id) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/clients/${id}/client-secret`, 'POST');
        }
        catch (error) {
            throw new Error(`Failed to generate client secret: ${error instanceof Error ? error.message : String(error)}`);
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
    async getDefaultClientScopes(id) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/clients/${id}/default-client-scopes`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get default client scopes: ${error instanceof Error ? error.message : String(error)}`);
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
    async addDefaultClientScope(id, scopeId) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        if (!scopeId) {
            throw new Error('Scope ID is required');
        }
        try {
            await this.sdk.request(`/clients/${id}/default-client-scopes/${scopeId}`, 'PUT');
        }
        catch (error) {
            throw new Error(`Failed to add default client scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async removeDefaultClientScope(id, scopeId) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        if (!scopeId) {
            throw new Error('Scope ID is required');
        }
        try {
            await this.sdk.request(`/clients/${id}/default-client-scopes/${scopeId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to remove default client scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async getOptionalClientScopes(id) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/clients/${id}/optional-client-scopes`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get optional client scopes: ${error instanceof Error ? error.message : String(error)}`);
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
    async addOptionalClientScope(id, scopeId) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        if (!scopeId) {
            throw new Error('Scope ID is required');
        }
        try {
            await this.sdk.request(`/clients/${id}/optional-client-scopes/${scopeId}`, 'PUT');
        }
        catch (error) {
            throw new Error(`Failed to add optional client scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async removeOptionalClientScope(id, scopeId) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        if (!scopeId) {
            throw new Error('Scope ID is required');
        }
        try {
            await this.sdk.request(`/clients/${id}/optional-client-scopes/${scopeId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to remove optional client scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async getUserSessions(id, first, max) {
        if (!id) {
            throw new Error('Client ID is required');
        }
        try {
            let endpoint = `/clients/${id}/user-sessions`;
            const queryParams = [];
            if (first !== undefined) {
                queryParams.push(`first=${first}`);
            }
            if (max !== undefined) {
                queryParams.push(`max=${max}`);
            }
            if (queryParams.length > 0) {
                endpoint += `?${queryParams.join('&')}`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get user sessions: ${error instanceof Error ? error.message : String(error)}`);
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
    async getRegistrationAccessToken(clientId) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request('/clients/registration-access-token', 'POST', {
                clientId
            });
        }
        catch (error) {
            throw new Error(`Failed to get registration access token: ${error instanceof Error ? error.message : String(error)}`);
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
    async listRoles(clientId) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/clients/${clientId}/roles`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to list roles for client: ${error instanceof Error ? error.message : String(error)}`);
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
    async getRole(clientId, roleName) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roleName) {
            throw new Error('Role name is required');
        }
        try {
            return this.sdk.request(`/clients/${clientId}/roles/${roleName}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get role: ${error instanceof Error ? error.message : String(error)}`);
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
    async createRole(clientId, role) {
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
            await this.sdk.request(`/clients/${clientId}/roles`, 'POST', role);
            // Get the created role to return its ID
            const createdRole = await this.getRole(clientId, role.name);
            return createdRole.id || '';
        }
        catch (error) {
            throw new Error(`Failed to create role: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateRole(clientId, roleName, role) {
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
            await this.sdk.request(`/clients/${clientId}/roles/${roleName}`, 'PUT', role);
        }
        catch (error) {
            throw new Error(`Failed to update role: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteRole(clientId, roleName) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roleName) {
            throw new Error('Role name is required');
        }
        try {
            await this.sdk.request(`/clients/${clientId}/roles/${roleName}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Organizations API for Keycloak Admin SDK
 *
 * This module provides methods to manage organizations in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */
/**
 * Organizations API
 *
 * Provides methods to manage organizations in Keycloak
 */
class OrganizationsApi {
    sdk;
    /**
     * Constructor for OrganizationsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all organizations with optional filtering
     *
     * Endpoint: GET /{realm}/organizations
     *
     * @param query - Query parameters for filtering organizations
     * @returns Promise resolving to an array of organization representations
     */
    async list(query) {
        try {
            let endpoint = '/organizations';
            const queryParams = [];
            if (query) {
                if (query.search) {
                    queryParams.push(`search=${encodeURIComponent(query.search)}`);
                }
                if (query.first !== undefined) {
                    queryParams.push(`first=${query.first}`);
                }
                if (query.max !== undefined) {
                    queryParams.push(`max=${query.max}`);
                }
                if (query.exact !== undefined) {
                    queryParams.push(`exact=${query.exact}`);
                }
            }
            if (queryParams.length > 0) {
                endpoint += `?${queryParams.join('&')}`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error('Error listing organizations:', error);
            throw new Error(`Failed to list organizations: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new organization
     *
     * Endpoint: POST /{realm}/organizations
     *
     * @param organization - Organization representation to create
     * @returns Promise resolving to the ID of the created organization
     */
    async create(organization) {
        if (!organization) {
            throw new Error('Organization data is required');
        }
        if (!organization.name) {
            throw new Error('Organization name is required');
        }
        try {
            // Make the POST request to create the organization
            // Keycloak returns a 201 Created with a Location header containing the organization ID
            // Our enhanced request utility will extract the ID from the Location header
            const result = await this.sdk.request('/organizations', 'POST', organization);
            if (result && result.id) {
                return result.id;
            }
            // Fallback to finding the organization by name if the ID wasn't extracted from the Location header
            const organizations = await this.list({ search: organization.name, exact: true });
            const createdOrg = organizations.find(org => org.name === organization.name);
            if (createdOrg && createdOrg.id) {
                return createdOrg.id;
            }
            throw new Error('Organization was created but could not be found');
        }
        catch (error) {
            console.error('Error creating organization:', error);
            throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get an organization by ID
     *
     * Endpoint: GET /{realm}/organizations/{id}
     *
     * @param id - Organization ID
     * @returns Promise resolving to the organization representation
     */
    async get(id) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        try {
            return this.sdk.request(`/organizations/${id}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting organization with ID ${id}:`, error);
            throw new Error(`Failed to get organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update an organization
     *
     * Endpoint: PUT /{realm}/organizations/{id}
     *
     * @param id - Organization ID
     * @param organization - Updated organization representation
     * @returns Promise resolving when the update is complete
     */
    async update(id, organization) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!organization) {
            throw new Error('Organization data is required');
        }
        try {
            await this.sdk.request(`/organizations/${id}`, 'PUT', organization);
        }
        catch (error) {
            console.error(`Error updating organization with ID ${id}:`, error);
            throw new Error(`Failed to update organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete an organization
     *
     * Endpoint: DELETE /{realm}/organizations/{id}
     *
     * @param id - Organization ID
     * @returns Promise resolving when the deletion is complete
     */
    async delete(id) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        try {
            await this.sdk.request(`/organizations/${id}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error deleting organization with ID ${id}:`, error);
            throw new Error(`Failed to delete organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get organization members
     *
     * Endpoint: GET /{realm}/organizations/{id}/members
     *
     * @param id - Organization ID
     * @param first - First result index (optional)
     * @param max - Maximum number of results (optional)
     * @returns Promise resolving to an array of organization member representations
     */
    async getMembers(id, first, max) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        try {
            let endpoint = `/organizations/${id}/members`;
            const queryParams = [];
            if (first !== undefined) {
                queryParams.push(`first=${first}`);
            }
            if (max !== undefined) {
                queryParams.push(`max=${max}`);
            }
            if (queryParams.length > 0) {
                endpoint += `?${queryParams.join('&')}`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting members for organization with ID ${id}:`, error);
            throw new Error(`Failed to get organization members: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add a member to an organization
     *
     * Endpoint: POST /{realm}/organizations/{id}/members/{userId}
     *
     * @param id - Organization ID
     * @param userId - User ID to add as member
     * @returns Promise resolving when the member is added
     */
    async addMember(id, userId) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            // Using raw data flag as the last parameter
            await this.sdk.request(`/organizations/${id}/members`, 'POST', userId);
        }
        catch (error) {
            console.error(`Error adding member ${userId} to organization ${id}:`, error);
            throw new Error(`Failed to add organization member: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove a member from an organization
     *
     * Endpoint: DELETE /{realm}/organizations/{id}/members/{userId}
     *
     * @param id - Organization ID
     * @param userId - User ID to remove
     * @returns Promise resolving when the member is removed
     */
    async removeMember(id, userId) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            await this.sdk.request(`/organizations/${id}/members/${userId}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error removing member ${userId} from organization ${id}:`, error);
            throw new Error(`Failed to remove organization member: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Invite an existing user to the organization
     *
     * Endpoint: POST /{realm}/organizations/{id}/members/invite-existing-user
     *
     * @param id - Organization ID
     * @param userId - User ID to invite
     * @returns Promise resolving when the invitation is sent
     */
    async inviteExistingUser(id, userId) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            // The API expects a form parameter 'id'
            const formData = new URLSearchParams();
            formData.append('id', userId);
            await this.sdk.request(`/organizations/${id}/members/invite-existing-user`, 'POST', formData.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        }
        catch (error) {
            console.error(`Error inviting existing user ${userId} to organization ${id}:`, error);
            throw new Error(`Failed to invite existing user to organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Invite a user to the organization by email
     *
     * Endpoint: POST /{realm}/organizations/{id}/members/invite-user
     *
     * If the user with the given e-mail address exists, it sends an invitation link,
     * otherwise it sends a registration link.
     *
     * @param id - Organization ID
     * @param email - Email address of the user to invite
     * @param firstName - Optional first name for new users
     * @param lastName - Optional last name for new users
     * @returns Promise resolving when the invitation is sent
     */
    async inviteUser(id, email, firstName, lastName) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!email) {
            throw new Error('Email is required');
        }
        try {
            // The API expects form parameters
            const formData = new URLSearchParams();
            formData.append('email', email);
            if (firstName) {
                formData.append('firstName', firstName);
            }
            if (lastName) {
                formData.append('lastName', lastName);
            }
            await this.sdk.request(`/organizations/${id}/members/invite-user`, 'POST', formData.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        }
        catch (error) {
            console.error(`Error inviting user with email ${email} to organization ${id}:`, error);
            throw new Error(`Failed to invite user to organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get all identity providers associated with an organization
     *
     * Endpoint: GET /{realm}/organizations/{id}/identity-providers
     *
     * @param id - Organization ID
     * @returns Promise resolving to an array of identity provider representations
     */
    async getIdentityProviders(id) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        try {
            return this.sdk.request(`/organizations/${id}/identity-providers`, 'GET');
        }
        catch (error) {
            console.error(`Error getting identity providers for organization ${id}:`, error);
            throw new Error(`Failed to get organization identity providers: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a specific identity provider associated with an organization
     *
     * Endpoint: GET /{realm}/organizations/{id}/identity-providers/{alias}
     *
     * @param id - Organization ID
     * @param alias - Identity provider alias
     * @returns Promise resolving to the identity provider representation
     */
    async getIdentityProvider(id, alias) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            return this.sdk.request(`/organizations/${id}/identity-providers/${alias}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting identity provider ${alias} for organization ${id}:`, error);
            throw new Error(`Failed to get organization identity provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add an identity provider to an organization
     *
     * Endpoint: POST /{realm}/organizations/{id}/identity-providers
     *
     * @param id - Organization ID
     * @param providerAlias - Identity provider alias
     * @returns Promise resolving when the identity provider is added
     */
    async addIdentityProvider(id, providerAlias) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!providerAlias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            await this.sdk.request(`/organizations/${id}/identity-providers`, 'POST', providerAlias);
        }
        catch (error) {
            console.error(`Error adding identity provider ${providerAlias} to organization ${id}:`, error);
            throw new Error(`Failed to add identity provider to organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove an identity provider from an organization
     *
     * Endpoint: DELETE /{realm}/organizations/{id}/identity-providers/{alias}
     *
     * @param id - Organization ID
     * @param alias - Identity provider alias
     * @returns Promise resolving when the identity provider is removed
     */
    async removeIdentityProvider(id, alias) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            await this.sdk.request(`/organizations/${id}/identity-providers/${alias}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error removing identity provider ${alias} from organization ${id}:`, error);
            throw new Error(`Failed to remove identity provider from organization: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get the count of members in an organization
     *
     * Endpoint: GET /{realm}/organizations/{id}/members/count
     *
     * @param id - Organization ID
     * @returns Promise resolving to the number of members in the organization
     */
    async getMembersCount(id) {
        if (!id) {
            throw new Error('Organization ID is required');
        }
        try {
            return this.sdk.request(`/organizations/${id}/members/count`, 'GET');
        }
        catch (error) {
            console.error(`Error getting members count for organization ${id}:`, error);
            throw new Error(`Failed to get organization members count: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Identity Providers API for Keycloak Admin SDK
 *
 * This module provides methods to manage identity providers in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_identity_providers
 */
/**
 * Identity Providers API
 *
 * Provides methods to manage identity providers in Keycloak
 */
class IdentityProvidersApi {
    sdk;
    /**
     * Constructor for IdentityProvidersApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all identity providers
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances
     *
     * @returns Promise resolving to an array of identity provider representations
     * @param options
     */
    async findAll(options) {
        try {
            return this.sdk.request('/identity-provider/instances', 'GET', undefined, options);
        }
        catch (error) {
            console.error('Error listing identity providers:', error);
            throw new Error(`Failed to list identity providers: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new identity provider
     *
     * Endpoint: POST /admin/realms/{realm}/identity-provider/instances
     *
     * @param provider - Identity provider representation to create
     * @returns Promise resolving to the alias of the created identity provider
     */
    async create(provider) {
        if (!provider) {
            throw new Error('Identity provider data is required');
        }
        if (!provider.alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            // Make the POST request to create the identity provider
            // Keycloak returns a 201 Created status
            await this.sdk.request('/identity-provider/instances', 'POST', provider);
            // Return the alias as the identifier
            return provider.alias;
        }
        catch (error) {
            console.error('Error creating identity provider:', error);
            throw new Error(`Failed to create identity provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get an identity provider by alias
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving to the identity provider representation
     */
    async get(alias) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            return this.sdk.request(`/identity-provider/instances/${alias}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting identity provider with alias ${alias}:`, error);
            throw new Error(`Failed to get identity provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update an identity provider
     *
     * Endpoint: PUT /admin/realms/{realm}/identity-provider/instances/{alias}
     *
     * @param alias - Identity provider alias
     * @param provider - Updated identity provider representation
     * @returns Promise resolving when the update is complete
     */
    async update(alias, provider) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        if (!provider) {
            throw new Error('Identity provider data is required');
        }
        try {
            await this.sdk.request(`/identity-provider/instances/${alias}`, 'PUT', provider);
        }
        catch (error) {
            console.error(`Error updating identity provider with alias ${alias}:`, error);
            throw new Error(`Failed to update identity provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete an identity provider
     *
     * Endpoint: DELETE /admin/realms/{realm}/identity-provider/instances/{alias}
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving when the deletion is complete
     */
    async delete(alias) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            await this.sdk.request(`/identity-provider/instances/${alias}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error deleting identity provider with alias ${alias}:`, error);
            throw new Error(`Failed to delete identity provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get the factory for a specific identity provider type
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/providers/{provider_id}
     *
     * @param providerId - Identity provider type ID (e.g., 'oidc', 'saml')
     * @returns Promise resolving to the identity provider factory
     */
    async getProviderFactory(providerId) {
        if (!providerId) {
            throw new Error('Provider ID is required');
        }
        try {
            return this.sdk.request(`/identity-provider/providers/${providerId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting provider factory for ${providerId}:`, error);
            throw new Error(`Failed to get provider factory: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a specific provider type
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/providers/{provider_id}
     *
     * @param providerId - The ID of the provider type to get
     * @returns Promise resolving to the provider type configuration
     */
    async getProviderType(providerId) {
        if (!providerId) {
            throw new Error('Provider ID is required');
        }
        try {
            return this.sdk.request(`/identity-provider/providers/${providerId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting provider type ${providerId}:`, error);
            throw new Error(`Failed to get provider type: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Import an identity provider from a JSON file
     *
     * Endpoint: POST /admin/realms/{realm}/identity-provider/import-config
     *
     * @param providerJson - JSON string containing the provider configuration
     * @returns Promise resolving to the imported identity provider representation
     */
    async importFromJson(providerJson) {
        if (!providerJson) {
            throw new Error('Provider JSON is required');
        }
        try {
            const formData = new FormData();
            const blob = new Blob([providerJson], { type: 'application/json' });
            formData.append('file', blob);
            return this.sdk.request('/identity-provider/import-config', 'POST', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        catch (error) {
            console.error('Error importing identity provider from JSON:', error);
            throw new Error(`Failed to import identity provider: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get all mappers for an identity provider
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mappers
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving to an array of identity provider mapper representations
     */
    async getMappers(alias) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            return this.sdk.request(`/identity-provider/instances/${alias}/mappers`, 'GET');
        }
        catch (error) {
            console.error(`Error getting mappers for identity provider ${alias}:`, error);
            throw new Error(`Failed to get identity provider mappers: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new mapper for an identity provider
     *
     * Endpoint: POST /admin/realms/{realm}/identity-provider/instances/{alias}/mappers
     *
     * @param alias - Identity provider alias
     * @param mapper - Identity provider mapper representation to create
     * @returns Promise resolving to the ID of the created mapper
     */
    async createMapper(alias, mapper) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        if (!mapper) {
            throw new Error('Mapper data is required');
        }
        try {
            // According to the Keycloak API, this endpoint returns 201 Created with the ID in the response
            return this.sdk.request(`/identity-provider/instances/${alias}/mappers`, 'POST', mapper);
        }
        catch (error) {
            console.error(`Error creating mapper for identity provider ${alias}:`, error);
            throw new Error(`Failed to create identity provider mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a specific mapper for an identity provider
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
     *
     * @param alias - Identity provider alias
     * @param id - Mapper ID
     * @returns Promise resolving to the identity provider mapper representation
     */
    async getMapper(alias, id) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        if (!id) {
            throw new Error('Mapper ID is required');
        }
        try {
            return this.sdk.request(`/identity-provider/instances/${alias}/mappers/${id}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting mapper ${id} for identity provider ${alias}:`, error);
            throw new Error(`Failed to get identity provider mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update a mapper for an identity provider
     *
     * Endpoint: PUT /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
     *
     * @param alias - Identity provider alias
     * @param id - Mapper ID
     * @param mapper - Updated identity provider mapper representation
     * @returns Promise resolving when the update is complete
     */
    async updateMapper(alias, id, mapper) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        if (!id) {
            throw new Error('Mapper ID is required');
        }
        if (!mapper) {
            throw new Error('Mapper data is required');
        }
        try {
            await this.sdk.request(`/identity-provider/instances/${alias}/mappers/${id}`, 'PUT', mapper);
        }
        catch (error) {
            console.error(`Error updating mapper ${id} for identity provider ${alias}:`, error);
            throw new Error(`Failed to update identity provider mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete a mapper for an identity provider
     *
     * Endpoint: DELETE /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
     *
     * @param alias - Identity provider alias
     * @param id - Mapper ID
     * @returns Promise resolving when the deletion is complete
     */
    async deleteMapper(alias, id) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        if (!id) {
            throw new Error('Mapper ID is required');
        }
        try {
            await this.sdk.request(`/identity-provider/instances/${alias}/mappers/${id}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error deleting mapper ${id} for identity provider ${alias}:`, error);
            throw new Error(`Failed to delete identity provider mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available mapper types for an identity provider
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mapper-types
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving to a map of identity provider mapper type representations
     */
    async getMapperTypes(alias) {
        if (!alias) {
            throw new Error('Identity provider alias is required');
        }
        try {
            // According to the Keycloak API documentation, this returns a Map of mapper types
            return this.sdk.request(`/identity-provider/instances/${alias}/mapper-types`, 'GET');
        }
        catch (error) {
            console.error(`Error getting mapper types for identity provider ${alias}:`, error);
            throw new Error(`Failed to get identity provider mapper types: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Roles by ID API for Keycloak Admin SDK
 *
 * This module provides methods to manage roles directly by their ID in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Roles by ID API class
 *
 * Provides methods to manage roles directly by their ID in Keycloak
 */
class RolesByIdApi {
    sdk;
    /**
     * Constructor for RolesByIdApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get a specific role by ID
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}
     *
     * @param roleId - ID of the role
     * @returns Promise resolving to the role representation
     */
    async get(roleId) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        try {
            return this.sdk.request(`/roles-by-id/${roleId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting role by ID ${roleId}:`, error);
            throw new Error(`Failed to get role by ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update a role by ID
     *
     * Endpoint: PUT /{realm}/roles-by-id/{role-id}
     *
     * @param roleId - ID of the role
     * @param role - Updated role representation
     * @returns Promise resolving when the operation completes
     */
    async update(roleId, role) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        if (!role) {
            throw new Error('Role representation is required');
        }
        try {
            await this.sdk.request(`/roles-by-id/${roleId}`, 'PUT', role);
        }
        catch (error) {
            console.error(`Error updating role by ID ${roleId}:`, error);
            throw new Error(`Failed to update role by ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete a role by ID
     *
     * Endpoint: DELETE /{realm}/roles-by-id/{role-id}
     *
     * @param roleId - ID of the role
     * @returns Promise resolving when the operation completes
     */
    async delete(roleId) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        try {
            await this.sdk.request(`/roles-by-id/${roleId}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error deleting role by ID ${roleId}:`, error);
            throw new Error(`Failed to delete role by ID: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get role composites
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites
     *
     * @param roleId - ID of the role
     * @param query - Optional query parameters
     * @returns Promise resolving to an array of role representations
     */
    async getComposites(roleId, query) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        try {
            // Convert query object to query string for proper request handling
            let endpoint = `/roles-by-id/${roleId}/composites`;
            if (query) {
                const queryParams = [];
                if (query.first !== undefined)
                    queryParams.push(`first=${query.first}`);
                if (query.max !== undefined)
                    queryParams.push(`max=${query.max}`);
                if (query.search)
                    queryParams.push(`search=${encodeURIComponent(query.search)}`);
                if (queryParams.length > 0) {
                    endpoint += `?${queryParams.join('&')}`;
                }
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting role composites for role ID ${roleId}:`, error);
            throw new Error(`Failed to get role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add composites to a role
     *
     * Endpoint: POST /{realm}/roles-by-id/{role-id}/composites
     *
     * @param roleId - ID of the role
     * @param roles - Array of roles to add as composites
     * @returns Promise resolving when the operation completes
     */
    async addComposites(roleId, roles) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`/roles-by-id/${roleId}/composites`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding composites to role ID ${roleId}:`, error);
            throw new Error(`Failed to add role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove composites from a role
     *
     * Endpoint: DELETE /{realm}/roles-by-id/{role-id}/composites
     *
     * @param roleId - ID of the role
     * @param roles - Array of roles to remove from composites
     * @returns Promise resolving when the operation completes
     */
    async removeComposites(roleId, roles) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`/roles-by-id/${roleId}/composites`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error removing composites from role ID ${roleId}:`, error);
            throw new Error(`Failed to remove role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get realm-level role composites
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites/realm
     *
     * @param roleId - ID of the role
     * @returns Promise resolving to an array of role representations
     */
    async getRealmRoleComposites(roleId) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        try {
            return this.sdk.request(`/roles-by-id/${roleId}/composites/realm`, 'GET');
        }
        catch (error) {
            console.error(`Error getting realm role composites for role ID ${roleId}:`, error);
            throw new Error(`Failed to get realm role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get client-level role composites for a specific client
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites/clients/{clientId}
     *
     * @param roleId - ID of the role
     * @param clientId - ID of the client
     * @returns Promise resolving to an array of role representations
     */
    async getClientRoleComposites(roleId, clientId) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/roles-by-id/${roleId}/composites/clients/${clientId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting client role composites for role ID ${roleId} and client ${clientId}:`, error);
            throw new Error(`Failed to get client role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get role permissions
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/management/permissions
     *
     * @param roleId - ID of the role
     * @returns Promise resolving to the management permission reference
     */
    async getPermissions(roleId) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        try {
            const endpoint = `/roles-by-id/${roleId}/management/permissions`;
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting permissions for role ID ${roleId}:`, error);
            // Log more detailed error information
            if (error instanceof Error) {
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
            throw error; // Rethrow the original error for proper debugging
        }
    }
    /**
     * Update role permissions
     *
     * Endpoint: PUT /{realm}/roles-by-id/{role-id}/management/permissions
     *
     * @param roleId - ID of the role
     * @param permissions - Management permission reference
     * @returns Promise resolving to the updated management permission reference
     */
    async updatePermissions(roleId, permissions) {
        if (!roleId) {
            throw new Error('Role ID is required');
        }
        if (!permissions) {
            throw new Error('Permissions are required');
        }
        try {
            const endpoint = `/roles-by-id/${roleId}/management/permissions`;
            return this.sdk.request(endpoint, 'PUT', permissions);
        }
        catch (error) {
            console.error(`Error updating permissions for role ID ${roleId}:`, error);
            // Log more detailed error information
            if (error instanceof Error) {
                console.error('Error name:', error.name);
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
            throw error; // Rethrow the original error for proper debugging
        }
    }
}

/**
 * Roles API for Keycloak Admin SDK
 *
 * This module provides methods to manage realm and client roles in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_roles
 */
/**
 * Roles API
 *
 * Provides methods to manage realm and client roles in Keycloak
 */
class RolesApi {
    sdk;
    /**
     * Roles by ID API for direct ID-based operations
     */
    byId;
    /**
     * Constructor for RolesApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
        this.byId = new RolesByIdApi(sdk);
    }
    /**
     * Get all realm roles
     *
     * Endpoint: GET /{realm}/roles
     *
     * @param query - Query parameters for filtering roles
     * @returns Promise resolving to an array of role representations
     */
    async list(query) {
        try {
            let endpoint = '/roles';
            const queryParams = [];
            if (query) {
                if (query.search) {
                    queryParams.push(`search=${encodeURIComponent(query.search)}`);
                }
                if (query.first !== undefined) {
                    queryParams.push(`first=${query.first}`);
                }
                if (query.max !== undefined) {
                    queryParams.push(`max=${query.max}`);
                }
                if (query.briefRepresentation !== undefined) {
                    queryParams.push(`briefRepresentation=${query.briefRepresentation}`);
                }
            }
            if (queryParams.length > 0) {
                endpoint += `?${queryParams.join('&')}`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error('Error listing realm roles:', error);
            throw new Error(`Failed to list realm roles: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Create a new realm role
     *
     * Endpoint: POST /{realm}/roles
     *
     * @param role - Role representation to create
     * @returns Promise resolving to the ID of the created role
     */
    async create(role) {
        if (!role) {
            throw new Error('Role data is required');
        }
        if (!role.name) {
            throw new Error('Role name is required');
        }
        try {
            // Make the POST request to create the role
            // Keycloak returns a 201 Created with a Location header containing the role ID
            // Our enhanced request utility will extract the ID from the Location header
            await this.sdk.request('/roles', 'POST', role);
            // Get the created role to return its ID
            const createdRole = await this.getByName(role.name);
            if (!createdRole || !createdRole.id) {
                throw new Error(`Role was created but could not be found by name: ${role.name}`);
            }
            return createdRole.id;
        }
        catch (error) {
            console.error('Error creating realm role:', error);
            throw new Error(`Failed to create realm role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get a realm role by name
     *
     * Endpoint: GET /{realm}/roles/{role-name}
     *
     * @param name - Role name
     * @returns Promise resolving to the role representation
     */
    async getByName(name) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            return this.sdk.request(`/roles/${name}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting realm role by name ${name}:`, error);
            throw new Error(`Failed to get realm role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update a realm role
     *
     * Endpoint: PUT /{realm}/roles/{role-name}
     *
     * @param name - Role name
     * @param role - Updated role representation
     * @returns Promise resolving when the update is complete
     */
    async update(name, role) {
        if (!name) {
            throw new Error('Role name is required');
        }
        if (!role) {
            throw new Error('Role data is required');
        }
        try {
            await this.sdk.request(`/roles/${name}`, 'PUT', role);
        }
        catch (error) {
            console.error(`Error updating realm role ${name}:`, error);
            throw new Error(`Failed to update realm role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete a realm role
     *
     * Endpoint: DELETE /{realm}/roles/{role-name}
     *
     * @param name - Role name
     * @returns Promise resolving when the deletion is complete
     */
    async delete(name) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            await this.sdk.request(`/roles/${name}`, 'DELETE');
        }
        catch (error) {
            console.error(`Error deleting realm role ${name}:`, error);
            throw new Error(`Failed to delete realm role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get role composites
     *
     * Endpoint: GET /{realm}/roles/{role-name}/composites
     *
     * @param name - Role name
     * @returns Promise resolving to an array of composite roles
     */
    async getComposites(name) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            return this.sdk.request(`/roles/${name}/composites`, 'GET');
        }
        catch (error) {
            console.error(`Error getting composites for role ${name}:`, error);
            throw new Error(`Failed to get role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add composites to a role
     *
     * Endpoint: POST /{realm}/roles/{role-name}/composites
     *
     * @param name - Role name
     * @param roles - Array of roles to add as composites
     * @returns Promise resolving when the composites are added
     */
    async addComposites(name, roles) {
        if (!name) {
            throw new Error('Role name is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`/roles/${name}/composites`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding composites to role ${name}:`, error);
            throw new Error(`Failed to add role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Remove composites from a role
     *
     * Endpoint: DELETE /{realm}/roles/{role-name}/composites
     *
     * @param name - Role name
     * @param roles - Array of roles to remove from composites
     * @returns Promise resolving when the composites are removed
     */
    async removeComposites(name, roles) {
        if (!name) {
            throw new Error('Role name is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`/roles/${name}/composites`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error removing composites from role ${name}:`, error);
            throw new Error(`Failed to remove role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get realm role composites
     *
     * Endpoint: GET /{realm}/roles/{role-name}/composites/realm
     *
     * @param name - Role name
     * @returns Promise resolving to an array of realm role composites
     */
    async getRealmRoleComposites(name) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            return this.sdk.request(`/roles/${name}/composites/realm`, 'GET');
        }
        catch (error) {
            console.error(`Error getting realm composites for role ${name}:`, error);
            throw new Error(`Failed to get realm role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get client role composites for a specific client
     *
     * Endpoint: GET /{realm}/roles/{role-name}/composites/clients/{client-ID}
     *
     * @param name - Role name
     * @param clientId - Client ID
     * @returns Promise resolving to an array of client role composites
     */
    async getClientRoleComposites(name, clientId) {
        if (!name) {
            throw new Error('Role name is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`/roles/${name}/composites/clients/${clientId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting client composites for role ${name} and client ${clientId}:`, error);
            throw new Error(`Failed to get client role composites: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get users with a specific role
     *
     * Endpoint: GET /{realm}/roles/{role-name}/users
     *
     * @param name - Role name
     * @param query - Query parameters for pagination and representation
     * @returns Promise resolving to an array of users with the role
     */
    async getUsersWithRole(name, query) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            let endpoint = `/roles/${name}/users`;
            const queryParams = [];
            if (query) {
                if (query.first !== undefined) {
                    queryParams.push(`first=${query.first}`);
                }
                if (query.max !== undefined) {
                    queryParams.push(`max=${query.max}`);
                }
                if (query.briefRepresentation !== undefined) {
                    queryParams.push(`briefRepresentation=${query.briefRepresentation}`);
                }
            }
            if (queryParams.length > 0) {
                endpoint += `?${queryParams.join('&')}`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting users with role ${name}:`, error);
            throw new Error(`Failed to get users with role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get groups with a specific role
     *
     * Endpoint: GET /{realm}/roles/{role-name}/groups
     *
     * @param name - Role name
     * @param query - Query parameters for pagination and representation
     * @returns Promise resolving to an array of groups with the role
     */
    async getGroupsWithRole(name, query) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            let endpoint = `/roles/${name}/groups`;
            const queryParams = [];
            if (query) {
                if (query.first !== undefined) {
                    queryParams.push(`first=${query.first}`);
                }
                if (query.max !== undefined) {
                    queryParams.push(`max=${query.max}`);
                }
                if (query.briefRepresentation !== undefined) {
                    queryParams.push(`briefRepresentation=${query.briefRepresentation}`);
                }
            }
            if (queryParams.length > 0) {
                endpoint += `?${queryParams.join('&')}`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting groups with role ${name}:`, error);
            throw new Error(`Failed to get groups with role: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get role permissions
     *
     * Endpoint: GET /{realm}/roles/{role-name}/management/permissions
     *
     * @param name - Role name
     * @returns Promise resolving to the management permission reference
     */
    async getPermissions(name) {
        if (!name) {
            throw new Error('Role name is required');
        }
        try {
            return this.sdk.request(`/roles/${name}/management/permissions`, 'GET');
        }
        catch (error) {
            console.error(`Error getting permissions for role ${name}:`, error);
            throw new Error(`Failed to get role permissions: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Update role permissions
     *
     * Endpoint: PUT /{realm}/roles/{role-name}/management/permissions
     *
     * @param name - Role name
     * @param permissions - Management permission reference
     * @returns Promise resolving to the updated management permission reference
     */
    async updatePermissions(name, permissions) {
        if (!name) {
            throw new Error('Role name is required');
        }
        if (!permissions) {
            throw new Error('Permissions data is required');
        }
        try {
            return this.sdk.request(`/roles/${name}/management/permissions`, 'PUT', permissions);
        }
        catch (error) {
            console.error(`Error updating permissions for role ${name}:`, error);
            throw new Error(`Failed to update role permissions: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Role Mappings API for Keycloak Admin SDK
 *
 * This module provides a base class for managing role mappings in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Base Role Mappings API
 *
 * Provides common methods for managing role mappings that can be used by both users and groups
 */
class BaseRoleMappingsApi {
    sdk;
    /**
     * Constructor for BaseRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all role mappings for the resource
     *
     * @returns Promise resolving to the mappings representation
     */
    async getAll() {
        try {
            return this.sdk.request(`${this.resourcePath}/role-mappings`, 'GET');
        }
        catch (error) {
            console.error(`Error getting all role mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get all role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get realm-level role mappings
     *
     * @returns Promise resolving to an array of role representations
     */
    async getRealmRoleMappings() {
        try {
            return this.sdk.request(`${this.resourcePath}/role-mappings/realm`, 'GET');
        }
        catch (error) {
            console.error(`Error getting realm role mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add realm-level role mappings
     *
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addRealmRoleMappings(roles) {
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/role-mappings/realm`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding realm role mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to add realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete realm-level role mappings
     *
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async deleteRealmRoleMappings(roles) {
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/role-mappings/realm`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error deleting realm role mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to delete realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available realm-level role mappings
     *
     * @returns Promise resolving to an array of role representations
     */
    async getAvailableRealmRoleMappings() {
        try {
            return this.sdk.request(`${this.resourcePath}/role-mappings/realm/available`, 'GET');
        }
        catch (error) {
            console.error(`Error getting available realm role mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get available realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get effective realm-level role mappings
     *
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of role representations
     */
    async getEffectiveRealmRoleMappings(briefRepresentation = true) {
        try {
            let endpoint = `${this.resourcePath}/role-mappings/realm/composite`;
            // Add query parameters if needed
            if (!briefRepresentation) {
                endpoint += `?briefRepresentation=false`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting effective realm role mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get effective realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get client-level role mappings
     *
     * @param clientId - Client ID
     * @returns Promise resolving to an array of role representations
     */
    async getClientRoleMappings(clientId) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`${this.resourcePath}/role-mappings/clients/${clientId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting client role mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to get client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add client-level role mappings
     *
     * @param clientId - Client ID
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addClientRoleMappings(clientId, roles) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/role-mappings/clients/${clientId}`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding client role mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to add client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete client-level role mappings
     *
     * @param clientId - Client ID
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async deleteClientRoleMappings(clientId, roles) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/role-mappings/clients/${clientId}`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error deleting client role mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to delete client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available client-level role mappings
     *
     * @param clientId - Client ID
     * @returns Promise resolving to an array of role representations
     */
    async getAvailableClientRoleMappings(clientId) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`${this.resourcePath}/role-mappings/clients/${clientId}/available`, 'GET');
        }
        catch (error) {
            console.error(`Error getting available client role mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to get available client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get effective client-level role mappings
     *
     * @param clientId - Client ID
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of role representations
     */
    async getEffectiveClientRoleMappings(clientId, briefRepresentation = true) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            let endpoint = `${this.resourcePath}/role-mappings/clients/${clientId}/composite`;
            // Add query parameters if needed
            if (!briefRepresentation) {
                endpoint += `?briefRepresentation=false`;
            }
            return this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            console.error(`Error getting effective client role mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to get effective client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * User Role Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for users in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * User Role Mappings API
 *
 * Provides methods to manage role mappings for users in Keycloak
 */
class UserRoleMappingsApi extends BaseRoleMappingsApi {
    resourcePath;
    /**
     * Constructor for UserRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param userId - ID of the user
     */
    constructor(sdk, userId) {
        super(sdk);
        if (!userId) {
            throw new Error('User ID is required');
        }
        this.resourcePath = `/users/${userId}`;
    }
}

/**
 * Group Role Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for groups in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Group Role Mappings API
 *
 * Provides methods to manage role mappings for groups in Keycloak
 */
class GroupRoleMappingsApi extends BaseRoleMappingsApi {
    resourcePath;
    /**
     * Constructor for GroupRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param groupId - ID of the group
     */
    constructor(sdk, groupId) {
        super(sdk);
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        this.resourcePath = `/groups/${groupId}`;
    }
}

/**
 * Client Role Mappings API for Keycloak Admin SDK
 * Provides methods for managing client-level role mappings for users and groups
 */
/**
 * Base class for client role mappings operations
 */
class BaseClientRoleMappingsApi {
    sdk;
    /**
     * Creates a new instance of the Base Client Role Mappings API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get client-level role mappings for the user or group, and the app
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @returns {Promise<RoleRepresentation[]>} List of role mappings
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getClientRoleMappings(id, clientId) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`${this.getBasePath(id)}/role-mappings/clients/${clientId}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add client-level roles to the user or group role mapping
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @param {RoleRepresentation[]} roles - The roles to add
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async addClientRoleMappings(id, clientId, roles) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('Roles array is required and must not be empty');
        }
        try {
            await this.sdk.request(`${this.getBasePath(id)}/role-mappings/clients/${clientId}`, 'POST', roles);
        }
        catch (error) {
            throw new Error(`Failed to add client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete client-level roles from user or group role mapping
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @param {RoleRepresentation[]} roles - The roles to delete
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    async deleteClientRoleMappings(id, clientId, roles) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('Roles array is required and must not be empty');
        }
        try {
            await this.sdk.request(`${this.getBasePath(id)}/role-mappings/clients/${clientId}`, 'DELETE', roles);
        }
        catch (error) {
            throw new Error(`Failed to delete client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available client-level roles that can be mapped to the user or group
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @returns {Promise<RoleRepresentation[]>} List of available roles
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getAvailableClientRoleMappings(id, clientId) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`${this.getBasePath(id)}/role-mappings/clients/${clientId}/available`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get available client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get effective client-level role mappings
     * This recurses any composite roles
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @param {boolean} [briefRepresentation=true] - If false, return roles with their attributes
     * @returns {Promise<RoleRepresentation[]>} List of effective role mappings
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getEffectiveClientRoleMappings(id, clientId, briefRepresentation = true) {
        if (!id) {
            throw new Error('ID is required');
        }
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            const queryParams = briefRepresentation ? {} : { briefRepresentation: false };
            return this.sdk.request(`${this.getBasePath(id)}/role-mappings/clients/${clientId}/composite`, 'GET', undefined, queryParams);
        }
        catch (error) {
            throw new Error(`Failed to get effective client role mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
/**
 * API for managing client role mappings for users
 */
class UserClientRoleMappingsApi extends BaseClientRoleMappingsApi {
    /**
     * Get the base path for user role mappings
     *
     * @param {string} userId - The user ID
     * @returns {string} The base path
     */
    getBasePath(userId) {
        return `/users/${userId}`;
    }
}
/**
 * API for managing client role mappings for groups
 */
class GroupClientRoleMappingsApi extends BaseClientRoleMappingsApi {
    /**
     * Get the base path for group role mappings
     *
     * @param {string} groupId - The group ID
     * @returns {string} The base path
     */
    getBasePath(groupId) {
        return `/groups/${groupId}`;
    }
}

/**
 * Role Mappings API for Keycloak Admin SDK
 *
 * This module exports the role mappings API classes and factory functions.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Role Mappings API Factory
 *
 * Factory class for creating role mappings API instances for different resource types
 */
class RoleMappingsApiFactory {
    sdk;
    /**
     * Constructor for RoleMappingsApiFactory
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Create a role mappings API for a user
     *
     * @param userId - ID of the user
     * @returns UserRoleMappingsApi instance
     */
    forUser(userId) {
        return new UserRoleMappingsApi(this.sdk, userId);
    }
    /**
     * Create a role mappings API for a group
     *
     * @param groupId - ID of the group
     * @returns GroupRoleMappingsApi instance
     */
    forGroup(groupId) {
        return new GroupRoleMappingsApi(this.sdk, groupId);
    }
    /**
     * Create a client role mappings API for a user
     *
     * @returns UserClientRoleMappingsApi instance
     */
    forClientRoleMappingsUser() {
        return new UserClientRoleMappingsApi(this.sdk);
    }
    /**
     * Create a client role mappings API for a group
     *
     * @returns GroupClientRoleMappingsApi instance
     */
    forClientRoleMappingsGroup() {
        return new GroupClientRoleMappingsApi(this.sdk);
    }
}

/**
 * Attack Detection API for Keycloak Admin SDK
 * Provides methods for managing brute force detection for users
 */
/**
 * API for managing attack detection in Keycloak
 */
class AttackDetectionApi {
    sdk;
    /**
     * Creates a new instance of the Attack Detection API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Clear any user login failures for all users
     * This can release temporary disabled users
     *
     * Endpoint: DELETE /admin/realms/{realm}/attack-detection/brute-force/users
     *
     * @returns {Promise<void>} A promise that resolves when the operation is complete
     * @throws {Error} If the request fails
     */
    async clearAllBruteForce() {
        try {
            const endpoint = `/attack-detection/brute-force/users`;
            await this.sdk.request(endpoint, 'DELETE');
        }
        catch (error) {
            throw new Error(`Error clearing all brute force attempts: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Clear any user login failures for a specific user
     * This can release a temporary disabled user
     *
     * Endpoint: DELETE /admin/realms/{realm}/attack-detection/brute-force/users/{userId}
     *
     * @param {string} userId - ID of the user to clear brute force attempts for
     * @returns {Promise<void>} A promise that resolves when the operation is complete
     * @throws {Error} If the request fails or userId is invalid
     */
    async clearBruteForceForUser(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/attack-detection/brute-force/users/${userId}`;
            await this.sdk.request(endpoint, 'DELETE');
        }
        catch (error) {
            throw new Error(`Error clearing brute force attempts for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get status of a user in brute force detection
     *
     * Endpoint: GET /admin/realms/{realm}/attack-detection/brute-force/users/{userId}
     *
     * @param {string} userId - ID of the user to get status for
     * @returns {Promise<BruteForceStatus>} The brute force status for the user
     * @throws {Error} If the request fails or userId is invalid
     */
    async getBruteForceStatusForUser(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const endpoint = `/attack-detection/brute-force/users/${userId}`;
            return await this.sdk.request(endpoint, 'GET');
        }
        catch (error) {
            throw new Error(`Error getting brute force status for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides a base class for managing scope mappings in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Base Scope Mappings API
 *
 * Provides common methods for managing scope mappings that can be used by both clients and client scopes
 */
class BaseScopeMappingsApi {
    sdk;
    /**
     * Constructor for BaseScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all scope mappings for the resource
     *
     * @returns Promise resolving to the mappings representation
     */
    async getAll() {
        try {
            return this.sdk.request(`${this.resourcePath}/scope-mappings`, 'GET');
        }
        catch (error) {
            console.error(`Error getting all scope mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get all scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get realm-level roles associated with the resource's scope
     *
     * @returns Promise resolving to an array of role representations
     */
    async getRealmScopeMappings() {
        try {
            return this.sdk.request(`${this.resourcePath}/scope-mappings/realm`, 'GET');
        }
        catch (error) {
            console.error(`Error getting realm scope mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add realm-level roles to the resource's scope
     *
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addRealmScopeMappings(roles) {
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/scope-mappings/realm`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding realm scope mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to add realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete realm-level roles from the resource's scope
     *
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async deleteRealmScopeMappings(roles) {
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/scope-mappings/realm`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error deleting realm scope mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to delete realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available realm-level roles that can be mapped to the resource's scope
     *
     * @returns Promise resolving to an array of role representations
     */
    async getAvailableRealmScopeMappings() {
        try {
            return this.sdk.request(`${this.resourcePath}/scope-mappings/realm/available`, 'GET');
        }
        catch (error) {
            console.error(`Error getting available realm scope mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get available realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get effective realm-level roles associated with the resource's scope
     *
     * @param query - Optional query parameters
     * @returns Promise resolving to an array of role representations
     */
    async getEffectiveRealmScopeMappings(query) {
        try {
            const queryParams = query ? { briefRepresentation: query.briefRepresentation } : undefined;
            return this.sdk.request(`${this.resourcePath}/scope-mappings/realm/composite`, 'GET', undefined, queryParams);
        }
        catch (error) {
            console.error(`Error getting effective realm scope mappings for ${this.resourcePath}:`, error);
            throw new Error(`Failed to get effective realm scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get client-level roles associated with the resource's scope
     *
     * @param clientId - ID of the client
     * @returns Promise resolving to an array of role representations
     */
    async getClientScopeMappings(clientId) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`${this.resourcePath}/scope-mappings/clients/${clientId}`, 'GET');
        }
        catch (error) {
            console.error(`Error getting client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to get client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Add client-level roles to the resource's scope
     *
     * @param clientId - ID of the client
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    async addClientScopeMappings(clientId, roles) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/scope-mappings/clients/${clientId}`, 'POST', roles);
        }
        catch (error) {
            console.error(`Error adding client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to add client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete client-level roles from the resource's scope
     *
     * @param clientId - ID of the client
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    async deleteClientScopeMappings(clientId, roles) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            throw new Error('At least one role is required');
        }
        try {
            await this.sdk.request(`${this.resourcePath}/scope-mappings/clients/${clientId}`, 'DELETE', roles);
        }
        catch (error) {
            console.error(`Error deleting client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to delete client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get available client-level roles that can be mapped to the resource's scope
     *
     * @param clientId - ID of the client
     * @returns Promise resolving to an array of role representations
     */
    async getAvailableClientScopeMappings(clientId) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            return this.sdk.request(`${this.resourcePath}/scope-mappings/clients/${clientId}/available`, 'GET');
        }
        catch (error) {
            console.error(`Error getting available client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to get available client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get effective client-level roles associated with the resource's scope
     *
     * @param clientId - ID of the client
     * @param query - Optional query parameters
     * @returns Promise resolving to an array of role representations
     */
    async getEffectiveClientScopeMappings(clientId, query) {
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        try {
            const queryParams = query ? { briefRepresentation: query.briefRepresentation } : undefined;
            return this.sdk.request(`${this.resourcePath}/scope-mappings/clients/${clientId}/composite`, 'GET', undefined, queryParams);
        }
        catch (error) {
            console.error(`Error getting effective client scope mappings for ${this.resourcePath} and client ${clientId}:`, error);
            throw new Error(`Failed to get effective client scope mappings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Client Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for client scopes in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Client Scope Mappings API
 *
 * Provides methods to manage scope mappings for client scopes in Keycloak
 */
class ClientScopeMappingsApi extends BaseScopeMappingsApi {
    resourcePath;
    /**
     * Constructor for ClientScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param clientScopeId - ID of the client scope
     */
    constructor(sdk, clientScopeId) {
        super(sdk);
        if (!clientScopeId) {
            throw new Error('Client scope ID is required');
        }
        this.resourcePath = `/client-scopes/${clientScopeId}`;
    }
}

/**
 * Client Template Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for client templates in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Client Template Scope Mappings API
 *
 * Provides methods to manage scope mappings for client templates in Keycloak
 */
class ClientTemplateScopeMappingsApi extends BaseScopeMappingsApi {
    resourcePath;
    /**
     * Constructor for ClientTemplateScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param clientTemplateId - ID of the client template
     */
    constructor(sdk, clientTemplateId) {
        super(sdk);
        if (!clientTemplateId) {
            throw new Error('Client template ID is required');
        }
        this.resourcePath = `/client-templates/${clientTemplateId}`;
    }
}

/**
 * Client ID Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for clients in Keycloak.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Client ID Scope Mappings API
 *
 * Provides methods to manage scope mappings for clients in Keycloak
 */
class clientIdScopeMappingsApi extends BaseScopeMappingsApi {
    resourcePath;
    /**
     * Constructor for clientIdScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param clientId - ID of the client
     */
    constructor(sdk, clientId) {
        super(sdk);
        if (!clientId) {
            throw new Error('Client ID is required');
        }
        this.resourcePath = `/clients/${clientId}`;
    }
}

/**
 * Scope Mappings API Factory for Keycloak Admin SDK
 *
 * This module provides a factory for creating scope mappings API instances.
 * It follows SOLID principles and clean code practices.
 */
/**
 * Scope Mappings API Factory
 *
 * Factory for creating scope mappings API instances for different resource types
 */
class ScopeMappingsApiFactory {
    sdk;
    /**
     * Constructor for ScopeMappingsApiFactory
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get scope mappings API for a client scope
     *
     * @param clientScopeId - ID of the client scope
     * @returns ClientScopeMappingsApi instance
     */
    forClientScope(clientScopeId) {
        return new ClientScopeMappingsApi(this.sdk, clientScopeId);
    }
    /**
     * Get scope mappings API for a client template
     *
     * @param clientTemplateId - ID of the client template
     * @returns ClientTemplateScopeMappingsApi instance
     */
    forClientTemplate(clientTemplateId) {
        return new ClientTemplateScopeMappingsApi(this.sdk, clientTemplateId);
    }
    /**
     * Get scope mappings API for a client
     *
     * @param clientId - ID of the client
     * @returns clientIdScopeMappingsApi instance
     */
    forClient(clientId) {
        return new clientIdScopeMappingsApi(this.sdk, clientId);
    }
}

/**
 * Keys API for Keycloak Admin SDK
 * Provides methods for managing keys in Keycloak
 */
/**
 * API for managing Keycloak keys
 */
class KeysApi {
    sdk;
    /**
     * Creates a new instance of the Keys API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get keys metadata for the current realm
     *
     * Endpoint: GET /{realm}/keys
     *
     * @returns {Promise<KeysMetadataRepresentation>} Keys metadata
     * @throws {Error} If the request fails
     */
    async getKeys() {
        try {
            return this.sdk.request('/keys', 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get keys metadata: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Resource Server API for Keycloak Admin SDK
 * Focused on managing resource server configuration
 */
/**
 * API for managing Resource Server configuration in Keycloak
 *
 * A Resource Server is a client application that hosts protected resources
 * and relies on authorization policies to decide whether access should be granted.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_resource_server
 */
class ResourceServerApi {
    sdk;
    /**
     * Creates a new instance of the Resource Server API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
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
    async getResourceServer(clientId) {
        try {
            return this.sdk.request(`/clients/${clientId}/authz/resource-server`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource server: ${error instanceof Error ? error.message : String(error)}`);
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
    async createResource(clientUuid, resource) {
        try {
            return await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource`, 'POST', resource);
        }
        catch (error) {
            throw new Error(`Failed to create resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async getResource(clientUuid, resourceId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateResourceServer(clientUuid, config) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server`, 'PUT', config);
        }
        catch (error) {
            throw new Error(`Failed to update resource server: ${error instanceof Error ? error.message : String(error)}`);
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
    async getResources(clientUuid, options) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource`, 'GET', undefined, options);
        }
        catch (error) {
            throw new Error(`Failed to get resources: ${error instanceof Error ? error.message : String(error)}`);
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
    async importResourceServer(clientUuid, config) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/import`, 'POST', config);
        }
        catch (error) {
            throw new Error(`Failed to import resource server: ${error instanceof Error ? error.message : String(error)}`);
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
    async getSettings(clientUuid) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/settings`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource server settings: ${error instanceof Error ? error.message : String(error)}`);
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
    async searchResource(clientUuid, name) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/search`, 'GET', undefined, { name });
        }
        catch (error) {
            throw new Error(`Failed to search resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateResource(clientUuid, resourceId, resource) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`, 'PUT', resource);
        }
        catch (error) {
            throw new Error(`Failed to update resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteResource(clientUuid, resourceId) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete resource: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Resources API for Keycloak Admin SDK
 * Focused on managing protected resources
 */
/**
 * API for managing protected resources in Keycloak Authorization Services
 *
 * A resource is part of the assets of an application and the organization.
 * It can be a set of one or more endpoints, a classic web resource such as an HTML page, etc.
 * In authorization policy terminology, a resource is the object being protected.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_resource
 */
class ResourcesApi {
    sdk;
    /**
     * Creates a new instance of the Resources API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
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
    async getResources(clientUuid, options) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource`, 'GET', undefined, options);
        }
        catch (error) {
            throw new Error(`Failed to get resources: ${error instanceof Error ? error.message : String(error)}`);
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
    async createResource(clientUuid, resource) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource`, 'POST', resource);
        }
        catch (error) {
            throw new Error(`Failed to create resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async getResource(clientUuid, resourceId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateResource(clientUuid, resourceId, resource) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`, 'PUT', resource);
        }
        catch (error) {
            throw new Error(`Failed to update resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteResource(clientUuid, resourceId) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete resource: ${error instanceof Error ? error.message : String(error)}`);
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
    async getResourcePermissions(clientUuid, resourceId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}/permissions`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource permissions: ${error instanceof Error ? error.message : String(error)}`);
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
    async getResourceScopes(clientUuid, resourceId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}/scopes`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource scopes: ${error instanceof Error ? error.message : String(error)}`);
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
    async getResourceAttributes(clientUuid, resourceId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/${resourceId}/attributes`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get resource attributes: ${error instanceof Error ? error.message : String(error)}`);
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
    async searchResource(clientUuid, name) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/resource/search`, 'GET', undefined, { name });
        }
        catch (error) {
            throw new Error(`Failed to search resource: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Scopes API for Keycloak Admin SDK
 * Focused on managing authorization scopes
 */
/**
 * API for managing authorization scopes in Keycloak
 *
 * A scope is a bounded extent of access that is possible to perform on a resource.
 * In authorization policy terminology, a scope is one of the potentially many verbs
 * that can logically apply to a resource.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_scope
 */
class ScopesApi {
    sdk;
    /**
     * Creates a new instance of the Scopes API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
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
    async getScopes(clientUuid, options) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope`, 'GET', undefined, options);
        }
        catch (error) {
            throw new Error(`Failed to get scopes: ${error instanceof Error ? error.message : String(error)}`);
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
    async createScope(clientUuid, scope) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope`, 'POST', scope);
        }
        catch (error) {
            throw new Error(`Failed to create scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async getScope(clientUuid, scopeId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope/${scopeId}`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async updateScope(clientUuid, scopeId, scope) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope/${scopeId}`, 'PUT', scope);
        }
        catch (error) {
            throw new Error(`Failed to update scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async deleteScope(clientUuid, scopeId) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope/${scopeId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete scope: ${error instanceof Error ? error.message : String(error)}`);
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
    async getScopePermissions(clientUuid, scopeId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope/${scopeId}/permissions`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get scope permissions: ${error instanceof Error ? error.message : String(error)}`);
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
    async getScopeResources(clientUuid, scopeId) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope/${scopeId}/resources`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get scope resources: ${error instanceof Error ? error.message : String(error)}`);
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
    async searchScope(clientUuid, name, exactName) {
        try {
            const queryParams = { name };
            if (exactName !== undefined) {
                queryParams.exactName = exactName;
            }
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/scope/search`, 'GET', undefined, queryParams);
        }
        catch (error) {
            throw new Error(`Failed to search scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Policies API for Keycloak Admin SDK
 * Focused on managing authorization policies
 */
/**
 * API for managing authorization policies in Keycloak
 *
 * Policies define the conditions that must be satisfied to grant access to an object.
 * Unlike permissions, you do not specify the object being protected but rather the conditions
 * that must be satisfied for access to a given object (resource or scope).
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_policy
 */
class PoliciesApi {
    sdk;
    /**
     * Creates a new instance of the Policies API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
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
    async getPolicies(clientUuid, options) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy`, 'GET', undefined, options);
        }
        catch (error) {
            throw new Error(`Failed to get policies: ${error instanceof Error ? error.message : String(error)}`);
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
    async createPolicy(clientUuid, policy) {
        try {
            if (!policy.type) {
                throw new Error('Policy type is required');
            }
            // Extract the policy type from the policy object
            const policyType = policy.type;
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy/${policyType}`, 'POST', policy);
        }
        catch (error) {
            throw new Error(`Failed to create policy: ${error instanceof Error ? error.message : String(error)}`);
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
    async updatePolicy(clientUuid, policyId, policyData) {
        try {
            if (!policyData.type) {
                throw new Error('Policy type is required');
            }
            // Extract the policy type from the policy object
            const policyType = policyData.type;
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy/${policyType}/${policyId}`, 'PUT', policyData);
        }
        catch (error) {
            throw new Error(`Failed to update policy: ${error instanceof Error ? error.message : String(error)}`);
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
    async deletePolicy(clientUuid, policyId) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy/${policyId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete policy: ${error instanceof Error ? error.message : String(error)}`);
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
    async getPolicyProviders(clientUuid) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy/providers`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get policy providers: ${error instanceof Error ? error.message : String(error)}`);
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
    async searchPolicy(clientUuid, name, fields) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy/search`, 'GET', undefined, { name, fields });
        }
        catch (error) {
            throw new Error(`Failed to search policy: ${error instanceof Error ? error.message : String(error)}`);
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
    async evaluatePolicy(clientUuid, request) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/policy/evaluate`, 'POST', request);
        }
        catch (error) {
            throw new Error(`Failed to evaluate policy: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Permissions API for Keycloak Admin SDK
 * Focused on managing authorization permissions
 */
/**
 * API for managing permissions in Keycloak Authorization Services
 *
 * A permission associates the object being protected with the policies that must be evaluated
 * to determine whether access is granted. Permissions can be resource-based or scope-based.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_permission
 */
class PermissionsApi {
    sdk;
    /**
     * Creates a new instance of the Permissions API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
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
    async getPermissions(clientUuid, options) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission`, 'GET', undefined, options);
        }
        catch (error) {
            throw new Error(`Failed to get permissions: ${error instanceof Error ? error.message : String(error)}`);
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
    async createPermission(clientUuid, permission) {
        try {
            if (!permission.type) {
                throw new Error('Permission type is required');
            }
            // Extract the permission type from the permission object
            const permissionType = permission.type;
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission/${permissionType}`, 'POST', permission);
        }
        catch (error) {
            throw new Error(`Failed to create permission: ${error instanceof Error ? error.message : String(error)}`);
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
    async updatePermission(clientUuid, permissionId, permission) {
        try {
            if (!permission.type) {
                throw new Error('Permission type is required');
            }
            // Extract the permission type from the permission object
            const permissionType = permission.type;
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission/${permissionType}/${permissionId}`, 'PUT', permission);
        }
        catch (error) {
            throw new Error(`Failed to update permission: ${error instanceof Error ? error.message : String(error)}`);
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
    async deletePermission(clientUuid, permissionId) {
        try {
            await this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission/${permissionId}`, 'DELETE');
        }
        catch (error) {
            throw new Error(`Failed to delete permission: ${error instanceof Error ? error.message : String(error)}`);
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
    async getPermissionProviders(clientUuid) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission/providers`, 'GET');
        }
        catch (error) {
            throw new Error(`Failed to get permission providers: ${error instanceof Error ? error.message : String(error)}`);
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
    async searchPermission(clientUuid, name, fields) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission/search`, 'GET', undefined, { name, fields });
        }
        catch (error) {
            throw new Error(`Failed to search permission: ${error instanceof Error ? error.message : String(error)}`);
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
    async evaluatePermission(clientUuid, request) {
        try {
            return this.sdk.request(`/clients/${clientUuid}/authz/resource-server/permission/evaluate`, 'POST', request);
        }
        catch (error) {
            throw new Error(`Failed to evaluate permission: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/**
 * Authorization Services API for Keycloak Admin SDK
 * Main entry point for authorization services functionality
 */
/**
 * Authorization Services API for Keycloak
 *
 * Provides a centralized access point to all authorization services functionality:
 * - Resource Server management (PAP)
 * - Resources management (PAP)
 * - Scopes management (PAP)
 * - Policies management (PAP)
 * - Permissions management (PAP)
 * - Policy evaluation (PDP)
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/
 */
class AuthorizationServicesApi {
    sdk;
    /**
     * Resource Server API for managing resource server configuration
     */
    resourceServer;
    /**
     * Resources API for managing protected resources
     */
    resources;
    /**
     * Scopes API for managing resource scopes
     */
    scopes;
    /**
     * Policies API for managing authorization policies
     */
    policies;
    /**
     * Permissions API for managing resource and scope permissions
     */
    permissions;
    /**
     * Creates a new instance of the Authorization Services API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
        this.resourceServer = new ResourceServerApi(sdk);
        this.resources = new ResourcesApi(sdk);
        this.scopes = new ScopesApi(sdk);
        this.policies = new PoliciesApi(sdk);
        this.permissions = new PermissionsApi(sdk);
    }
}

/**
 * Component API class for managing Keycloak components
 */
class ComponentApi {
    sdk;
    /**
     * Constructor for ComponentApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk) {
        this.sdk = sdk;
    }
    /**
     * Get all components in a realm
     *
     * Endpoint: GET /admin/realms/{realm}/components
     *
     * @param realm - Realm name
     * @param options - Optional query parameters
     * @returns List of components
     */
    async getComponents(realm, options) {
        if (!realm) {
            throw new Error('Realm name is required');
        }
        try {
            return this.sdk.request(`/components`, 'GET', undefined, options);
        }
        catch (error) {
            const errorDetails = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to get components: ${errorDetails}`);
        }
    }
    /**
     * Get a component by ID
     *
     * Endpoint: GET /admin/realms/{realm}/components/{id}
     *
     * @param realm - Realm name
     * @param id - Component ID
     * @returns Component
     */
    async getComponent(realm, id) {
        if (!realm) {
            throw new Error('Realm name is required');
        }
        if (!id) {
            throw new Error('Component ID is required');
        }
        try {
            return this.sdk.request(`/components/${id}`, 'GET');
        }
        catch (error) {
            const errorDetails = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to get component with ID ${id}: ${errorDetails}`);
        }
    }
    /**
     * Create a component
     *
     * Endpoint: POST /admin/realms/{realm}/components
     *
     * @param realm - Realm name
     * @param component - Component to create
     * @returns Created component
     */
    async createComponent(realm, component) {
        if (!realm) {
            throw new Error('Realm name is required');
        }
        if (!component) {
            throw new Error('Component object is required');
        }
        if (!component.config?.editMode?.length || component.config.editMode.length < 1) {
            throw new Error('Edit mode is required');
        }
        // Create a deep copy to avoid modifying the original object
        const componentToSend = structuredClone(component);
        try {
            await this.sdk.request(`/components`, 'POST', componentToSend);
        }
        catch (error) {
            const errorDetails = error instanceof Error ? error.message : String(error);
            console.error('Component creation error details:', error);
            throw new Error(`Failed to create component: ${errorDetails}`);
        }
    }
    /**
     * Update a component
     *
     * Endpoint: PUT /admin/realms/{realm}/components/{id}
     *
     * @param realm - Realm name
     * @param id - Component ID
     * @param component - Updated component
     */
    async updateComponent(realm, id, component) {
        if (!realm) {
            throw new Error('Realm name is required');
        }
        if (!id) {
            throw new Error('Component ID is required');
        }
        if (!component) {
            throw new Error('Component object is required');
        }
        if (!component.config?.editMode?.length || component.config.editMode.length < 1) {
            throw new Error('Edit mode is required');
        }
        try {
            await this.sdk.request(`/components/${id}`, 'PUT', component);
        }
        catch (error) {
            const errorDetails = error instanceof Error ? error.message : String(error);
            console.error('Component update error details:', error);
            throw new Error(`Failed to update component with ID ${id}: ${errorDetails}`);
        }
    }
    /**
     * Delete a component
     *
     * Endpoint: DELETE /admin/realms/{realm}/components/{id}
     *
     * @param realm - Realm name
     * @param id - Component ID
     */
    async deleteComponent(realm, id) {
        if (!realm) {
            throw new Error('Realm name is required');
        }
        if (!id) {
            throw new Error('Component ID is required');
        }
        try {
            await this.sdk.request(`/components/${id}`, 'DELETE');
        }
        catch (error) {
            const errorDetails = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to delete component with ID ${id}: ${errorDetails}`);
        }
    }
    /**
     * Get sub-component types for a component
     *
     * Endpoint: GET /admin/realms/{realm}/components/{id}/sub-component-types
     *
     * @param realm - Realm name
     * @param id - Component ID
     * @param type - Required type parameter (e.g., 'org.keycloak.storage.UserStorageProvider')
     * @returns List of sub-component types
     */
    async getSubComponentTypes(realm, id, type) {
        if (!realm) {
            throw new Error('Realm name is required');
        }
        if (!id) {
            throw new Error('Component ID is required');
        }
        if (!type) {
            throw new Error('Subtype parameter is required');
        }
        try {
            return this.sdk.request(`/components/${id}/sub-component-types/?type=${type}`, 'GET', undefined);
        }
        catch (error) {
            const errorDetails = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to get sub-component types for component ID ${id}: ${errorDetails}`);
        }
    }
}

function isTokenResponse(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'access_token' in data &&
        typeof data.access_token === 'string');
}
function isErrorResponse(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof data.error === 'string');
}
/**
 * Get an authentication token from Keycloak
 * @param config The Keycloak configuration
 * @returns A promise that resolves to the authentication token
 */
async function getToken(config) {
    // For bearer token authentication, just return the token
    if (config.authMethod === 'bearer') {
        return config.credentials.token;
    }
    // For client credentials or password authentication, get a token from Keycloak
    const tokenUrl = `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/token`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let body;
    // Prepare the request body based on the authentication method
    if (config.authMethod === 'client') {
        const { clientId, clientSecret } = config.credentials;
        body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        });
    }
    else if (config.authMethod === 'password') {
        const { username, password, clientId } = config.credentials;
        body = new URLSearchParams({
            grant_type: 'password',
            client_id: clientId,
            username,
            password,
        });
    }
    else {
        throw new Error(`Invalid authentication method: ${config.authMethod}`);
    }
    try {
        // Make the request to get a token
        const response = await fetch(tokenUrl, { method: 'POST', headers, body });
        // Try to parse the response as JSON
        let data;
        try {
            data = await response.json();
        }
        catch (error) {
            console.error('Failed to parse token response as JSON:', error);
            const responseText = await response.text().catch(() => 'Unable to get response text');
            console.error('Response text:', responseText);
            throw new Error(`Failed to parse token response: ${error instanceof Error ? error.message : String(error)}`);
        }
        // Handle error responses
        if (!response.ok) {
            console.error(`Token request failed with status: ${response.status}`);
            console.error('Response data:', data);
            if (isErrorResponse(data)) {
                throw new Error(`Authentication failed: ${data.error_description || data.error}`);
            }
            else {
                throw new Error(`Authentication failed: Unknown error (Status: ${response.status})`);
            }
        }
        // Validate the token response
        if (isTokenResponse(data)) {
            return data.access_token;
        }
        else {
            console.error('Invalid token response:', data);
            throw new Error('Invalid token response: Expected access_token in response');
        }
    }
    catch (error) {
        // Handle network errors
        if (error instanceof Error) {
            console.error('Error getting token:', error.message);
            console.error('Error stack:', error.stack);
        }
        else {
            console.error('Unknown error getting token:', error);
        }
        throw error;
    }
}

/**
 * Custom error class for request failures
 */
class RequestError extends Error {
    status;
    responseBody;
    constructor(status, message, responseBody) {
        super(message);
        this.name = 'RequestError';
        this.status = status;
        this.responseBody = responseBody;
    }
}
/**
 * Make an HTTP request with proper error handling
 * @param url The URL to request
 * @param method The HTTP method to use
 * @param token The authentication token
 * @param body Optional request body
 * @param options Overrides default HTTP headers
 * @returns The response data
 */
async function makeRequest(url, method, token, body, options) {
    // Use the global fetch API
    const headers = {
        Authorization: `Bearer ${token}`,
        ...options?.headers
    };
    // Set default content type to application/json if not specified in options
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    // Determine if we're dealing with form data
    const isFormData = headers['Content-Type'] === 'application/x-www-form-urlencoded';
    const requestOptions = {
        method,
        headers,
        body: body ? (isFormData || typeof body === 'string' ? body : JSON.stringify(body)) : undefined
    };
    try {
        const response = await fetch(url, requestOptions);
        // Handle unsuccessful responses
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'No response body');
            throw new RequestError(response.status, response.statusText, errorText);
        }
        // Handle response based on content type and status
        const contentType = response.headers.get('content-type');
        // Handle 201 Created responses with Location header (typically for resource creation)
        if (response.status === 201) {
            if (contentType?.includes('application/json')) {
                const data = (await response.json());
                if (data && Object.keys(data).length > 0) {
                    return data;
                }
            }
            const location = response.headers.get('location');
            if (location) {
                // Extract the ID from the location header (last part of the URL)
                const id = location.split('/').pop();
                if (id) {
                    // Only return ID as an object for create operations where we expect an ID
                    // This is determined by checking if the method is POST and the URL ends with a collection endpoint
                    if (method === 'POST' &&
                        /\/(users|groups|clients|roles|client-scopes|organizations|mappers)$/.test(url)) {
                        return id;
                    }
                }
            }
            // For other 201 responses without a location header or where we don't need to extract an ID
            return {};
        }
        // Handle 204 No Content responses
        if (response.status === 204) {
            return {};
        }
        // For 204 No Content or empty responses, return empty object
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {};
        }
        // For JSON responses, parse the JSON
        if (contentType && contentType.includes('application/json')) {
            try {
                const text = await response.text();
                if (!text || text.trim() === '') {
                    return {};
                }
                const data = JSON.parse(text);
                return data;
            }
            catch (error) {
                console.error('Error parsing JSON response:', error);
                throw new Error(`Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        else {
            // For non-JSON responses, return the response text as the result
            const text = await response.text();
            return { text };
        }
    }
    catch (error) {
        // Handle network errors
        if (!(error instanceof RequestError)) {
            console.error('Network error during request:', error);
            throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
        }
        throw error;
    }
}

/**
 * Keycloak Admin SDK
 * A TypeScript SDK for interacting with the Keycloak Admin REST API
 */
/**
 * Main SDK class for interacting with the Keycloak Admin REST API
 */
class KeycloakAdminSDK {
    baseUrl;
    adminUrl;
    config;
    token = null;
    // API endpoints
    users;
    groups;
    realms;
    clients;
    organizations;
    identityProviders;
    roles;
    roleMappings;
    scopeMappings;
    keys;
    authorizationServices;
    component;
    attackDetection;
    /**
     * Creates a new instance of the Keycloak Admin SDK
     *
     * @param {KeycloakConfig} config - Configuration for connecting to Keycloak
     */
    constructor(config) {
        this.config = config;
        this.adminUrl = `${config.baseUrl}/admin`;
        this.baseUrl = `${config.baseUrl}/admin/realms/${config.realm}`;
        // Initialize API endpoints
        this.users = new UsersApi(this);
        this.groups = new GroupsApi(this);
        this.realms = new RealmsApi(this);
        this.clients = new ClientsApi(this);
        this.organizations = new OrganizationsApi(this);
        this.identityProviders = new IdentityProvidersApi(this);
        this.roles = new RolesApi(this);
        this.roleMappings = new RoleMappingsApiFactory(this);
        this.scopeMappings = new ScopeMappingsApiFactory(this);
        this.keys = new KeysApi(this);
        this.authorizationServices = new AuthorizationServicesApi(this);
        this.component = new ComponentApi(this);
        this.attackDetection = new AttackDetectionApi(this);
    }
    /**
     * Gets a valid authentication token
     *
     * @returns {Promise<string>} A valid authentication token
     */
    async getValidToken() {
        try {
            // Return cached token if available
            if (this.token) {
                return this.token;
            }
            // Get a new token
            this.token = await getToken(this.config);
            return this.token;
        }
        catch (error) {
            console.error('Failed to get valid token:', error);
            throw new Error(`Authentication failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Makes an authenticated request to the Keycloak Admin REST API for the configured realm
     *
     * @param {string} endpoint - The API endpoint to call
     * @param {HttpMethod} method - The HTTP method to use
     * @param {any} [body] - Optional request body
     * @param options Overrides default HTTP headers
  
     * @returns {Promise<T>} The response data
     */
    async request(endpoint, method, body, options) {
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
            return makeRequest(fullUrl, method, token, body, requestOptions);
        }
        catch (error) {
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
     * @param options Overrides default HTTP headers
     * @returns {Promise<T>} The response data
     */
    async requestWithoutRealm(endpoint, method, body, options) {
        try {
            const token = await this.getValidToken();
            const url = `${this.adminUrl}/realms${endpoint}`;
            return makeRequest(url, method, token, body, options);
        }
        catch (error) {
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
     * @param options Overrides default HTTP headers
     * @returns {Promise<T>} The response data
     */
    async requestForRealm(realmName, endpoint, method, body, options) {
        try {
            const token = await this.getValidToken();
            const url = `${this.adminUrl}/realms/${realmName}${endpoint}`;
            return makeRequest(url, method, token, body, options);
        }
        catch (error) {
            console.error(`Request for realm ${realmName} failed for endpoint ${endpoint}:`, error);
            throw error;
        }
    }
}

module.exports = KeycloakAdminSDK;
//# sourceMappingURL=index.cjs.js.map
