/**
 * Types for the Keycloak Realms Admin API
 */

import { GroupRepresentation } from './groups';
import { UserRepresentation } from './users';
import { ClientRepresentation, ClientScopeRepresentation, ProtocolMapperRepresentation } from './clients';
import { OrganizationRepresentation } from './organizations';

/**
 * Represents a Keycloak role
 */
export interface RoleRepresentation {
  id?: string;
  name?: string;
  description?: string;
  composite?: boolean;
  composites?: Record<string, string[]>;
  clientRole?: boolean;
  containerId?: string;
  attributes?: Record<string, string>;
}

/**
 * Represents a brute force strategy
 */
export enum BruteForceStrategy {
  PERMANENT_LOCKOUT = 'PERMANENT_LOCKOUT',
  TEMPORARY_LOCKOUT = 'TEMPORARY_LOCKOUT',
  NO_LOCKOUT = 'NO_LOCKOUT'
}

/**
 * Represents a user federation provider
 */
export interface UserFederationProviderRepresentation {
  id?: string;
  displayName?: string;
  providerName?: string;
  config?: Record<string, string>;
  priority?: number;
  fullSyncPeriod?: number;
  changedSyncPeriod?: number;
  lastSync?: number;
}

/**
 * Represents a user federation mapper
 */
export interface UserFederationMapperRepresentation {
  id?: string;
  name?: string;
  federationProviderDisplayName?: string;
  federationMapperType?: string;
  config?: Record<string, string>;
}

/**
 * Represents an identity provider
 */
export interface IdentityProviderRepresentation {
  alias?: string;
  displayName?: string;
  internalId?: string;
  providerId?: string;
  enabled?: boolean;
  updateProfileFirstLoginMode?: string;
  trustEmail?: boolean;
  storeToken?: boolean;
  addReadTokenRoleOnCreate?: boolean;
  authenticateByDefault?: boolean;
  linkOnly?: boolean;
  firstBrokerLoginFlowAlias?: string;
  postBrokerLoginFlowAlias?: string;
  config?: Record<string, string>;
}

/**
 * Represents an identity provider mapper
 */
export interface IdentityProviderMapperRepresentation {
  id?: string;
  name?: string;
  identityProviderAlias?: string;
  identityProviderMapper?: string;
  config?: Record<string, string>;
}

/**
 * Represents an authentication flow
 */
export interface AuthenticationFlowRepresentation {
  id?: string;
  alias?: string;
  description?: string;
  providerId?: string;
  topLevel?: boolean;
  builtIn?: boolean;
  authenticationExecutions?: AuthenticationExecutionExportRepresentation[];
}

/**
 * Represents an authentication execution export
 */
export interface AuthenticationExecutionExportRepresentation {
  authenticator?: string;
  authenticatorConfig?: string;
  authenticatorFlow?: boolean;
  requirement?: string;
  priority?: number;
  flowAlias?: string;
  userSetupAllowed?: boolean;
  autheticatorFlow?: boolean;
}

/**
 * Represents an authenticator config
 */
export interface AuthenticatorConfigRepresentation {
  id?: string;
  alias?: string;
  config?: Record<string, string>;
}

/**
 * Represents a required action provider
 */
export interface RequiredActionProviderRepresentation {
  alias?: string;
  name?: string;
  providerId?: string;
  enabled?: boolean;
  defaultAction?: boolean;
  priority?: number;
  config?: Record<string, string>;
}

/**
 * Represents a scope mapping
 */
export interface ScopeMappingRepresentation {
  client?: string;
  clientScope?: string;
  roles?: string[];
  self?: string;
}

/**
 * Represents an application
 */
export interface ApplicationRepresentation {
  id?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  baseUrl?: string;
  surrogateAuthRequired?: boolean;
  protocol?: string;
  clientId?: string;
  nodeReRegistrationTimeout?: number;
  defaultRoles?: string[];
  redirectUris?: string[];
  webOrigins?: string[];
  bearerOnly?: boolean;
  consentRequired?: boolean;
  standardFlowEnabled?: boolean;
  implicitFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  serviceAccountsEnabled?: boolean;
  publicClient?: boolean;
  frontchannelLogout?: boolean;
  attributes?: Record<string, string>;
  authenticationFlowBindingOverrides?: Record<string, string>;
  fullScopeAllowed?: boolean;
  protocolMappers?: ProtocolMapperRepresentation[];
  clientTemplate?: string;
  useTemplateConfig?: boolean;
  useTemplateScope?: boolean;
  useTemplateMappers?: boolean;
  rootUrl?: string;
  adminUrl?: string;
}

