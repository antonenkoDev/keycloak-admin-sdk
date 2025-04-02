/**
 * Role Mappings API for Keycloak Admin SDK
 * 
 * This module exports the role mappings API classes and factory function.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
import { BaseRoleMappingsApi } from './role-mappings';
import { UserRoleMappingsApi } from './user-role-mappings';
import { GroupRoleMappingsApi } from './group-role-mappings';

export { BaseRoleMappingsApi } from './role-mappings';
export { UserRoleMappingsApi } from './user-role-mappings';
export { GroupRoleMappingsApi } from './group-role-mappings';

/**
 * Role Mappings API Factory
 * 
 * Factory class for creating role mappings API instances for different resource types
 */
export class RoleMappingsApiFactory {
  private sdk: KeycloakAdminSDK;
  
  /**
   * Constructor for RoleMappingsApiFactory
   * 
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }
  
  /**
   * Create a role mappings API for a user
   * 
   * @param userId - ID of the user
   * @returns UserRoleMappingsApi instance
   */
  forUser(userId: string): UserRoleMappingsApi {
    return new UserRoleMappingsApi(this.sdk, userId);
  }
  
  /**
   * Create a role mappings API for a group
   * 
   * @param groupId - ID of the group
   * @returns GroupRoleMappingsApi instance
   */
  forGroup(groupId: string): GroupRoleMappingsApi {
    return new GroupRoleMappingsApi(this.sdk, groupId);
  }
}
