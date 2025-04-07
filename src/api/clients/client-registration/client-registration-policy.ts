/**
 * Client Registration Policy API for Keycloak Admin SDK
 * Provides methods for managing client registration policies in Keycloak
 */

import KeycloakAdminSDK from '../../../index';
import { ComponentTypeRepresentation } from '../../../types/certificates';

/**
 * API for managing Keycloak client registration policies
 */
export class ClientRegistrationPolicyApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Creates a new instance of the Client Registration Policy API
   *
   * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get all client registration policy providers
   * Base path for retrieve providers with the configProperties properly filled
   *
   * Endpoint: GET /{realm}/client-registration-policy/providers
   *
   * @returns {Promise<ComponentTypeRepresentation[]>} List of client registration policy providers
   * @throws {Error} If the request fails
   */
  async getProviders(): Promise<ComponentTypeRepresentation[]> {
    try {
      return this.sdk.request<ComponentTypeRepresentation[]>(
        '/client-registration-policy/providers',
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get client registration policy providers: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
