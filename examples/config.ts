/**
 * Example Configuration
 * 
 * This file contains the configuration for the examples.
 * You can modify these values to match your Keycloak instance.
 */

import { KeycloakConfig } from '../src/types/auth';

/**
 * Keycloak configuration
 */
export const config: KeycloakConfig = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: 'password',
  credentials: {
    username: process.env.KEYCLOAK_USERNAME || 'admin',
    password: process.env.KEYCLOAK_PASSWORD || 'admin',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli'
  }
};
