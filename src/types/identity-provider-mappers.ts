/**
 * Type definitions for Identity Provider Mappers in Keycloak Admin SDK
 *
 * These types represent the structure of identity provider mappers in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_identity_provider_mapper_representation
 */

/**
 * Configuration property for an identity provider mapper type
 */
export interface IdentityProviderMapperConfigProperty {
  /**
   * Name of the configuration property
   */
  name: string;

  /**
   * Label for the configuration property
   */
  label: string;

  /**
   * Help text for the configuration property
   */
  helpText?: string;

  /**
   * Type of the configuration property (e.g., 'String', 'boolean')
   */
  type: string;

  /**
   * Default value for the configuration property
   */
  defaultValue?: string;

  /**
   * Whether the configuration property is required
   */
  required?: boolean;

  /**
   * Whether the configuration property is a secret (e.g., password)
   */
  secret?: boolean;

  /**
   * Whether the configuration property is read-only
   */
  readOnly?: boolean;

  /**
   * Options for the configuration property (for enum-like properties)
   */
  options?: string[];
}

/**
 * Representation of an identity provider mapper type
 */
export interface IdentityProviderMapperTypeRepresentation {
  /**
   * ID of the mapper type
   */
  id: string;

  /**
   * Name of the mapper type
   */
  name: string;

  /**
   * Category of the mapper type
   */
  category?: string;

  /**
   * Help text for the mapper type
   */
  helpText?: string;

  /**
   * Configuration properties for the mapper type
   */
  properties?: IdentityProviderMapperConfigProperty[];
}

/**
 * Representation of an identity provider mapper
 */
export interface IdentityProviderMapperRepresentation {
  /**
   * ID of the mapper
   */
  id?: string;

  /**
   * Name of the mapper
   */
  name: string;

  /**
   * ID of the identity provider
   */
  identityProviderAlias: string;

  /**
   * ID of the mapper type
   */
  identityProviderMapper: string;

  /**
   * Configuration for the mapper
   */
  config?: Record<string, string>;
}