/**
 * Represents an OAuth client
 */
export interface OAuthClientRepresentation {
  id?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  secret?: string;
  clientId?: string;
  protocol?: string;
  redirectUris?: string[];
  webOrigins?: string[];
  bearerOnly?: boolean;
  consentRequired?: boolean;
  standardFlowEnabled?: boolean;
  implicitFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  serviceAccountsEnabled?: boolean;
  publicClient?: boolean;
  frontchannelLogout?: boolean;
  attributes?: Record<string, string>;
  authenticationFlowBindingOverrides?: Record<string, string>;
  fullScopeAllowed?: boolean;
  protocolMappers?: ProtocolMapperRepresentation[];
  clientTemplate?: string;
  useTemplateConfig?: boolean;
  useTemplateScope?: boolean;
  useTemplateMappers?: boolean;
}

/**
 * Represents a client template
 */
export interface ClientTemplateRepresentation {
  id?: string;
  name?: string;
  description?: string;
  protocol?: string;
  fullScopeAllowed?: boolean;
  bearerOnly?: boolean;
  consentRequired?: boolean;
  standardFlowEnabled?: boolean;
  implicitFlowEnabled?: boolean;
  directAccessGrantsEnabled?: boolean;
  serviceAccountsEnabled?: boolean;
  publicClient?: boolean;
  frontchannelLogout?: boolean;
  attributes?: Record<string, string>;
  protocolMappers?: ProtocolMapperRepresentation[];
}

/**
 * Represents a Keycloak realm
 */
