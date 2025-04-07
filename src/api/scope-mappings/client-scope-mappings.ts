/**
 * Client Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for client scopes in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakClient from '../../index';
import { BaseScopeMappingsApi } from './scope-mappings';

/**
 * Client Scope Mappings API
 *
 * Provides methods to manage scope mappings for client scopes in Keycloak
 */
export class ClientScopeMappingsApi extends BaseScopeMappingsApi {
  protected resourcePath: string;

  /**
   * Constructor for ClientScopeMappingsApi
   *
   * @param sdk - KeycloakClient instance
   * @param clientScopeId - ID of the client scope
   */
  constructor(sdk: KeycloakClient, clientScopeId: string) {
    super(sdk);

    if (!clientScopeId) {
      throw new Error('Client scope ID is required');
    }

    this.resourcePath = `/client-scopes/${clientScopeId}`;
  }
}
