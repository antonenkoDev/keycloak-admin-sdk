// src/api/users.ts

import KeycloakAdminSDK  from '../index';
import {GetUserParams, GetUsersParams, UserRepresentation} from "../types/users";

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
}
