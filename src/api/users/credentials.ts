import KeycloakAdminSDK from '../../index';
import { CredentialRepresentation } from '../../types/users';

export class CredentialsApi {
  constructor(private sdk: KeycloakAdminSDK) {}

  /**
   * Get credentials for a user.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Promise<CredentialRepresentation[]>} A list of user credentials.
   */
  async list(userId: string): Promise<CredentialRepresentation[]> {
    const endpoint = `/users/${userId}/credentials`;
    return this.sdk.request<CredentialRepresentation[]>(endpoint, 'GET');
  }

  /**
   * Remove a credential for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} credentialId - The ID of the credential to remove.
   * @returns {Promise<void>}
   */
  async remove(userId: string, credentialId: string): Promise<void> {
    const endpoint = `/users/${userId}/credentials/${credentialId}`;
    await this.sdk.request<void>(endpoint, 'DELETE');
  }

  /**
   * Move a credential to a position behind another credential.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} credentialId - The ID of the credential to move.
   * @param {string} newPreviousCredentialId - The ID of the credential that will be the previous element in the list.
   * @returns {Promise<void>}
   */
  async moveAfter(
    userId: string,
    credentialId: string,
    newPreviousCredentialId: string
  ): Promise<void> {
    const endpoint = `/users/${userId}/credentials/${credentialId}/moveAfter/${newPreviousCredentialId}`;
    await this.sdk.request<void>(endpoint, 'POST');
  }

  /**
   * Move a credential to the first position in the credentials list of the user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} credentialId - The ID of the credential to move.
   * @returns {Promise<void>}
   */
  async moveToFirst(userId: string, credentialId: string): Promise<void> {
    const endpoint = `/users/${userId}/credentials/${credentialId}/moveToFirst`;
    await this.sdk.request<void>(endpoint, 'POST');
  }

  /**
   * Update a credential label for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} credentialId - The ID of the credential.
   * @param {string} label - The new label for the credential.
   * @returns {Promise<void>}
   */
  async updateLabel(userId: string, credentialId: string, label: string): Promise<void> {
    const endpoint = `/users/${userId}/credentials/${credentialId}/userLabel`;
    await this.sdk.request<void>(endpoint, 'PUT', label);
  }

  /**
   * Disable all credentials for a user of a specific type.
   *
   * @param {string} userId - The ID of the user.
   * @param {string[]} types - The types of credentials to disable.
   * @returns {Promise<void>}
   */
  async disableTypes(userId: string, types: string[]): Promise<void> {
    const endpoint = `/users/${userId}/disable-credential-types`;
    await this.sdk.request<void>(endpoint, 'PUT', types);
  }

  /**
   * Reset password for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {CredentialRepresentation} credential - The new credential representation.
   * @returns {Promise<void>}
   */
  async resetPassword(userId: string, credential: CredentialRepresentation): Promise<void> {
    const endpoint = `/users/${userId}/reset-password`;
    await this.sdk.request<void>(endpoint, 'PUT', credential);
  }
}
