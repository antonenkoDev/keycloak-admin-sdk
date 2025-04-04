/**
 * Example demonstrating the usage of the Keys API
 * 
 * This example shows how to retrieve keys metadata from a Keycloak realm
 * and work with the active keys.
 */

import KeycloakAdminSDK from '../src';
import { KeysMetadataRepresentation, KeyMetadataRepresentation } from '../src/types/keys';

/**
 * Create a Keycloak Admin SDK instance with configuration from environment variables
 * @returns Configured SDK instance
 */
function createSdk(): KeycloakAdminSDK {
  return new KeycloakAdminSDK({
    baseUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'master',
    authMethod: 'password',
    credentials: {
      clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
      username: process.env.KEYCLOAK_USERNAME || 'admin',
      password: process.env.KEYCLOAK_PASSWORD || 'admin',
    }
  });
}

/**
 * Retrieves all keys from the Keycloak realm
 * @param sdk Keycloak Admin SDK instance
 * @returns Keys metadata from the realm
 */
async function getKeysMetadata(sdk: KeycloakAdminSDK): Promise<KeysMetadataRepresentation> {
  try {
    return await sdk.keys.getKeys();
  } catch (error) {
    throw new Error(`Failed to get keys metadata: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Determines if a key is currently active
 * 
 * @param key The key to check
 * @param keysMetadata The keys metadata containing active keys
 * @returns True if the key is active, false otherwise
 */
function isActiveKey(key: KeyMetadataRepresentation, keysMetadata: KeysMetadataRepresentation): boolean {
  if (!keysMetadata.active || !key.kid) {
    return false;
  }
  
  // Check if this key is active for any algorithm
  return Object.values(keysMetadata.active).includes(key.kid);
}

/**
 * Finds and returns the active signing key
 * 
 * @param keysMetadata The keys metadata
 * @returns The active signing key or null if not found
 */
function getActiveSigningKey(keysMetadata: KeysMetadataRepresentation): KeyMetadataRepresentation | null {
  if (!keysMetadata.active || !keysMetadata.keys) {
    return null;
  }
  
  // Find the active RS256 signing key (most commonly used for tokens)
  const activeRsaKeyId = keysMetadata.active['RS256'];
  
  if (activeRsaKeyId) {
    const activeKey = keysMetadata.keys.find(k => k.kid === activeRsaKeyId);
    return activeKey || null;
  }
  
  return null;
}

/**
 * Get all keys with certificates
 * @param keysMetadata The keys metadata
 * @returns Array of keys that have certificates
 */
function getKeysWithCertificates(keysMetadata: KeysMetadataRepresentation): KeyMetadataRepresentation[] {
  if (!keysMetadata.keys) {
    return [];
  }
  
  return keysMetadata.keys.filter(k => k.certificate) || [];
}

/**
 * Example of using the Keys API
 * @returns Object containing key information
 */
async function example(): Promise<{
  totalKeys: number;
  activeAlgorithms: string[];
  activeSigningKey: { kid: string | undefined; algorithm: string | undefined; hasCertificate: boolean; } | null;
  keysWithCertificates: number;
}> {
  try {
    const sdk = createSdk();
    const keysMetadata = await getKeysMetadata(sdk);
    
    // Get the active signing key
    const activeSigningKey = getActiveSigningKey(keysMetadata);
    
    // Get keys with certificates
    const keysWithCerts = getKeysWithCertificates(keysMetadata);
    
    // Return structured data instead of logging
    return {
      totalKeys: keysMetadata.keys?.length || 0,
      activeAlgorithms: Object.keys(keysMetadata.active || {}),
      activeSigningKey: activeSigningKey ? {
        kid: activeSigningKey.kid,
        algorithm: activeSigningKey.algorithm,
        hasCertificate: !!activeSigningKey.certificate
      } : null,
      keysWithCertificates: keysWithCerts.length
    };
  } catch (error) {
    throw new Error(`Error in keys example: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  example()
    .then(result => {
      // Only stringify the result when running as a script
      return JSON.stringify(result, null, 2);
    })
    .catch(error => {
      process.exit(1);
    });
}

export { getKeysMetadata, isActiveKey, getActiveSigningKey, getKeysWithCertificates };
