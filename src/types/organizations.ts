/**
 * Organization types for Keycloak Admin SDK
 * 
 * These types represent the organization-related objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */

/**
 * Organization representation
 */
export interface OrganizationRepresentation {
  /**
   * Organization ID
   */
  id?: string;
  
  /**
   * Organization name
   */
  name?: string;
  
  /**
   * Organization display name
   */
  displayName?: string;
  
  /**
   * Organization URL
   */
  url?: string;
  
  /**
   * Organization domains
   */
  domains?: string[];
  
  /**
   * Organization attributes
   */
  attributes?: Record<string, string[]>;
  
  /**
   * Organization realm roles
   */
  realmRoles?: string[];
  
  /**
   * Organization client roles
   */
  clientRoles?: Record<string, string[]>;
  
  /**
   * Organization groups
   */
  groups?: string[];
  
  /**
   * Organization members
   */
  members?: OrganizationMemberRepresentation[];
}

/**
 * Organization member representation
 */
export interface OrganizationMemberRepresentation {
  /**
   * Member ID (user ID)
   */
  id?: string;
  
  /**
   * Member username
   */
  username?: string;
  
  /**
   * Member email
   */
  email?: string;
  
  /**
   * Member first name
   */
  firstName?: string;
  
  /**
   * Member last name
   */
  lastName?: string;
  
  /**
   * Member roles within the organization
   */
  roles?: string[];
  
  /**
   * Member join date
   */
  joinedAt?: string;
}

/**
 * Organization search query parameters
 */
export interface OrganizationQuery {
  /**
   * Search string to filter organizations
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
   * Exact match for name
   */
  exact?: boolean;
}
