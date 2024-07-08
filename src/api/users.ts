// src/api/users.ts

import KeycloakAdminSDK  from '../index';
import { User, CreateUserInput, UpdateUserInput } from '../types';

export class UsersApi {
    constructor(private sdk: KeycloakAdminSDK) {}

    async list(): Promise<User[]> {
        return this.sdk.request<User[]>('/users', 'GET');
    }

    async create(input: CreateUserInput): Promise<User> {
        return this.sdk.request<User>('/users', 'POST', input);
    }

    async update(userId: string, input: UpdateUserInput): Promise<User> {
        return this.sdk.request<User>(`/users/${userId}`, 'PUT', input);
    }

    async delete(userId: string): Promise<void> {
        return this.sdk.request<void>(`/users/${userId}`, 'DELETE');
    }
}
