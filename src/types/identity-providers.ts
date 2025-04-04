/**
 * Identity Provider Types for Keycloak Admin SDK
 *
 * This module provides TypeScript interfaces for Keycloak Identity Providers.
 * Following SOLID principles and clean code practices.
 */

/**
 * Representation of a Keycloak Identity Provider
 */
export interface IdentityProviderRepresentation {
  /**
   * Unique identifier of the identity provider
   */
  id?: string;

  /**
   * Alias used to identify the provider
   */
  alias?: string;

  /**
   * Display name of the provider
   */
  displayName?: string;

  /**
   * Whether the provider is enabled
   */
  enabled?: boolean;

  /**
   * Provider type (e.g., 'oidc', 'saml', etc.)
   */
  providerId?: string;

  /**
   * Whether this provider is the default
   */
  firstBrokerLoginFlowAlias?: string;

  /**
   * Authentication flow to use after first broker login
   */
  postBrokerLoginFlowAlias?: string;

  /**
   * Whether to store tokens locally
   */
  storeToken?: boolean;

  /**
   * Whether to add read token role on login
   */
  addReadTokenRoleOnCreate?: boolean;

  /**
   * Whether to trust email from this provider
   */
  trustEmail?: boolean;

  /**
   * Whether to link users automatically
   */
  linkOnly?: boolean;

  /**
   * Provider-specific configuration
   */
  config?: Record<string, string>;
}
