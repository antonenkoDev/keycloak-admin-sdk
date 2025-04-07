/**
 * Type definitions for Keycloak certificate management
 */

/**
 * Represents a certificate configuration
 */
export interface CertificateRepresentation {
  /**
   * Certificate in PEM format
   */
  certificate?: string;

  /**
   * Private key in PEM format (only included in specific operations)
   */
  privateKey?: string;

  /**
   * Public key in PEM format
   */
  publicKey?: string;

  /**
   * Key type (e.g., RSA)
   */
  keyType?: string;

  /**
   * Key usage
   */
  keyUsage?: string;

  /**
   * Algorithm used (e.g., RS256)
   */
  algorithm?: string;

  /**
   * Key size in bits
   */
  keySize?: number;

  /**
   * Certificate serial number
   */
  serialNumber?: string;

  /**
   * Certificate subject DN
   */
  subjectDN?: string;

  /**
   * Certificate issuer DN
   */
  issuerDN?: string;

  /**
   * Not before date
   */
  notBefore?: number;

  /**
   * Not after date (expiration)
   */
  notAfter?: number;
}

/**
 * Configuration for keystore generation and management
 */
export interface KeyStoreConfig {
  /**
   * Keystore format (JKS, PKCS12)
   */
  format?: string;

  /**
   * Key alias in the keystore
   */
  keyAlias?: string;

  /**
   * Keystore password
   */
  keyPassword?: string;

  /**
   * Store password
   */
  storePassword?: string;

  /**
   * Key size in bits (e.g., 2048, 4096)
   */
  keySize?: number;

  /**
   * Key algorithm (e.g., RSA)
   */
  keyAlgorithm?: string;

  /**
   * Signature algorithm (e.g., SHA256withRSA)
   */
  signatureAlgorithm?: string;

  /**
   * Certificate validity in days
   */
  validity?: number;

  /**
   * Subject DN for the certificate
   */
  subject?: string;

  /**
   * Reuse existing key if present
   */
  reuseKey?: boolean;
}

/**
 * Represents client initial access token information
 */
export interface ClientInitialAccessPresentation {
  /**
   * Unique ID of the initial access token
   */
  id?: string;

  /**
   * Token value
   */
  token?: string;

  /**
   * Timestamp when the token was created
   */
  timestamp?: number;

  /**
   * Expiration time in seconds
   */
  expiration?: number;

  /**
   * Number of times the token can be used
   */
  count?: number;

  /**
   * Remaining uses of the token
   */
  remainingCount?: number;
}

/**
 * Parameters for creating a client initial access token
 */
export interface ClientInitialAccessCreatePresentation {
  /**
   * Token expiration time in seconds
   */
  expiration?: number;

  /**
   * Number of times the token can be used
   */
  count?: number;

  /**
   * ID of the created token (returned after creation)
   */
  id?: string;

  /**
   * Token value (returned after creation)
   */
  token?: string;
}

/**
 * Component type representation for client registration policy
 */
export interface ComponentTypeRepresentation {
  /**
   * Component ID
   */
  id?: string;

  /**
   * Component name
   */
  name?: string;

  /**
   * Help text
   */
  helpText?: string;

  /**
   * Configuration properties
   */
  properties?: Record<string, any>;

  /**
   * Metadata
   */
  metadata?: Record<string, any>;
}
