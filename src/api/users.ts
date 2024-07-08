// src/api/users.ts

import KeycloakAdminSDK  from '../index';
import {
    CountUsersParams,
    GetUserParams,
    GetUsersParams,
    UPConfig,
    UserProfileMetadata,
    UserRepresentation
} from "../types/users";

export class UsersApi {
    constructor(private sdk: KeycloakAdminSDK) {}

    async list(params?: GetUsersParams): Promise<UserRepresentation[]> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users${query ? `?${query}` : ''}`;
        return this.sdk.request<UserRepresentation[]>(endpoint, 'GET');
    }

    async create(user: UserRepresentation): Promise<UserRepresentation> {
        const endpoint = `/users`;
        return this.sdk.request<UserRepresentation>(endpoint, 'POST', user);
    }

    async get(userId: string, params?: GetUserParams): Promise<UserRepresentation> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/${userId}${query ? `?${query}` : ''}`;
        return this.sdk.request<UserRepresentation>(endpoint, 'GET');
    }

    async update(userId: string, user: UserRepresentation): Promise<void> {
        const endpoint = `/users/${userId}`;
        await this.sdk.request<void>(endpoint, 'PUT', user);
    }

    async delete(userId: string): Promise<void> {
        const endpoint = `/users/${userId}`;
        await this.sdk.request<void>(endpoint, 'DELETE');
    }

    async count(params?: CountUsersParams): Promise<number> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/count${query ? `?${query}` : ''}`;
        return this.sdk.request<number>(endpoint, 'GET');
    }

    async getUserProfileConfig(): Promise<UPConfig> {
        const endpoint = `/users/profile`;
        return this.sdk.request<UPConfig>(endpoint, 'GET');
    }

    async setUserProfileConfig(config: UPConfig): Promise<UPConfig> {
        const endpoint = `/users/profile`;
        return this.sdk.request<UPConfig>(endpoint, 'PUT', config);
    }

    async getUserProfileMetadata(): Promise<UserProfileMetadata> {
        const endpoint = `/users/profile/metadata`;
        return this.sdk.request<UserProfileMetadata>(endpoint, 'GET');
    }

    async getUserStorageCredentialTypes(userId: string): Promise<string[]> {
        const endpoint = `/users/${userId}/configured-user-storage-credential-types`;
        return this.sdk.request<string[]>(endpoint, 'GET');
    }
}
