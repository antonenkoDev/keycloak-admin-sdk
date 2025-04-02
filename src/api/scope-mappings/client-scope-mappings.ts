/**
 * Client Scope Mappings API for Keycloak Admin SDK
 * 
 * This module provides methods to manage scope mappings for client scopes in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
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
   * @param sdk - KeycloakAdminSDK instance
   * @param clientScopeId - ID of the client scope
   */
  constructor(sdk: KeycloakAdminSDK, clientScopeId: string) {
    super(sdk);
    
    if (!clientScopeId) {
      throw new Error('Client scope ID is required');
    }
    
    this.resourcePath = `/client-scopes/${clientScopeId}`;
  }
}
