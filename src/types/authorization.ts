// src/types/authorization.ts

/**
 * Represents a resource server in Keycloak Authorization Services
 */
export interface ResourceServerRepresentation {
  id?: string;
  clientId?: string;
  name?: string;
  allowRemoteResourceManagement?: boolean;
  policyEnforcementMode?: 'ENFORCING' | 'PERMISSIVE' | 'DISABLED';
  decisionStrategy?: 'UNANIMOUS' | 'AFFIRMATIVE' | 'CONSENSUS';
  resources?: ResourceRepresentation[];
  policies?: PolicyRepresentation[];
  scopes?: ScopeRepresentation[];
}

/**
 * Represents a resource in Keycloak Authorization Services
 */
export interface ResourceRepresentation {
  id?: string;
  name?: string;
  displayName?: string;
  type?: string;
  uris?: string[];
  uri?: string;
  scopes?: ScopeRepresentation[];
  attributes?: Record<string, string[]>;
  iconUri?: string;
  owner?: {
    id?: string;
    name?: string;
  };
  ownerManagedAccess?: boolean;
}

/**
 * Represents a scope in Keycloak Authorization Services
 */
export interface ScopeRepresentation {
  id?: string;
  name?: string;
  displayName?: string;
  iconUri?: string;
}

/**
 * Base representation for policies in Keycloak Authorization Services
 */
export interface AbstractPolicyRepresentation {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  logic?: 'POSITIVE' | 'NEGATIVE';
  decisionStrategy?: 'UNANIMOUS' | 'AFFIRMATIVE' | 'CONSENSUS';
}

/**
 * Represents a policy in Keycloak Authorization Services
 */
export interface PolicyRepresentation extends AbstractPolicyRepresentation {
  config?: Record<string, any>;
  policies?: string[];
  resources?: string[];
  scopes?: string[];
  resourcesData?: ResourceRepresentation[];
  scopesData?: ScopeRepresentation[];
}

/**
 * Represents a policy provider in Keycloak Authorization Services
 */
export interface PolicyProviderRepresentation {
  type?: string;
  name?: string;
  group?: string;
  configurationSettings?: {
    key?: string;
    name?: string;
    type?: string;
    defaultValue?: string;
  }[];
}

/**
 * Request for policy evaluation in Keycloak Authorization Services
 */
export interface PolicyEvaluationRequest {
  resources?: ResourceRepresentation[];
  entitlements?: boolean;
  roleIds?: string[];
  clientId?: string;
  userId?: string;
  context?: Record<string, any>;
  permissions?: {
    id?: string;
    scopes?: string[];
  }[];
}

/**
 * Response from policy evaluation in Keycloak Authorization Services
 */
export interface PolicyEvaluationResponse {
  results?: {
    resource?: ResourceRepresentation;
    scopes?: ScopeRepresentation[];
    status?: 'PERMIT' | 'DENY';
    policies?: {
      policy?: PolicyRepresentation;
      status?: 'PERMIT' | 'DENY';
      scopes?: ScopeRepresentation[];
      resources?: ResourceRepresentation[];
    }[];
  }[];
  entitlements?: boolean;
  status?: 'PERMIT' | 'DENY';
}
