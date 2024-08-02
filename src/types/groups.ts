// src/types/groups.ts

export interface GroupRepresentation {
    id?: string;
    name?: string;
    path?: string;
    subGroups?: GroupRepresentation[];
    access?: Record<string, boolean>;
    attributes?: Record<string, string[]>;
    clientRoles?: Record<string, string[]>;
    realmRoles?: string[];
    realmRoleMappings?: Record<string, string[]>;
    clientRoleMappings?: Record<string, Record<string, string[]>>;
    defaultRoles?: string[];
    managementRoles?: string[];
    members?: Record<string, string[]>;
    realmAccess?: Record<string, boolean>;
    scopeParamRequired?: boolean;
    clientRoleMappingsMetadata?: Record<string, Record<string, string>>;
    realmRoleMappingsMetadata?: Record<string, string>;
    clientRolesMetadata?: Record<string, string>;
    realmRolesMetadata?: string;
    attributesMetadata?: Record<string, string>;
    accessMetadata?: Record<string, string>;
    subGroupsMetadata?: Record<string, string>;
    managementRolesMetadata?: string;
    defaultRolesMetadata?: string;
    realmAccessMetadata?: Record<string, string>;
    membersMetadata?: Record<string, string>;
}

export interface GetGroupsParams {
    first?: number;
    max?: number;
    search?: string;
    top?: number;
    parentId?: string;
    briefRepresentation?: boolean;
    full?: boolean;
    withSubGroups?: boolean;
    withResources?: boolean;
    withResourcesName?: boolean;
    withClientRoles?: boolean;
    withRealmRoles?: boolean;
    withRealmRoleMappings?: boolean;
    withClientRoleMappings?: boolean;
    withMembers?: boolean;
    withManagementRoles?: boolean;
    withDefaultRoles?: boolean;
    withRealmAccess?: boolean;
    withAttributes?: boolean;
    scopeParamRequired?: boolean;
    scopeParamRequiredOnly?: boolean;
    clientRoleMappingsMetadata?: boolean;
    realmRoleMappingsMetadata?: boolean;
    clientRolesMetadata?: boolean;
    realmRolesMetadata?: boolean;
    attributesMetadata?: boolean;
    accessMetadata?: boolean;
    subGroupsMetadata?: boolean;
    managementRolesMetadata?: boolean;
    defaultRolesMetadata?: boolean;
    realmAccessMetadata?: boolean;
    membersMetadata?: boolean;
}