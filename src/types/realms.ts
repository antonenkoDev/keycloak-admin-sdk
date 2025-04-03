/**
 * Types for the Keycloak Realms Admin API
 */

import { GroupRepresentation } from './groups';
import { UserRepresentation } from './users';
import { ClientRepresentation } from './clients';

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
    attributes?: Record<string, string[]>;
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
    bruteForceStrategy?: string;
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
