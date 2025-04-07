/**
 * Client Initial Access API for Keycloak Admin SDK
 * Provides methods for managing client initial access tokens in Keycloak
 */

import KeycloakClient from '../../../index';
import {
  ClientInitialAccessCreatePresentation,
  ClientInitialAccessPresentation
} from '../../../types/certificates';

/**
 * API for managing Keycloak client initial access tokens
 */
export class ClientInitialAccessApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Client Initial Access API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get all client initial access tokens
   *
   * Endpoint: GET /{realm}/clients-initial-access
   *
   * @returns {Promise<ClientInitialAccessPresentation[]>} List of client initial access tokens
   * @throws {Error} If the request fails
   */
  async findAll(): Promise<ClientInitialAccessPresentation[]> {
    try {
      return this.sdk.request<ClientInitialAccessPresentation[]>('/clients-initial-access', 'GET');
    } catch (error) {
      throw new Error(
        `Failed to get client initial access tokens: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new client initial access token
   *
   * Endpoint: POST /{realm}/clients-initial-access
   *
   * @param {ClientInitialAccessCreatePresentation} token - The token configuration
   * @returns {Promise<ClientInitialAccessCreatePresentation>} The created token with ID and token value
   * @throws {Error} If the request fails or token configuration is invalid
   */
  async create(
    token: ClientInitialAccessCreatePresentation
  ): Promise<ClientInitialAccessCreatePresentation> {
    if (!token) {
      throw new Error('Token configuration is required');
    }

    try {
      // Return the full response which includes the token value
      return this.sdk.request<ClientInitialAccessCreatePresentation>(
        '/clients-initial-access',
        'POST',
        token
      );
    } catch (error) {
      throw new Error(
        `Failed to create client initial access token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Delete a client initial access token
   *
   * Endpoint: DELETE /{realm}/clients-initial-access/{id}
   *
   * @param {string} id - The token ID
   * @returns {Promise<void>}
   * @throws {Error} If the request fails or ID is invalid
   */
  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Token ID is required');
    }

    try {
      await this.sdk.request<void>(`/clients-initial-access/${id}`, 'DELETE');
    } catch (error) {
      throw new Error(
        `Failed to delete client initial access token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
