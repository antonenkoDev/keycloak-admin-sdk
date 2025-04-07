/**
 * Client Certificates API for Keycloak Admin SDK
 * Provides methods for managing client certificates in Keycloak
 */

import KeycloakClient from '../../../index';
import { CertificateRepresentation, KeyStoreConfig } from '../../../types/certificates';

/**
 * API for managing Keycloak client certificates
 */
export class ClientCertificatesApi {
  private sdk: KeycloakClient;

  /**
   * Creates a new instance of the Client Certificates API
   *
   * @param {KeycloakClient} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakClient) {
    this.sdk = sdk;
  }

  /**
   * Get certificate information for a client
   *
   * Endpoint: GET /{realm}/clients/{client-uuid}/certificates/{attr}
   *
   * @param {string} clientId - The client UUID (not client-id)
   * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
   * @returns {Promise<CertificateRepresentation>} Certificate information
   * @throws {Error} If the request fails or parameters are invalid
   */
  async getCertificateInfo(clientId: string, attr: string): Promise<CertificateRepresentation> {
    if (!clientId) {
      throw new Error('Client UUID is required');
    }

    if (!attr) {
      throw new Error('Certificate attribute is required');
    }

    try {
      return this.sdk.request<CertificateRepresentation>(
        `/clients/${clientId}/certificates/${attr}`,
        'GET'
      );
    } catch (error) {
      throw new Error(
        `Failed to get certificate info: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate a new certificate with new key pair
   *
   * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/generate
   *
   * @param {string} clientId - The client UUID (not client-id)
   * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
   * @returns {Promise<CertificateRepresentation>} Generated certificate information
   * @throws {Error} If the request fails or parameters are invalid
   */
  async generateCertificate(clientId: string, attr: string): Promise<CertificateRepresentation> {
    if (!clientId) {
      throw new Error('Client UUID is required');
    }

    if (!attr) {
      throw new Error('Certificate attribute is required');
    }

    try {
      return this.sdk.request<CertificateRepresentation>(
        `/clients/${clientId}/certificates/${attr}/generate`,
        'POST'
      );
    } catch (error) {
      throw new Error(
        `Failed to generate certificate: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Upload only certificate, not private key
   *
   * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/upload-certificate
   *
   * @param {string} clientId - The client UUID (not client-id)
   * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
   * @param {CertificateRepresentation} certificate - Certificate data with certificate field
   * @returns {Promise<CertificateRepresentation>} Updated certificate information
   * @throws {Error} If the request fails or parameters are invalid
   */
  async uploadCertificate(
    clientId: string,
    attr: string,
    certificate: CertificateRepresentation
  ): Promise<CertificateRepresentation> {
    if (!clientId) {
      throw new Error('Client UUID is required');
    }

    if (!attr) {
      throw new Error('Certificate attribute is required');
    }

    if (!certificate || !certificate.certificate) {
      throw new Error('Certificate data with certificate field is required');
    }

    try {
      return this.sdk.request<CertificateRepresentation>(
        `/clients/${clientId}/certificates/${attr}/upload-certificate`,
        'POST',
        certificate
      );
    } catch (error) {
      throw new Error(
        `Failed to upload certificate: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Upload certificate and eventually private key
   *
   * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/upload
   *
   * @param {string} clientId - The client UUID (not client-id)
   * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
   * @param {CertificateRepresentation} certificate - Certificate data with certificate and privateKey fields
   * @returns {Promise<CertificateRepresentation>} Updated certificate information
   * @throws {Error} If the request fails or parameters are invalid
   */
  async uploadCertificateWithKey(
    clientId: string,
    attr: string,
    certificate: CertificateRepresentation
  ): Promise<CertificateRepresentation> {
    if (!clientId) {
      throw new Error('Client UUID is required');
    }

    if (!attr) {
      throw new Error('Certificate attribute is required');
    }

    if (!certificate || !certificate.certificate) {
      throw new Error('Certificate data with certificate field is required');
    }

    try {
      return this.sdk.request<CertificateRepresentation>(
        `/clients/${clientId}/certificates/${attr}/upload`,
        'POST',
        certificate
      );
    } catch (error) {
      throw new Error(
        `Failed to upload certificate with key: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get a keystore file for the client, containing private key and public certificate
   *
   * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/download
   *
   * @param {string} clientId - The client UUID (not client-id)
   * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
   * @param {KeyStoreConfig} config - Keystore configuration
   * @returns {Promise<ArrayBuffer>} Keystore file as binary data
   * @throws {Error} If the request fails or parameters are invalid
   */
  async downloadKeystore(
    clientId: string,
    attr: string,
    config: KeyStoreConfig
  ): Promise<ArrayBuffer> {
    if (!clientId) {
      throw new Error('Client UUID is required');
    }

    if (!attr) {
      throw new Error('Certificate attribute is required');
    }

    if (!config) {
      throw new Error('Keystore configuration is required');
    }

    try {
      // Use custom headers for binary response
      const options = {
        headers: {
          Accept: 'application/octet-stream'
        }
      };

      const response = await this.sdk.request<{ text: ArrayBuffer }>(
        `/clients/${clientId}/certificates/${attr}/download`,
        'POST',
        config,
        options
      );
      return response.text;
    } catch (error) {
      throw new Error(
        `Failed to download keystore: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate a new keypair and certificate, and get the private key file
   * Only generated public certificate is saved in Keycloak DB - the private key is not.
   *
   * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/generate-and-download
   *
   * @param {string} clientId - The client UUID (not client-id)
   * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
   * @param {KeyStoreConfig} config - Keystore configuration
   * @returns {Promise<ArrayBuffer>} Generated keystore file as binary data
   * @throws {Error} If the request fails or parameters are invalid
   */
  async generateAndDownloadKeystore(
    clientId: string,
    attr: string,
    config: KeyStoreConfig
  ): Promise<ArrayBuffer> {
    if (!clientId) {
      throw new Error('Client UUID is required');
    }

    if (!attr) {
      throw new Error('Certificate attribute is required');
    }

    if (!config) {
      throw new Error('Keystore configuration is required');
    }

    try {
      // Use custom headers for binary response
      const options = {
        headers: {
          Accept: 'application/octet-stream'
        }
      };

      return this.sdk.request<ArrayBuffer>(
        `/clients/${clientId}/certificates/${attr}/generate-and-download`,
        'POST',
        config,
        options
      );
    } catch (error) {
      throw new Error(
        `Failed to generate and download keystore: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
