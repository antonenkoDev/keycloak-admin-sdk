import KeycloakAdminSDK from '../../index';
import { UserRepresentation } from '../../types/users';
import {
    GroupRepresentation,
    GetGroupsParams,
    GetGroupsCountParams,
    GetGroupMembersParams,
    GetGroupChildrenParams,
    ManagementPermissionReference
} from '../../types/groups';

/**
 * API for managing Keycloak groups
 */
export class GroupsApi {
    constructor(private sdk: KeycloakAdminSDK) {}

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
    async list(params?: GetGroupsParams): Promise<GroupRepresentation[]> {
        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/groups${query ? `?${query}` : ''}`;
            return this.sdk.request<GroupRepresentation[]>(endpoint, 'GET');
        } catch (error) {
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
    async count(params?: GetGroupsCountParams): Promise<Record<string, number>> {
        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/groups/count${query ? `?${query}` : ''}`;
            return this.sdk.request<Record<string, number>>(endpoint, 'GET');
        } catch (error) {
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
    async create(group: GroupRepresentation): Promise<string> {
        if (!group) {
            throw new Error('Group data is required');
        }

        try {
            const endpoint = `/groups`;
            
            // Make the POST request to create the group
            // Keycloak returns a 201 Created with a Location header containing the group ID
            // Our enhanced request utility will extract the ID from the Location header
            const result = await this.sdk.request<{id: string}>(endpoint, 'POST', group);
            
            if (result && result.id) {
                console.log(`Created group with ID: ${result.id}`);
                return result.id;
            }
            
            // Fallback to finding the group by name if the ID wasn't extracted from the Location header
            if (group.name) {
                console.log('ID not found in response, falling back to finding group by name');
                const groups = await this.list({ search: group.name });
                const createdGroup = groups.find(g => g.name === group.name);
                
                if (createdGroup && createdGroup.id) {
                    console.log(`Found group with ID: ${createdGroup.id}`);
                    return createdGroup.id;
                }
            }
            
            throw new Error('Group was created but could not be found');
        } catch (error) {
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
    async get(groupId: string): Promise<GroupRepresentation> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }

        try {
            const endpoint = `/groups/${groupId}`;
            return this.sdk.request<GroupRepresentation>(endpoint, 'GET');
        } catch (error) {
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
    async update(groupId: string, group: GroupRepresentation): Promise<void> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        
        if (!group) {
            throw new Error('Group data is required');
        }

        try {
            const endpoint = `/groups/${groupId}`;
            await this.sdk.request<void>(endpoint, 'PUT', group);
        } catch (error) {
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
    async delete(groupId: string): Promise<void> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }

        try {
            const endpoint = `/groups/${groupId}`;
            await this.sdk.request<void>(endpoint, 'DELETE');
        } catch (error) {
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
    async getChildren(groupId: string, params?: GetGroupChildrenParams): Promise<GroupRepresentation[]> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/groups/${groupId}/children${query ? `?${query}` : ''}`;
            return this.sdk.request<GroupRepresentation[]>(endpoint, 'GET');
        } catch (error) {
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
    async createChild(groupId: string, child: GroupRepresentation): Promise<void> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        
        if (!child) {
            throw new Error('Child group data is required');
        }

        try {
            const endpoint = `/groups/${groupId}/children`;
            await this.sdk.request<void>(endpoint, 'POST', child);
        } catch (error) {
            throw new Error(`Failed to create child group for parent ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
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
    async getMembers(groupId: string, params?: GetGroupMembersParams): Promise<UserRepresentation[]> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }

        try {
            const query = new URLSearchParams(params as any).toString();
            const endpoint = `/groups/${groupId}/members${query ? `?${query}` : ''}`;
            return this.sdk.request<UserRepresentation[]>(endpoint, 'GET');
        } catch (error) {
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
    async getManagementPermissions(groupId: string): Promise<ManagementPermissionReference> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }

        try {
            const endpoint = `/groups/${groupId}/management/permissions`;
            return this.sdk.request<ManagementPermissionReference>(endpoint, 'GET');
        } catch (error) {
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
    async setManagementPermissions(
        groupId: string, 
        permissions: ManagementPermissionReference
    ): Promise<ManagementPermissionReference> {
        if (!groupId) {
            throw new Error('Group ID is required');
        }
        
        if (!permissions) {
            throw new Error('Permissions data is required');
        }

        try {
            const endpoint = `/groups/${groupId}/management/permissions`;
            return this.sdk.request<ManagementPermissionReference>(endpoint, 'PUT', permissions);
        } catch (error) {
            throw new Error(`Failed to set management permissions for group ${groupId}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
