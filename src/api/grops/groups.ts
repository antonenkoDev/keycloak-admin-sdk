import KeycloakAdminSDK from "../../index";
import {GetGroupsParams, GroupRepresentation} from "../../types/groups";

export class GroupsApi{
    constructor(private keycloakAdminSDK: KeycloakAdminSDK){}
    async list(params?: GetGroupsParams): Promise<GroupRepresentation[]>{
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/groups${query ? `?${query}` : ''}`;
       return this.keycloakAdminSDK.request<GroupRepresentation[]>(endpoint, 'GET');
    }
    async create(group: GroupRepresentation): Promise<GroupRepresentation>{
        const endpoint = `/groups`;
        return this.keycloakAdminSDK.request<GroupRepresentation>(endpoint, 'POST', group);
    }
    async get(groupId: string, params?: GetGroupsParams): Promise<GroupRepresentation>{
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/groups/${groupId}${query ? `?${query}` : ''}`;
        return this.keycloakAdminSDK.request<GroupRepresentation>(endpoint, 'GET');
    }
    async update(groupId: string, group: GroupRepresentation): Promise<void>{
        const endpoint = `/groups/${groupId}`;
        return this.keycloakAdminSDK.request<void>(endpoint, 'PUT', group);
    }
    async delete(groupId: string): Promise<void>{
        const endpoint = `/groups/${groupId}`;
        return this.keycloakAdminSDK.request<void>(endpoint, 'DELETE');
    }
}