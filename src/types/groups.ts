/**
 * Types for the Keycloak Groups API
 */

/**
 * Represents a Keycloak group
 */
export interface GroupRepresentation {
    id?: string;
    name?: string;
    path?: string;
    parentId?: string;
    subGroupCount?: number;
    subGroups?: GroupRepresentation[];
    attributes?: Record<string, string[]>;
    realmRoles?: string[];
    clientRoles?: Record<string, string[]>;
    access?: Record<string, boolean>;
}

/**
 * Parameters for getting groups
 */
export interface GetGroupsParams {
    briefRepresentation?: boolean;
    exact?: boolean;
    first?: number;
    max?: number;
    populateHierarchy?: boolean;
    q?: string;
    search?: string;
}

/**
 * Parameters for getting group count
 */
export interface GetGroupsCountParams {
    search?: string;
    top?: boolean;
}

/**
 * Parameters for getting group members
 */
export interface GetGroupMembersParams {
    briefRepresentation?: boolean;
    first?: number;
    max?: number;
}

/**
 * Parameters for getting group children
 */
export interface GetGroupChildrenParams {
    briefRepresentation?: boolean;
    exact?: boolean;
    first?: number;
    max?: number;
    search?: string;
}

/**
 * Reference for management permissions
 */
export interface ManagementPermissionReference {
    enabled?: boolean;
    resource?: string;
    scopePermissions?: Record<string, string>;
}
