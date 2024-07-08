// src/index.ts

import { UsersApi } from './api/users';
import { KeycloakConfig } from './types/auth';
import { getToken } from './utils/auth';
import {HttpMethod, makeRequest} from "./utils/request";

class KeycloakAdminSDK {
    private baseUrl: string;
    private config: KeycloakConfig;
    private token: string | null = null;
    public users: UsersApi;

    constructor(config: KeycloakConfig) {
        this.config = config;
        this.baseUrl = `${config.baseUrl}/admin/realms/${config.realm}`;
        this.users = new UsersApi(this);
    }

    async getValidToken(): Promise<string> {
        if (this.token) {
            return this.token;
        }

        this.token = await getToken(this.config);
        return this.token;
    }

    async request<T>(endpoint: string, method: HttpMethod, body?: any): Promise<T> {
        const token = await this.getValidToken();
        return makeRequest<T>(`${this.baseUrl}${endpoint}`, method, token, body);
    }
}

export default KeycloakAdminSDK;
