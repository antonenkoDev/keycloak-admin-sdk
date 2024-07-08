import KeycloakAdminSDK from "../../index";
import {ConsentRepresentation} from "../../types/users/consents";

export class ConsentsApi {
    constructor(private sdk: KeycloakAdminSDK) {}

    /**
     * Get consents granted by the user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<ConsentRepresentation[]>} A list of consents granted by the user.
     */
    async list(userId: string): Promise<ConsentRepresentation[]> {
        const endpoint = `/users/${userId}/consents`;
        return this.sdk.request<ConsentRepresentation[]>(endpoint, 'GET');
    }

    /**
     * Revoke consent and offline tokens for a particular client from the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} clientId - The ID of the client.
     * @returns {Promise<void>}
     */
    async revoke(userId: string, clientId: string): Promise<void> {
        const endpoint = `/users/${userId}/consents/${clientId}`;
        await this.sdk.request<void>(endpoint, 'DELETE');
    }
}
