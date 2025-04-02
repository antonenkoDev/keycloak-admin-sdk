/**
 * Types for the Keycloak Roles API
 */

/**
 * Represents a Keycloak role
 */
export interface RoleRepresentation {
    id?: string;
    name?: string;
    description?: string;
    composite?: boolean;
    composites?: Record<string, string[]>;
    clientRole?: boolean;
    containerId?: string;
    attributes?: Record<string, string[]>;
}
