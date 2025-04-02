/**
 * Types for Keycloak Clients API
 */

/**
 * Represents a Keycloak client
 */
export interface ClientRepresentation {
  id?: string;
  clientId: string;
  name?: string;
  description?: string;
  rootUrl?: string;
  baseUrl?: string;
  surrogateAuthRequired?: boolean;
  enabled?: boolean;
  alwaysDisplayInConsole?: boolean;
  clientAuthenticatorType?: string;
  redirectUris?: string[];
  webOrigins?: string[];
  notBefore?: number;
  bearerOnly?: boolean;
  consentRequired?: boolean;
  standardFlowEnabled?: boolean;
  implicitFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  serviceAccountsEnabled?: boolean;
  publicClient?: boolean;
  frontchannelLogout?: boolean;
  protocol?: string;
  attributes?: Record<string, string>;
  authenticationFlowBindingOverrides?: Record<string, string>;
  fullScopeAllowed?: boolean;
  nodeReRegistrationTimeout?: number;
  defaultClientScopes?: string[];
  optionalClientScopes?: string[];
  access?: {
    view?: boolean;
    configure?: boolean;
    manage?: boolean;
  };
  secret?: string;
  clientTemplate?: string;
  useTemplateConfig?: boolean;
  useTemplateScope?: boolean;
  useTemplateMappers?: boolean;
  authorizationServicesEnabled?: boolean;
}

/**
 * Represents a Keycloak client scope
 */
export interface ClientScopeRepresentation {
  id?: string;
  name?: string;
  description?: string;
  protocol?: string;
  attributes?: Record<string, string>;
  protocolMappers?: ProtocolMapperRepresentation[];
}

/**
 * Represents a Keycloak protocol mapper
 */
export interface ProtocolMapperRepresentation {
  id?: string;
  name?: string;
  protocol?: string;
  protocolMapper?: string;
  consentRequired?: boolean;
  config?: Record<string, string>;
}

/**
 * Represents a Keycloak client secret
 */
export interface CredentialRepresentation {
  type?: string;
  value?: string;
  temporary?: boolean;
}

/**
 * Represents a user session associated with a client
 */
export interface UserSessionRepresentation {
  id?: string;
  username?: string;
  userId?: string;
  ipAddress?: string;
  start?: number;
  lastAccess?: number;
  clients?: Record<string, string>;
}
