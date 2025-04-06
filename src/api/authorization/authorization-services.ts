/**
 * Authorization Services API for Keycloak Admin SDK
 * Main entry point for authorization services functionality
 */

import KeycloakAdminSDK from '../../index';
import { ResourceServerApi } from './resource-server';
import { ResourcesApi } from './resources';
import { ScopesApi } from './scopes';
import { PoliciesApi } from './policies';
import { PermissionsApi } from './permissions';

/**
 * Authorization Services API for Keycloak
 *
 * Provides a centralized access point to all authorization services functionality:
 * - Resource Server management (PAP)
 * - Resources management (PAP)
 * - Scopes management (PAP)
 * - Policies management (PAP)
 * - Permissions management (PAP)
 * - Policy evaluation (PDP)
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/
 */
export class AuthorizationServicesApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Resource Server API for managing resource server configuration
   */
  public resourceServer: ResourceServerApi;

  /**
   * Resources API for managing protected resources
   */
  public resources: ResourcesApi;

  /**
   * Scopes API for managing resource scopes
   */
  public scopes: ScopesApi;

  /**
   * Policies API for managing authorization policies
   */
  public policies: PoliciesApi;

  /**
   * Permissions API for managing resource and scope permissions
   */
  public permissions: PermissionsApi;

  /**
   * Creates a new instance of the Authorization Services API
   *
   * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
    this.resourceServer = new ResourceServerApi(sdk);
    this.resources = new ResourcesApi(sdk);
    this.scopes = new ScopesApi(sdk);
    this.policies = new PoliciesApi(sdk);
    this.permissions = new PermissionsApi(sdk);
  }
}
