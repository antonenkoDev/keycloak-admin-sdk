/**
 * Role Mappings types for Keycloak Admin SDK
 *
 * These types represent the role mappings objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html
 */

import { RoleRepresentation } from './roles';

/**
 * Representation of client role mappings
 */
export interface ClientMappingsRepresentation {
  /**
   * Client ID
   */
  id?: string;

  /**
   * Client name
   */
  client?: string;

  /**
   * Array of mapped roles
   */
  mappings?: RoleRepresentation[];
}

/**
 * Representation of all role mappings
 */
export interface MappingsRepresentation {
  /**
   * Realm role mappings
   */
  realmMappings?: RoleRepresentation[];

  /**
   * Client role mappings
   */
  clientMappings?: Record<string, ClientMappingsRepresentation>;
}

/**
 * Query parameters for effective role mappings
 */
export interface EffectiveRoleMappingsQuery {
  /**
   * If false, return roles with their attributes
   * @default true
   */
  briefRepresentation?: boolean;
}
