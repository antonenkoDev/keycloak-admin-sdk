/**
 * Group Role Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for groups in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakClient from '../../index';
import { BaseRoleMappingsApi } from './role-mappings';

/**
 * Group Role Mappings API
 *
 * Provides methods to manage role mappings for groups in Keycloak
 */
export class GroupRoleMappingsApi extends BaseRoleMappingsApi {
  protected resourcePath: string;

  /**
   * Constructor for GroupRoleMappingsApi
   *
   * @param sdk - KeycloakClient instance
   * @param groupId - ID of the group
   */
  constructor(sdk: KeycloakClient, groupId: string) {
    super(sdk);

    if (!groupId) {
      throw new Error('Group ID is required');
    }

    this.resourcePath = `/groups/${groupId}`;
  }
}