export interface RealmRepresentation {
  id?: string;
  realm?: string;
  displayName?: string;
  displayNameHtml?: string;
  notBefore?: number;
  defaultSignatureAlgorithm?: string;
  revokeRefreshToken?: boolean;
  refreshTokenMaxReuse?: number;
  accessTokenLifespan?: number;
  accessTokenLifespanForImplicitFlow?: number;
  ssoSessionIdleTimeout?: number;
  ssoSessionMaxLifespan?: number;
  ssoSessionIdleTimeoutRememberMe?: number;
  ssoSessionMaxLifespanRememberMe?: number;
  offlineSessionIdleTimeout?: number;
  offlineSessionMaxLifespanEnabled?: boolean;
  offlineSessionMaxLifespan?: number;
  clientSessionIdleTimeout?: number;
  clientSessionMaxLifespan?: number;
  clientOfflineSessionIdleTimeout?: number;
  clientOfflineSessionMaxLifespan?: number;
  accessCodeLifespan?: number;
  accessCodeLifespanUserAction?: number;
  accessCodeLifespanLogin?: number;
  actionTokenGeneratedByAdminLifespan?: number;
  actionTokenGeneratedByUserLifespan?: number;
  oauth2DeviceCodeLifespan?: number;
  oauth2DevicePollingInterval?: number;
  enabled?: boolean;
  sslRequired?: string;
  passwordCredentialGrantAllowed?: boolean;
  registrationAllowed?: boolean;
  registrationEmailAsUsername?: boolean;
  rememberMe?: boolean;
  verifyEmail?: boolean;
  loginWithEmailAllowed?: boolean;
  duplicateEmailsAllowed?: boolean;
  resetPasswordAllowed?: boolean;
  editUsernameAllowed?: boolean;
  userCacheEnabled?: boolean;
  realmCacheEnabled?: boolean;
  bruteForceProtected?: boolean;
  permanentLockout?: boolean;
  maxTemporaryLockouts?: number;
  bruteForceStrategy?: BruteForceStrategy;
  maxFailureWaitSeconds?: number;
  minimumQuickLoginWaitSeconds?: number;
  waitIncrementSeconds?: number;
  quickLoginCheckMilliSeconds?: number;
  maxDeltaTimeSeconds?: number;
  failureFactor?: number;
  privateKey?: string;
  publicKey?: string;
  certificate?: string;
  codeSecret?: string;
  roles?: RolesRepresentation;
  groups?: GroupRepresentation[];
  defaultRoles?: string[];
  defaultRole?: RoleRepresentation;
  defaultGroups?: string[];
  requiredCredentials?: string[];
  passwordPolicy?: string;
  otpPolicyType?: string;
  otpPolicyAlgorithm?: string;
  otpPolicyInitialCounter?: number;
  otpPolicyDigits?: number;
  otpPolicyLookAheadWindow?: number;
  otpPolicyPeriod?: number;
  otpPolicyCodeReusable?: boolean;
  otpSupportedApplications?: string[];
  webAuthnPolicyRpEntityName?: string;
  webAuthnPolicySignatureAlgorithms?: string[];
  webAuthnPolicyRpId?: string;
  webAuthnPolicyAttestationConveyancePreference?: string;
  webAuthnPolicyAuthenticatorAttachment?: string;
  webAuthnPolicyRequireResidentKey?: string;
  webAuthnPolicyUserVerificationRequirement?: string;
  webAuthnPolicyCreateTimeout?: number;
  webAuthnPolicyAvoidSameAuthenticatorRegister?: boolean;
  webAuthnPolicyAcceptableAaguids?: string[];
  webAuthnPolicyExtraOrigins?: string[];
  webAuthnPolicyPasswordlessRpEntityName?: string;
  webAuthnPolicyPasswordlessSignatureAlgorithms?: string[];
  webAuthnPolicyPasswordlessRpId?: string;
  webAuthnPolicyPasswordlessAttestationConveyancePreference?: string;
  webAuthnPolicyPasswordlessAuthenticatorAttachment?: string;
  webAuthnPolicyPasswordlessRequireResidentKey?: string;
  webAuthnPolicyPasswordlessUserVerificationRequirement?: string;
  webAuthnPolicyPasswordlessCreateTimeout?: number;
  webAuthnPolicyPasswordlessAvoidSameAuthenticatorRegister?: boolean;
  webAuthnPolicyPasswordlessAcceptableAaguids?: string[];
  webAuthnPolicyPasswordlessExtraOrigins?: string[];
  users?: UserRepresentation[];
  federatedUsers?: UserRepresentation[];
  attributes?: Record<string, string[]>;
  clients?: ClientRepresentation[];
  smtpServer?: Record<string, string>;
  browserSecurityHeaders?: Record<string, string>;
  internationalizationEnabled?: boolean;
  supportedLocales?: string[];
  browserFlow?: string;
  registrationFlow?: string;
  directGrantFlow?: string;
  resetCredentialsFlow?: string;
  clientAuthenticationFlow?: string;
  dockerAuthenticationFlow?: string;
  keycloakVersion?: string;
  userManagedAccessAllowed?: boolean;
  eventsEnabled?: boolean;
  eventsExpiration?: number;
  eventsListeners?: string[];
  enabledEventTypes?: string[];
  adminEventsEnabled?: boolean;
  adminEventsDetailsEnabled?: boolean;
  organizationsEnabled?: boolean;
  organizations?: OrganizationRepresentation[];
  verifiableCredentialsEnabled?: boolean;
  adminPermissionsEnabled?: boolean;
  social?: boolean;
  updateProfileOnInitialSocialLogin?: boolean;
  socialProviders?: Record<string, string>;
  applicationScopeMappings?: Record<string, ScopeMappingRepresentation[]>;
  applications?: ApplicationRepresentation[];
  oauthClients?: OAuthClientRepresentation[];
  clientTemplates?: ClientTemplateRepresentation[];
  oAuth2DeviceCodeLifespan?: number;
  oAuth2DevicePollingInterval?: number;
  adminPermissionsClient?: ClientRepresentation;
  clientScopeMappings?: Record<string, ScopeMappingRepresentation[]>;
  clientScopes?: ClientScopeRepresentation[];
  defaultDefaultClientScopes?: string[];
  defaultOptionalClientScopes?: string[];
  userFederationProviders?: UserFederationProviderRepresentation[];
  userFederationMappers?: UserFederationMapperRepresentation[];
  loginTheme?: string;
  accountTheme?: string;
  adminTheme?: string;
  emailTheme?: string;
  identityProviders?: IdentityProviderRepresentation[];
  identityProviderMappers?: IdentityProviderMapperRepresentation[];
  protocolMappers?: ProtocolMapperRepresentation[];
  components?: Record<string, any[]>;
  defaultLocale?: string;
  authenticationFlows?: AuthenticationFlowRepresentation[];
  authenticatorConfig?: AuthenticatorConfigRepresentation[];
  requiredActions?: RequiredActionProviderRepresentation[];
  firstBrokerLoginFlow?: string;
  scopeMappings?: ScopeMappingRepresentation[];
  clientProfiles?: ClientProfilesRepresentation;
  clientPolicies?: ClientPoliciesRepresentation;
  localizationTexts?: Record<string, Record<string, string>>;
}

