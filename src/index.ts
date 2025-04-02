/**
 * Keycloak Admin SDK
 * A TypeScript SDK for interacting with the Keycloak Admin REST API
 */

import { UsersApi } from './api/users/users';
import { GroupsApi } from './api/groups';
import { RealmsApi } from './api/realms';
import { ClientsApi } from './api/clients';
import { KeycloakConfig } from './types/auth';
import { getToken } from './utils/auth';
import { HttpMethod, makeRequest } from "./utils/request";

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
     * Makes an authenticated request to the Keycloak Admin REST API for the configured realm
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
    
    /**
     * Makes an authenticated request to the Keycloak Admin REST API without including a realm in the URL
     * Used for global admin endpoints like /admin/realms
     * 
     * @param {string} endpoint - The API endpoint to call
     * @param {HttpMethod} method - The HTTP method to use
     * @param {any} [body] - Optional request body
     * @returns {Promise<T>} The response data
     */
    async requestWithoutRealm<T>(endpoint: string, method: HttpMethod, body?: any): Promise<T> {
        const token = await this.getValidToken();
        return makeRequest<T>(`${this.adminUrl}/realms${endpoint}`, method, token, body);
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
    async requestForRealm<T>(realmName: string, endpoint: string, method: HttpMethod, body?: any): Promise<T> {
        const token = await this.getValidToken();
        return makeRequest<T>(`${this.adminUrl}/realms/${realmName}${endpoint}`, method, token, body);
    }
}

export default KeycloakAdminSDK;
