/**
 * Permission types for Keycloak Admin SDK
 *
 * These types represent the permission-related objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_roles
 */

/**
 * Management permission reference
 */
export interface ManagementPermissionReference {
  /**
   * Whether permissions are enabled
   */
  enabled?: boolean;

  /**
   * Resource ID
   */
  resource?: string;

  /**
   * Scope permissions
   */
  scopePermissions?: Record<string, string>;
}
