/**
 * Scope Mappings API Factory for Keycloak Admin SDK
 * 
 * This module provides a factory for creating scope mappings API instances.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
import { ClientScopeMappingsApi } from './client-scope-mappings';
import { ClientTemplateScopeMappingsApi } from './client-template-scope-mappings';
import { ClientUuidScopeMappingsApi } from './client-uuid-scope-mappings';

/**
 * Scope Mappings API Factory
 * 
 * Factory for creating scope mappings API instances for different resource types
 */
export class ScopeMappingsApiFactory {
  private sdk: KeycloakAdminSDK;

  /**
   * Constructor for ScopeMappingsApiFactory
   * 
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get scope mappings API for a client scope
   * 
   * @param clientScopeId - ID of the client scope
   * @returns ClientScopeMappingsApi instance
   */
  forClientScope(clientScopeId: string): ClientScopeMappingsApi {
    return new ClientScopeMappingsApi(this.sdk, clientScopeId);
  }

  /**
   * Get scope mappings API for a client template
   * 
   * @param clientTemplateId - ID of the client template
   * @returns ClientTemplateScopeMappingsApi instance
   */
  forClientTemplate(clientTemplateId: string): ClientTemplateScopeMappingsApi {
    return new ClientTemplateScopeMappingsApi(this.sdk, clientTemplateId);
  }

  /**
   * Get scope mappings API for a client
   * 
   * @param clientUuid - UUID of the client
   * @returns ClientUuidScopeMappingsApi instance
   */
  forClient(clientUuid: string): ClientUuidScopeMappingsApi {
    return new ClientUuidScopeMappingsApi(this.sdk, clientUuid);
  }
}

export { ClientScopeMappingsApi } from './client-scope-mappings';
export { ClientTemplateScopeMappingsApi } from './client-template-scope-mappings';
export { ClientUuidScopeMappingsApi } from './client-uuid-scope-mappings';
export { BaseScopeMappingsApi } from './scope-mappings';
