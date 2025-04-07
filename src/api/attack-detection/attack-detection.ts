/**
 * Attack Detection API for Keycloak Admin SDK
 * Provides methods for managing brute force detection for users
 */

import KeycloakAdminSDK from '../../index';

/**
 * Represents the status of a user in brute force detection
 */
export interface BruteForceStatus {
  /**
   * Number of failed login attempts
   */
  numFailures: number;

  /**
   * Last failed login time in milliseconds since epoch
   */
  lastFailure: number;

  /**
   * Last IP address that failed login
   */
  lastIPFailure: string;

  /**
   * Whether the user is currently disabled due to brute force protection
   */
  disabled: boolean;
}

/**
 * API for managing attack detection in Keycloak
 */
export class AttackDetectionApi {
  /**
   * Creates a new instance of the Attack Detection API
   *
   * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
   */
  constructor(private sdk: KeycloakAdminSDK) {}

  /**
   * Clear any user login failures for all users
   * This can release temporary disabled users
   *
   * Endpoint: DELETE /admin/realms/{realm}/attack-detection/brute-force/users
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete
   * @throws {Error} If the request fails
   */
  async clearAllBruteForce(): Promise<void> {
    try {
      const endpoint = `/attack-detection/brute-force/users`;
      await this.sdk.request<void>(endpoint, 'DELETE');
    } catch (error) {
      throw new Error(
        `Error clearing all brute force attempts: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Clear any user login failures for a specific user
   * This can release a temporary disabled user
   *
   * Endpoint: DELETE /admin/realms/{realm}/attack-detection/brute-force/users/{userId}
   *
   * @param {string} userId - ID of the user to clear brute force attempts for
   * @returns {Promise<void>} A promise that resolves when the operation is complete
   * @throws {Error} If the request fails or userId is invalid
   */
  async clearBruteForceForUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const endpoint = `/attack-detection/brute-force/users/${userId}`;
      await this.sdk.request<void>(endpoint, 'DELETE');
    } catch (error) {
      throw new Error(
        `Error clearing brute force attempts for user ${userId}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get status of a user in brute force detection
   *
   * Endpoint: GET /admin/realms/{realm}/attack-detection/brute-force/users/{userId}
   *
   * @param {string} userId - ID of the user to get status for
   * @returns {Promise<BruteForceStatus>} The brute force status for the user
   * @throws {Error} If the request fails or userId is invalid
   */
  async getBruteForceStatusForUser(userId: string): Promise<BruteForceStatus> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const endpoint = `/attack-detection/brute-force/users/${userId}`;
      return await this.sdk.request<BruteForceStatus>(endpoint, 'GET');
    } catch (error) {
      throw new Error(
        `Error getting brute force status for user ${userId}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
