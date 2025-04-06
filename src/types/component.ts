/**
 * Component representation types for Keycloak Admin SDK
 */

/**
 * Represents a Keycloak component
 */
export interface ComponentRepresentation {
  /**
   * Component ID
   */
  id?: string;

  /**
   * Component name
   */
  name?: string;

  /**
   * Provider ID
   */
  providerId?: string;

  /**
   * Provider type
   */
  providerType?: string;

  /**
   * Parent ID
   */
  parentId?: string;

  /**
   * Component sub type
   */
  subType?: string;

  /**
   * Component configuration
   */
  config?: Record<string, string[]>;
}

/**
 * Represents a Keycloak component type
 */
export interface ComponentTypeRepresentation {
  /**
   * Component type ID
   */
  id?: string;

  /**
   * Component help text
   */
  helpText?: string;

  /**
   * Properties of the component type
   */
  properties?: ComponentPropertyRepresentation[];

  /**
   * Metadata of the component type
   */
  metadata?: Record<string, any>;
}

/**
 * Represents a property of a component type
 */
export interface ComponentPropertyRepresentation {
  /**
   * Property name
   */
  name?: string;

  /**
   * Property label
   */
  label?: string;

  /**
   * Property help text
   */
  helpText?: string;

  /**
   * Property type
   */
  type?: string;

  /**
   * Default value
   */
  defaultValue?: string;

  /**
   * Options for select types
   */
  options?: string[];

  /**
   * Is the property secret?
   */
  secret?: boolean;

  /**
   * Is the property required?
   */
  required?: boolean;
}
