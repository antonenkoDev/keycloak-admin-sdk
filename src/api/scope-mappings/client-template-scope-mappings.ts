/**
 * Client Template Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for client templates in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakClient from '../../index';
import { BaseScopeMappingsApi } from './scope-mappings';

/**
 * Client Template Scope Mappings API
 *
 * Provides methods to manage scope mappings for client templates in Keycloak
 */
export class ClientTemplateScopeMappingsApi extends BaseScopeMappingsApi {
  protected resourcePath: string;

  /**
   * Constructor for ClientTemplateScopeMappingsApi
   *
   * @param sdk - KeycloakClient instance
   * @param clientTemplateId - ID of the client template
   */
  constructor(sdk: KeycloakClient, clientTemplateId: string) {
    super(sdk);

    if (!clientTemplateId) {
      throw new Error('Client template ID is required');
    }

    this.resourcePath = `/client-templates/${clientTemplateId}`;
  }
}
