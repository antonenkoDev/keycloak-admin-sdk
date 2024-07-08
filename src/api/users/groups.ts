import KeycloakAdminSDK from "../../index";
import {GroupRepresentation} from "../../types/users/users";

export class GroupsApi {
    constructor(private sdk: KeycloakAdminSDK) {}

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
    async list(userId: string, params?: { briefRepresentation?: boolean; first?: number; max?: number; search?: string }): Promise<GroupRepresentation[]> {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/users/${userId}/groups${query ? `?${query}` : ''}`;
        return this.sdk.request<GroupRepresentation[]>(endpoint, 'GET');
    }

    /**
     * Get the count of groups associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} [search] - Search term.
     * @returns {Promise<number>} The count of groups.
     */
    async count(userId: string, search?: string): Promise<number> {
        const query = new URLSearchParams(search ? { search } : {}).toString();
        const endpoint = `/users/${userId}/groups/count${query ? `?${query}` : ''}`;
        return this.sdk.request<number>(endpoint, 'GET');
    }

    /**
     * Add a user to a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    async add(userId: string, groupId: string): Promise<void> {
        const endpoint = `/users/${userId}/groups/${groupId}`;
        await this.sdk.request<void>(endpoint, 'PUT');
    }

    /**
     * Remove a user from a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    async remove(userId: string, groupId: string): Promise<void> {
        const endpoint = `/users/${userId}/groups/${groupId}`;
        await this.sdk.request<void>(endpoint, 'DELETE');
    }
}
