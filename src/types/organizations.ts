/**
 * Organization types for Keycloak Admin SDK
 *
 * These types represent the organization-related objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */

import { IdentityProviderRepresentation } from './realms';

/**
 * Organization domain representation
 */
export interface OrganizationDomainRepresentation {
  /**
   * Domain name
   */
  name?: string;

  /**
   * Whether the domain is verified
   */
  verified?: boolean;
}

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
   * Organization alias
   */
  alias?: string;

  /**
   * Whether the organization is enabled
   */
  enabled?: boolean;

  /**
   * Organization description
   */
  description?: string;

  /**
   * Organization redirect URL
   */
  redirectUrl?: string;

  /**
   * Organization attributes
   */
  attributes?: Record<string, string[]>;

  /**
   * Organization domains
   */
  domains?: OrganizationDomainRepresentation[];

  /**
   * Organization members
   */
  members?: OrganizationMemberRepresentation[];

  /**
   * Organization identity providers
   */
  identityProviders?: IdentityProviderRepresentation[];
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
