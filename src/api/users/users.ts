import KeycloakAdminSDK from '../../index';
import {
    UserRepresentation,
    GetUsersParams,
    GetUserParams,
    CountUsersParams,
    UPConfig,
    UserProfileMetadata,
    SendVerifyEmailParams, ExecuteActionsEmailParams, UserSessionRepresentation, FederatedIdentityRepresentation
} from '../../types/users/users';
import {ConsentsApi} from "./consents";

export class UsersApi {
    public consents: ConsentsApi;

    constructor(private sdk: KeycloakAdminSDK) {
        this.consents = new ConsentsApi(sdk);
    }

    /**
     * Get a list of users.
     *
     * @param {GetUsersParams} [params] - Parameters to filter the users.
     * @returns {Promise<UserRepresentation[]>} A list of users.
     */
    async list(params?: GetUsersParams): Promise<UserRepresentation[]> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users${query ? `?${query}` : ''}`;
        return this.sdk.request<UserRepresentation[]>(endpoint, 'GET');
    }

    /**
     * Create a new user.
     *
     * @param {UserRepresentation} user - The user representation to create.
     * @returns {Promise<UserRepresentation>} The created user.
     */
    async create(user: UserRepresentation): Promise<UserRepresentation> {
        const endpoint = `/users`;
        return this.sdk.request<UserRepresentation>(endpoint, 'POST', user);
    }

    /**
     * Get representation of the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {GetUserParams} [params] - Parameters for the request.
     * @returns {Promise<UserRepresentation>} The user representation.
     */
    async get(userId: string, params?: GetUserParams): Promise<UserRepresentation> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/${userId}${query ? `?${query}` : ''}`;
        return this.sdk.request<UserRepresentation>(endpoint, 'GET');
    }

    /**
     * Update the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {UserRepresentation} user - The user representation with updated data.
     * @returns {Promise<void>}
     */
    async update(userId: string, user: UserRepresentation): Promise<void> {
        const endpoint = `/users/${userId}`;
        await this.sdk.request<void>(endpoint, 'PUT', user);
    }

    /**
     * Delete the user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<void>}
     */
    async delete(userId: string): Promise<void> {
        const endpoint = `/users/${userId}`;
        await this.sdk.request<void>(endpoint, 'DELETE');
    }

    /**
     * Get the number of users that match the given criteria.
     *
     * @param {CountUsersParams} [params] - Parameters to filter the users.
     * @returns {Promise<number>} The number of users.
     */
    async count(params?: CountUsersParams): Promise<number> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/count${query ? `?${query}` : ''}`;
        return this.sdk.request<number>(endpoint, 'GET');
    }

    /**
     * Get the configuration for the user profile.
     *
     * @returns {Promise<UPConfig>} The user profile configuration.
     */
    async getUserProfileConfig(): Promise<UPConfig> {
        const endpoint = `/users/profile`;
        return this.sdk.request<UPConfig>(endpoint, 'GET');
    }

    /**
     * Set the configuration for the user profile.
     *
     * @param {UPConfig} config - The new user profile configuration.
     * @returns {Promise<UPConfig>} The updated user profile configuration.
     */
    async setUserProfileConfig(config: UPConfig): Promise<UPConfig> {
        const endpoint = `/users/profile`;
        return this.sdk.request<UPConfig>(endpoint, 'PUT', config);
    }

    /**
     * Get the UserProfileMetadata from the configuration.
     *
     * @returns {Promise<UserProfileMetadata>} The user profile metadata.
     */
    async getUserProfileMetadata(): Promise<UserProfileMetadata> {
        const endpoint = `/users/profile/metadata`;
        return this.sdk.request<UserProfileMetadata>(endpoint, 'GET');
    }

    /**
     * Return credential types, which are provided by the user storage where user is stored.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<string[]>} A list of credential types.
     */
    async getUserStorageCredentialTypes(userId: string): Promise<string[]> {
        const endpoint = `/users/${userId}/configured-user-storage-credential-types`;
        return this.sdk.request<string[]>(endpoint, 'GET');
    }

    /**
     * Send an email to the user with a link they can click to execute particular actions.
     *
     * @param {string} userId - The ID of the user.
     * @param {string[]} actions - The actions the user can execute.
     * @param {ExecuteActionsEmailParams} [params] - Optional parameters for the request.
     * @returns {Promise<void>}
     */
    async executeActionsEmail(userId: string, actions: string[], params?: ExecuteActionsEmailParams): Promise<void> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/${userId}/execute-actions-email${query ? `?${query}` : ''}`;
        await this.sdk.request<void>(endpoint, 'PUT', actions);
    }

    /**
     * Send an email-verification email to the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {SendVerifyEmailParams} [params] - Optional parameters for the request.
     * @returns {Promise<void>}
     */
    async sendVerifyEmail(userId: string, params?: SendVerifyEmailParams): Promise<void> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/${userId}/send-verify-email${query ? `?${query}` : ''}`;
        await this.sdk.request<void>(endpoint, 'PUT');
    }

    /**
     * Get sessions associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<UserSessionRepresentation[]>} A list of user sessions.
     */
    async getUserSessions(userId: string): Promise<UserSessionRepresentation[]> {
        const endpoint = `/users/${userId}/sessions`;
        return this.sdk.request<UserSessionRepresentation[]>(endpoint, 'GET');
    }

    /**
     * Get social logins associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<FederatedIdentityRepresentation[]>} A list of federated identities.
     */
    async getFederatedIdentities(userId: string): Promise<FederatedIdentityRepresentation[]> {
        const endpoint = `/users/${userId}/federated-identity`;
        return this.sdk.request<FederatedIdentityRepresentation[]>(endpoint, 'GET');
    }

    /**
     * Add a social login provider to the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} provider - The ID of the social login provider.
     * @returns {Promise<void>}
     */
    async addFederatedIdentity(userId: string, provider: string): Promise<void> {
        const endpoint = `/users/${userId}/federated-identity/${provider}`;
        await this.sdk.request<void>(endpoint, 'POST');
    }

    /**
     * Remove a social login provider from the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} provider - The ID of the social login provider.
     * @returns {Promise<void>}
     */
    async removeFederatedIdentity(userId: string, provider: string): Promise<void> {
        const endpoint = `/users/${userId}/federated-identity/${provider}`;
        await this.sdk.request<void>(endpoint, 'DELETE');
    }
}
