/**
 * Types for Keycloak Key API
 */

/**
 * Represents the key usage
 */
export enum KeyUse {
  SIG = 'sig',
  ENC = 'enc'
}

/**
 * Represents metadata for a single key
 */
export interface KeyMetadataRepresentation {
  /**
   * Provider ID
   */
  providerId?: string;

  /**
   * Provider priority
   */
  providerPriority?: number;

  /**
   * Key ID
   */
  kid?: string;

  /**
   * Key status
   */
  status?: string;

  /**
   * Key type
   */
  type?: string;

  /**
   * Algorithm used
   */
  algorithm?: string;

  /**
   * Public key
   */
  publicKey?: string;

  /**
   * Certificate
   */
  certificate?: string;

  /**
   * Key usage
   */
  use?: KeyUse;

  /**
   * Valid until timestamp
   */
  validTo?: number;
}

/**
 * Represents key store configuration
 */
export interface KeyStoreConfig {
  /**
   * Whether this is a realm certificate
   */
  realmCertificate?: boolean;

  /**
   * Store password
   */
  storePassword?: string;

  /**
   * Key password
   */
  keyPassword?: string;

  /**
   * Key alias
   */
  keyAlias?: string;

  /**
   * Realm alias
   */
  realmAlias?: string;

  /**
   * Format
   */
  format?: string;
}

/**
 * Represents metadata for all keys in a realm
 */
export interface KeysMetadataRepresentation {
  /**
   * Map of active keys by algorithm
   */
  active?: Record<string, string>;

  /**
   * List of all keys
   */
  keys?: KeyMetadataRepresentation[];
}
