/**
 * Client UUID Scope Mappings API for Keycloak Admin SDK
 * 
 * This module provides methods to manage scope mappings for clients in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
import { BaseScopeMappingsApi } from './scope-mappings';

/**
 * Client UUID Scope Mappings API
 * 
 * Provides methods to manage scope mappings for clients in Keycloak
 */
export class ClientUuidScopeMappingsApi extends BaseScopeMappingsApi {
  protected resourcePath: string;
  
  /**
   * Constructor for ClientUuidScopeMappingsApi
   * 
   * @param sdk - KeycloakAdminSDK instance
   * @param clientUuid - UUID of the client
   */
  constructor(sdk: KeycloakAdminSDK, clientUuid: string) {
    super(sdk);
    
    if (!clientUuid) {
      throw new Error('Client UUID is required');
    }
    
    this.resourcePath = `/clients/${clientUuid}`;
  }
}
