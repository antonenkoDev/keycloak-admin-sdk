/**
 * Keys API for Keycloak Admin SDK
 * Provides methods for managing keys in Keycloak
 */

import KeycloakClient from '../../index';
import { KeysMetadataRepresentation } from '../../types/keys';

/**
 * API for managing Keycloak keys
 */
export class KeysApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Keys API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get keys metadata for the current realm
   *
   * Endpoint: GET /{realm}/keys
   *
   * @returns {Promise<KeysMetadataRepresentation>} Keys metadata
   * @throws {Error} If the request fails
   */
  async getKeys(): Promise<KeysMetadataRepresentation> {
    try {
      return this.sdk.request<KeysMetadataRepresentation>('/keys', 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get keys metadata: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
