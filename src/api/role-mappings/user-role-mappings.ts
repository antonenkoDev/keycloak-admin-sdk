/**
 * User Role Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for users in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakClient from '../../index';
import { BaseRoleMappingsApi } from './role-mappings';

/**
 * User Role Mappings API
 *
 * Provides methods to manage role mappings for users in Keycloak
 */
export class UserRoleMappingsApi extends BaseRoleMappingsApi {
  protected resourcePath: string;

  /**
   * Constructor for UserRoleMappingsApi
   *
   * @param sdk - KeycloakClient instance
   * @param userId - ID of the user
   */
  constructor(sdk: KeycloakClient, userId: string) {
    super(sdk);

    if (!userId) {
      throw new Error('User ID is required');
    }

    this.resourcePath = `/users/${userId}`;
  }
}
