/**
 * Role Mappings API for Users in Keycloak Admin SDK
 * 
 * This module provides methods to manage role mappings for users in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../index';
import { RoleRepresentation } from '../../types/roles';

/**
 * Role Mappings API for Users
 * 
 * Provides methods to manage role mappings for users in Keycloak
 */
export class UserRoleMappingsApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Constructor for UserRoleMappingsApi
   * 
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get realm-level role mappings for a user
   * 
   * Endpoint: GET /{realm}/users/{id}/role-mappings/realm
   * 
   * @param userId - User ID
   * @returns Promise resolving to an array of role representations
   */
  async getRealmRoleMappings(userId: string): Promise<RoleRepresentation[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(`/users/${userId}/role-mappings/realm`, 'GET');
    } catch (error) {
      console.error(`Error getting realm role mappings for user ${userId}:`, error);
      throw new Error(`Failed to get realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add realm-level role mappings to a user
   * 
   * Endpoint: POST /{realm}/users/{id}/role-mappings/realm
   * 
   * @param userId - User ID
   * @param roles - Array of roles to add
   * @returns Promise resolving when the operation completes
   */
  async addRealmRoles(userId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`/users/${userId}/role-mappings/realm`, 'POST', roles);
    } catch (error) {
      console.error(`Error adding realm roles to user ${userId}:`, error);
      throw new Error(`Failed to add realm roles: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Remove realm-level role mappings from a user
   * 
   * Endpoint: DELETE /{realm}/users/{id}/role-mappings/realm
   * 
   * @param userId - User ID
   * @param roles - Array of roles to remove
   * @returns Promise resolving when the operation completes
   */
  async removeRealmRoles(userId: string, roles: RoleRepresentation[]): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      await this.sdk.request<void>(`/users/${userId}/role-mappings/realm`, 'DELETE', roles);
    } catch (error) {
      console.error(`Error removing realm roles from user ${userId}:`, error);
      throw new Error(`Failed to remove realm roles: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get available realm-level roles that can be mapped to a user
   * 
   * Endpoint: GET /{realm}/users/{id}/role-mappings/realm/available
   * 
   * @param userId - User ID
   * @returns Promise resolving to an array of available role representations
   */
  async getAvailableRealmRoleMappings(userId: string): Promise<RoleRepresentation[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(`/users/${userId}/role-mappings/realm/available`, 'GET');
    } catch (error) {
      console.error(`Error getting available realm role mappings for user ${userId}:`, error);
      throw new Error(`Failed to get available realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get effective realm-level role mappings for a user (including composite roles)
   * 
   * Endpoint: GET /{realm}/users/{id}/role-mappings/realm/composite
   * 
   * @param userId - User ID
   * @returns Promise resolving to an array of effective role representations
   */
  async getEffectiveRealmRoleMappings(userId: string): Promise<RoleRepresentation[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      return this.sdk.request<RoleRepresentation[]>(`/users/${userId}/role-mappings/realm/composite`, 'GET');
    } catch (error) {
      console.error(`Error getting effective realm role mappings for user ${userId}:`, error);
      throw new Error(`Failed to get effective realm role mappings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