/**
 * Represents a roles structure in a realm
 */
export interface RolesRepresentation {
  realm?: RoleRepresentation[];
  client?: Record<string, RoleRepresentation[]>;
}

/**
 * Represents the realm events configuration
 */
export interface RealmEventsConfigRepresentation {
  eventsEnabled?: boolean;
  eventsExpiration?: number;
  eventsListeners?: string[];
  enabledEventTypes?: string[];
  adminEventsEnabled?: boolean;
  adminEventsDetailsEnabled?: boolean;
}

/**
 * Represents an admin event
 */
export interface AdminEventRepresentation {
  time?: number;
  realmId?: string;
  authDetails?: AuthDetailsRepresentation;
  resourceType?: string;
  operationType?: string;
  resourcePath?: string;
  representation?: string;
  error?: string;
}

/**
 * Represents authentication details for an event
 */
export interface AuthDetailsRepresentation {
  realmId?: string;
  clientId?: string;
  userId?: string;
  ipAddress?: string;
}

/**
 * Represents an event
 */
export interface EventRepresentation {
  time?: number;
  type?: string;
  realmId?: string;
  clientId?: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  error?: string;
  details?: Record<string, string>;
}

/**
 * Parameters for getting realms
 */
export interface GetRealmsParams {
  briefRepresentation?: boolean;
}

/**
 * Parameters for getting realm events
 */
export interface GetRealmEventsParams {
  client?: string;
  dateFrom?: string;
  dateTo?: string;
  first?: number;
  ipAddress?: string;
  max?: number;
  type?: string[];
  user?: string;
}

/**
 * Parameters for getting admin events
 */
export interface GetAdminEventsParams {
  authClient?: string;
  authIpAddress?: string;
  authRealm?: string;
  authUser?: string;
  dateFrom?: string;
  dateTo?: string;
  first?: number;
  max?: number;
  operationTypes?: string[];
  resourcePath?: string;
  resourceTypes?: string[];
}

/**
 * Client type representation
 */
export interface ClientTypeRepresentation {
  id?: string;
  name?: string;
  description?: string;
  global?: boolean;
  builtin?: boolean;
  clientAttributes?: Record<string, string>;
}

/**
 * Client types representation
 */
export interface ClientTypesRepresentation {
  global?: ClientTypeRepresentation[];
  realm?: ClientTypeRepresentation[];
}

/**
 * Client policy condition representation
 */
export interface ClientPolicyConditionRepresentation {
  condition?: string;
  configuration?: Record<string, any>;
}

/**
 * Client policy executor representation
 */
export interface ClientPolicyExecutorRepresentation {
  executor?: string;
  configuration?: Record<string, any>;
}

/**
 * Client policy representation
 */
export interface ClientPolicyRepresentation {
  name?: string;
  description?: string;
  enabled?: boolean;
  conditions?: ClientPolicyConditionRepresentation[];
  // Profiles that this policy applies to (not executors)
  profiles?: string[];
}

/**
 * Client policies representation
 */
export interface ClientPoliciesRepresentation {
  policies?: ClientPolicyRepresentation[];
  // Global policies that apply to all realms
  globalPolicies?: ClientPolicyRepresentation[];
}

/**
 * Client profile representation
 */
export interface ClientProfileRepresentation {
  name?: string;
  description?: string;
  executors?: ClientPolicyExecutorRepresentation[];
  // Whether this is a global profile
  global?: boolean;
}

/**
 * Client profiles representation
 */
export interface ClientProfilesRepresentation {
  profiles?: ClientProfileRepresentation[];
  // Global profiles that apply to all realms
  globalProfiles?: ClientProfileRepresentation[];
}

/**
 * Management permission reference
 */
export interface ManagementPermissionReference {
  enabled?: boolean;
  resource?: string;
  scopePermissions?: Record<string, string>;
}

/**
 * Global request result
 */
export interface GlobalRequestResult {
  successRequests?: string[];
  failedRequests?: string[];
}
