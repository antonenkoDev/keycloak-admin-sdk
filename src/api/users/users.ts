import KeycloakAdminSDK from '../../index';
import {
    UserRepresentation,
    GetUsersParams,
    GetUserParams,
    CountUsersParams,
    UPConfig,
    UserProfileMetadata,
    SendVerifyEmailParams,
    ExecuteActionsEmailParams,
    UserSessionRepresentation,
    FederatedIdentityRepresentation
} from '../../types/users';
import {ConsentsApi} from "./consents";
import {CredentialsApi} from "./credentials";
import {GroupsApi} from "./groups";

export class UsersApi {
    public consents: ConsentsApi;
    public credentials: CredentialsApi;
    public groups: GroupsApi;

    constructor(private sdk: KeycloakAdminSDK) {
        this.consents = new ConsentsApi(sdk);
        this.credentials = new CredentialsApi(sdk);
        this.groups = new GroupsApi(sdk);
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
    async list(params?: GetUsersParams): Promise<UserRepresentation[]> {
        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/users${query ? `?${query}` : ''}`;
            return this.sdk.request<UserRepresentation[]>(endpoint, 'GET');
        } catch (error) {
            throw new Error(`Failed to retrieve users list: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Create a new user.
     * 
     * Endpoint: POST /admin/realms/{realm}/users
     *
     * @param {UserRepresentation} user - The user representation to create
     * @returns {Promise<UserRepresentation>} The created user
     * @throws {Error} If the request fails or user data is invalid
     */
    async create(user: UserRepresentation): Promise<UserRepresentation> {
        if (!user) {
            throw new Error('User data is required');
        }

        try {
            const endpoint = `/users`;
            return this.sdk.request<UserRepresentation>(endpoint, 'POST', user);
        } catch (error) {
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
    async get(userId: string, params?: GetUserParams): Promise<UserRepresentation> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/users/${userId}${query ? `?${query}` : ''}`;
            return this.sdk.request<UserRepresentation>(endpoint, 'GET');
        } catch (error) {
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
    async update(userId: string, user: UserRepresentation): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!user) {
            throw new Error('User data is required');
        }

        try {
            const endpoint = `/users/${userId}`;
            await this.sdk.request<void>(endpoint, 'PUT', user);
        } catch (error) {
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
    async delete(userId: string): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const endpoint = `/users/${userId}`;
            await this.sdk.request<void>(endpoint, 'DELETE');
        } catch (error) {
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
    async count(params?: CountUsersParams): Promise<number> {
        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/users/count${query ? `?${query}` : ''}`;
            return this.sdk.request<number>(endpoint, 'GET');
        } catch (error) {
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
    async getUserProfileConfig(): Promise<UPConfig> {
        try {
            const endpoint = `/users/profile`;
            return this.sdk.request<UPConfig>(endpoint, 'GET');
        } catch (error) {
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
    async setUserProfileConfig(config: UPConfig): Promise<UPConfig> {
        if (!config) {
            throw new Error('User profile configuration is required');
        }
        
        const endpoint = `/users/profile`;
        return this.sdk.request<UPConfig>(endpoint, 'PUT', config);
    }

    /**
     * Get the UserProfileMetadata from the configuration.
     * 
     * Endpoint: GET /admin/realms/{realm}/users/profile/metadata
     *
     * @returns {Promise<UserProfileMetadata>} The user profile metadata
     * @throws {Error} If the request fails
     */
    async getUserProfileMetadata(): Promise<UserProfileMetadata> {
        try {
            const endpoint = `/users/profile/metadata`;
            return this.sdk.request<UserProfileMetadata>(endpoint, 'GET');
        } catch (error) {
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
    async getUserStorageCredentialTypes(userId: string): Promise<string[]> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const endpoint = `/users/${userId}/configured-user-storage-credential-types`;
            return this.sdk.request<string[]>(endpoint, 'GET');
        } catch (error) {
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
    async executeActionsEmail(userId: string, actions: string[], params?: ExecuteActionsEmailParams): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!actions || !Array.isArray(actions) || actions.length === 0) {
            throw new Error('At least one action is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/users/${userId}/execute-actions-email${query ? `?${query}` : ''}`;
            await this.sdk.request<void>(endpoint, 'PUT', actions);
        } catch (error) {
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
    async sendVerifyEmail(userId: string, params?: SendVerifyEmailParams): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/users/${userId}/send-verify-email${query ? `?${query}` : ''}`;
            await this.sdk.request<void>(endpoint, 'PUT');
        } catch (error) {
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
    async getUserSessions(userId: string): Promise<UserSessionRepresentation[]> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const endpoint = `/users/${userId}/sessions`;
            return this.sdk.request<UserSessionRepresentation[]>(endpoint, 'GET');
        } catch (error) {
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
    async getFederatedIdentities(userId: string): Promise<FederatedIdentityRepresentation[]> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const endpoint = `/users/${userId}/federated-identity`;
            return this.sdk.request<FederatedIdentityRepresentation[]>(endpoint, 'GET');
        } catch (error) {
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
    async addFederatedIdentity(userId: string, provider: string): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!provider) {
            throw new Error('Provider ID is required');
        }

        try {
            const endpoint = `/users/${userId}/federated-identity/${provider}`;
            await this.sdk.request<void>(endpoint, 'POST');
        } catch (error) {
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
    async removeFederatedIdentity(userId: string, provider: string): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!provider) {
            throw new Error('Provider ID is required');
        }

        try {
            const endpoint = `/users/${userId}/federated-identity/${provider}`;
            await this.sdk.request<void>(endpoint, 'DELETE');
        } catch (error) {
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
    async impersonate(userId: string): Promise<Record<string, any>> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const endpoint = `/users/${userId}/impersonation`;
            return this.sdk.request<Record<string, any>>(endpoint, 'POST');
        } catch (error) {
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
    async logout(userId: string): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const endpoint = `/users/${userId}/logout`;
            await this.sdk.request<void>(endpoint, 'POST');
        } catch (error) {
            throw new Error(`Failed to logout user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get offline sessions associated with the user and client.
     * 
     * Endpoint: GET /admin/realms/{realm}/users/{id}/offline-sessions/{clientUuid}
     *
     * @param {string} userId - The ID of the user
     * @param {string} clientUuid - The UUID of the client
     * @returns {Promise<UserSessionRepresentation[]>} A list of user sessions
     * @throws {Error} If the request fails or parameters are invalid
     */
    async getOfflineSessions(userId: string, clientUuid: string): Promise<UserSessionRepresentation[]> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        if (!clientUuid) {
            throw new Error('Client UUID is required');
        }

        try {
            const endpoint = `/users/${userId}/offline-sessions/${clientUuid}`;
            return this.sdk.request<UserSessionRepresentation[]>(endpoint, 'GET');
        } catch (error) {
            throw new Error(`Failed to get offline sessions for user ${userId} and client ${clientUuid}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
