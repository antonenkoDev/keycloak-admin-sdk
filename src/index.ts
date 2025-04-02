/**
 * Keycloak Admin SDK
 * A TypeScript SDK for interacting with the Keycloak Admin REST API
 */

import { UsersApi } from './api/users/users';
import { GroupsApi } from './api/groups';
import { KeycloakConfig } from './types/auth';
import { getToken } from './utils/auth';
import { HttpMethod, makeRequest } from "./utils/request";

/**
 * Main SDK class for interacting with the Keycloak Admin REST API
 */
class KeycloakAdminSDK {
    private baseUrl: string;
    private config: KeycloakConfig;
    private token: string | null = null;
    
    // API endpoints
    public users: UsersApi;
    public groups: GroupsApi;

    /**
     * Creates a new instance of the Keycloak Admin SDK
     * 
     * @param {KeycloakConfig} config - Configuration for connecting to Keycloak
     */
    constructor(config: KeycloakConfig) {
        this.config = config;
        this.baseUrl = `${config.baseUrl}/admin/realms/${config.realm}`;
        
        // Initialize API endpoints
        this.users = new UsersApi(this);
        this.groups = new GroupsApi(this);
    }

    /**
     * Gets a valid authentication token
     * 
     * @returns {Promise<string>} A valid authentication token
     */
    async getValidToken(): Promise<string> {
        if (this.token) {
            return this.token;
        }

        this.token = await getToken(this.config);
        return this.token;
    }

    /**
     * Makes an authenticated request to the Keycloak Admin REST API
     * 
     * @param {string} endpoint - The API endpoint to call
     * @param {HttpMethod} method - The HTTP method to use
     * @param {any} [body] - Optional request body
     * @returns {Promise<T>} The response data
     */
    async request<T>(endpoint: string, method: HttpMethod, body?: any): Promise<T> {
        const token = await this.getValidToken();
        return makeRequest<T>(`${this.baseUrl}${endpoint}`, method, token, body);
    }
}

export default KeycloakAdminSDK;
