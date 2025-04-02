/**
 * Types for the Keycloak Roles API
 * 
 * These types represent the role-related objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_roles
 */

/**
 * Represents a Keycloak role
 */
export interface RoleRepresentation {
    /**
     * Role ID
     */
    id?: string;
    
    /**
     * Role name
     */
    name?: string;
    
    /**
     * Role description
     */
    description?: string;
    
    /**
     * Whether this role is composite (i.e., it contains other roles)
     */
    composite?: boolean;
    
    /**
     * Map of composites: { "realm": ["role1", "role2"], "client": ["role3", "role4"] }
     */
    composites?: Record<string, string[]>;
    
    /**
     * Whether this is a client role (true) or realm role (false)
     */
    clientRole?: boolean;
    
    /**
     * Container ID (realm ID or client ID)
     */
    containerId?: string;
    
    /**
     * Role attributes
     */
    attributes?: Record<string, string[]>;
}

/**
 * Represents a collection of roles
 */
export interface RolesRepresentation {
    /**
     * Realm roles
     */
    realm?: RoleRepresentation[];
    
    /**
     * Client roles, keyed by client ID
     */
    client?: Record<string, RoleRepresentation[]>;
}

/**
 * Role query parameters
 */
export interface RoleQuery {
    /**
     * Search string to filter roles
     */
    search?: string;
    
    /**
     * First result index
     */
    first?: number;
    
    /**
     * Maximum number of results
     */
    max?: number;
    
    /**
     * If true, return a brief representation of roles
     */
    briefRepresentation?: boolean;
}
