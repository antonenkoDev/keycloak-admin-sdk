/**
 * Client ID Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for clients in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakClient from '../../index';
import { BaseScopeMappingsApi } from './scope-mappings';

/**
 * Client ID Scope Mappings API
 *
 * Provides methods to manage scope mappings for clients in Keycloak
 */
export class clientIdScopeMappingsApi extends BaseScopeMappingsApi {
  protected resourcePath: string;

  /**
   * Constructor for clientIdScopeMappingsApi
   *
   * @param sdk - KeycloakClient instance
   * @param clientId - ID of the client
   */
  constructor(sdk: KeycloakClient, clientId: string) {
    super(sdk);

    if (!clientId) {
      throw new Error('Client ID is required');
    }

    this.resourcePath = `/clients/${clientId}`;
  }
}
