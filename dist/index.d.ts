interface UserRepresentation {
    id?: string;
    createdTimestamp?: number;
    username?: string;
    enabled?: boolean;
    totp?: boolean;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    federationLink?: string;
    serviceAccountClientId?: string;
    attributes?: Record<string, string[]>;
    disableableCredentialTypes?: string[];
    requiredActions?: string[];
    notBefore?: number;
    access?: Record<string, boolean>;
    clientRoles?: Record<string, string[]>;
    realmRoles?: string[];
    self?: string;
    origin?: string;
    credentials?: CredentialRepresentation$1[];
    federatedIdentities?: FederatedIdentityRepresentation[];
    groups?: string[];
    clientConsents?: ClientConsentRepresentation[];
    userProfileMetadata?: UserProfileMetadata;
}
interface CredentialRepresentation$1 {
    id?: string;
    type?: string;
    userLabel?: string;
    createdDate?: number;
    secretData?: string;
    credentialData?: string;
    priority?: number;
    value?: string;
    temporary?: boolean;
}
interface ClientConsentRepresentation {
    clientId?: string;
    grantedClientScopes?: string[];
    createdDate?: number;
    lastUpdatedDate?: number;
}
interface UserProfileMetadata {
    attributes?: UserProfileAttribute[];
    groups?: UserProfileGroup[];
}
interface UserProfileAttribute {
    name?: string;
    displayName?: string;
    required?: boolean;
    readOnly?: boolean;
    annotations?: Record<string, string>;
    validators?: Record<string, Record<string, string>>;
    group?: string;
    multivalued?: boolean;
}
interface UserProfileGroup {
    name?: string;
    displayHeader?: string;
    displayDescription?: string;
    annotations?: Record<string, string>;
}
interface GetUsersParams {
    briefRepresentation?: boolean;
    email?: string;
    emailVerified?: boolean;
    enabled?: boolean;
    exact?: boolean;
    first?: number;
    firstName?: string;
    idpAlias?: string;
    idpUserId?: string;
    lastName?: string;
    max?: number;
    q?: string;
    search?: string;
    username?: string;
}
interface GetUserParams {
    userProfileMetadata?: boolean;
}
interface CountUsersParams {
    email?: string;
    emailVerified?: boolean;
    enabled?: boolean;
    firstName?: string;
    lastName?: string;
    q?: string;
    search?: string;
    username?: string;
}
interface UPConfig {
    attributes?: UserProfileAttribute[];
    groups?: UserProfileGroup[];
}
interface ConsentRepresentation {
    [key: string]: any;
}
interface ExecuteActionsEmailParams {
    client_id?: string;
    lifespan?: number;
    redirect_uri?: string;
}
interface SendVerifyEmailParams {
    client_id?: string;
    lifespan?: number;
    redirect_uri?: string;
}
interface UserSessionRepresentation$1 {
    id?: string;
    userId?: string;
    ipAddress?: string;
    start?: number;
    lastAccess?: number;
    clients?: Record<string, any>;
    applications?: Record<string, any>;
}
interface FederatedIdentityRepresentation {
    identityProvider?: string;
    userId?: string;
    userName?: string;
}
interface FederatedIdentityRepresentation {
    identityProvider?: string;
    userId?: string;
    userName?: string;
}
interface GroupRepresentation$1 {
    id?: string;
    name?: string;
    path?: string;
    subGroups?: GroupRepresentation$1[];
    attributes?: Record<string, string[]>;
    access?: Record<string, boolean>;
}

/**
 * Types for the Keycloak Roles API
 *
 * These types represent the role-related objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_roles
 */
/**
 * Represents a Keycloak role
 */
interface RoleRepresentation$1 {
    /**
     * Role ID
     */
    id?: string;
    /**
     * Role name
     */
    name?: string;
    /**
     * Role description
     */
    description?: string;
    /**
     * Whether this role is composite (i.e., it contains other roles)
     */
    composite?: boolean;
    /**
     * Map of composites: { "realm": ["role1", "role2"], "client": ["role3", "role4"] }
     */
    composites?: Record<string, string[]>;
    /**
     * Whether this is a client role (true) or realm role (false)
     */
    clientRole?: boolean;
    /**
     * Container ID (realm ID or client ID)
     */
    containerId?: string;
    /**
     * Role attributes
     */
    attributes?: Record<string, string[]>;
}
/**
 * Role query parameters
 */
interface RoleQuery {
    /**
     * Search string to filter roles
     */
    search?: string;
    /**
     * First result index
     */
    first?: number;
    /**
     * Maximum number of results
     */
    max?: number;
    /**
     * If true, return a brief representation of roles
     */
    briefRepresentation?: boolean;
}

declare class ConsentsApi {
    private sdk;
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get consents granted by the user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<ConsentRepresentation[]>} A list of consents granted by the user.
     */
    list(userId: string): Promise<ConsentRepresentation[]>;
    /**
     * Revoke consent and offline tokens for a particular client from the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} clientId - The ID of the client.
     * @returns {Promise<void>}
     */
    revoke(userId: string, clientId: string): Promise<void>;
}

declare class CredentialsApi {
    private sdk;
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get credentials for a user.
     *
     * @param {string} userId - The ID of the user.
     * @returns {Promise<CredentialRepresentation[]>} A list of user credentials.
     */
    list(userId: string): Promise<CredentialRepresentation$1[]>;
    /**
     * Remove a credential for a user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential to remove.
     * @returns {Promise<void>}
     */
    remove(userId: string, credentialId: string): Promise<void>;
    /**
     * Move a credential to a position behind another credential.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential to move.
     * @param {string} newPreviousCredentialId - The ID of the credential that will be the previous element in the list.
     * @returns {Promise<void>}
     */
    moveAfter(userId: string, credentialId: string, newPreviousCredentialId: string): Promise<void>;
    /**
     * Move a credential to the first position in the credentials list of the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential to move.
     * @returns {Promise<void>}
     */
    moveToFirst(userId: string, credentialId: string): Promise<void>;
    /**
     * Update a credential label for a user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} credentialId - The ID of the credential.
     * @param {string} label - The new label for the credential.
     * @returns {Promise<void>}
     */
    updateLabel(userId: string, credentialId: string, label: string): Promise<void>;
    /**
     * Disable all credentials for a user of a specific type.
     *
     * @param {string} userId - The ID of the user.
     * @param {string[]} types - The types of credentials to disable.
     * @returns {Promise<void>}
     */
    disableTypes(userId: string, types: string[]): Promise<void>;
    /**
     * Reset password for a user.
     *
     * @param {string} userId - The ID of the user.
     * @param {CredentialRepresentation} credential - The new credential representation.
     * @returns {Promise<void>}
     */
    resetPassword(userId: string, credential: CredentialRepresentation$1): Promise<void>;
}

declare class GroupsApi$1 {
    private sdk;
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get groups associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {object} [params] - Optional query parameters.
     * @param {boolean} [params.briefRepresentation] - Whether to return brief representations.
     * @param {number} [params.first] - Pagination offset.
     * @param {number} [params.max] - Maximum results size.
     * @param {string} [params.search] - Search term.
     * @returns {Promise<GroupRepresentation[]>} A list of groups.
     */
    list(userId: string, params?: {
        briefRepresentation?: boolean;
        first?: number;
        max?: number;
        search?: string;
    }): Promise<GroupRepresentation$1[]>;
    /**
     * Get the count of groups associated with the user.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} [search] - Search term.
     * @returns {Promise<number>} The count of groups.
     */
    count(userId: string, search?: string): Promise<number>;
    /**
     * Add a user to a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    add(userId: string, groupId: string): Promise<void>;
    /**
     * Remove a user from a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    remove(userId: string, groupId: string): Promise<void>;
}

declare class UsersApi {
    private sdk;
    consents: ConsentsApi;
    credentials: CredentialsApi;
    groups: GroupsApi$1;
    private roleMappings;
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get realm-level role mappings for a user
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of role representations
     */
    getRealmRoleMappings(userId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add realm-level role mappings to a user
     *
     * @param userId - User ID
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addRealmRoles(userId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Remove realm-level role mappings from a user
     *
     * @param userId - User ID
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    removeRealmRoles(userId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available realm-level roles that can be mapped to a user
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of available role representations
     */
    getAvailableRealmRoleMappings(userId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective realm-level role mappings for a user (including composite roles)
     *
     * @param userId - User ID
     * @returns Promise resolving to an array of effective role representations
     */
    getEffectiveRealmRoleMappings(userId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get a list of users.
     *
     * Endpoint: GET /admin/realms/{realm}/users
     *
     * @param {GetUsersParams} [params] - Parameters to filter the users
     * @returns {Promise<UserRepresentation[]>} A list of users
     * @throws {Error} If the request fails
     */
    list(params?: GetUsersParams): Promise<UserRepresentation[]>;
    /**
     * Create a new user.
     *
     * Endpoint: POST /admin/realms/{realm}/users
     *
     * @param {UserRepresentation} user - The user representation to create
     * @returns {Promise<string>} The ID of the created user
     * @throws {Error} If the request fails or user data is invalid
     */
    create(user: UserRepresentation): Promise<string>;
    /**
     * Get representation of the user.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}
     *
     * @param {string} userId - The ID of the user
     * @param {GetUserParams} [params] - Parameters for the request
     * @returns {Promise<UserRepresentation>} The user representation
     * @throws {Error} If the request fails or userId is invalid
     */
    get(userId: string, params?: GetUserParams): Promise<UserRepresentation>;
    /**
     * Update the user.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/{id}
     *
     * @param {string} userId - The ID of the user
     * @param {UserRepresentation} user - The user representation with updated data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    update(userId: string, user: UserRepresentation): Promise<void>;
    /**
     * Delete the user.
     *
     * Endpoint: DELETE /admin/realms/{realm}/users/{id}
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or userId is invalid
     */
    delete(userId: string): Promise<void>;
    /**
     * Get the number of users that match the given criteria.
     *
     * Endpoint: GET /admin/realms/{realm}/users/count
     *
     * @param {CountUsersParams} [params] - Parameters to filter the users
     * @returns {Promise<number>} The number of users
     * @throws {Error} If the request fails
     */
    count(params?: CountUsersParams): Promise<number>;
    /**
     * Get the configuration for the user profile.
     *
     * Endpoint: GET /admin/realms/{realm}/users/profile
     *
     * @returns {Promise<UPConfig>} The user profile configuration
     * @throws {Error} If the request fails
     */
    getUserProfileConfig(): Promise<UPConfig>;
    /**
     * Set the configuration for the user profile.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/profile
     *
     * @param {UPConfig} config - The user profile configuration to set
     * @returns {Promise<UPConfig>} The updated user profile configuration
     * @throws {Error} If the request fails
     */
    setUserProfileConfig(config: UPConfig): Promise<UPConfig>;
    /**
     * Get the UserProfileMetadata from the configuration.
     *
     * Endpoint: GET /admin/realms/{realm}/users/profile/metadata
     *
     * @returns {Promise<UserProfileMetadata>} The user profile metadata
     * @throws {Error} If the request fails
     */
    getUserProfileMetadata(): Promise<UserProfileMetadata>;
    /**
     * Return credential types, which are provided by the user storage where user is stored.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/configured-user-storage-credential-types
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<string[]>} A list of credential types
     * @throws {Error} If the request fails or userId is invalid
     */
    getUserStorageCredentialTypes(userId: string): Promise<string[]>;
    /**
     * Send an email to the user with a link they can click to execute particular actions.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/{id}/execute-actions-email
     *
     * @param {string} userId - The ID of the user
     * @param {string[]} actions - The actions the user can execute
     * @param {ExecuteActionsEmailParams} [params] - Optional parameters for the request
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    executeActionsEmail(userId: string, actions: string[], params?: ExecuteActionsEmailParams): Promise<void>;
    /**
     * Send an email-verification email to the user.
     *
     * Endpoint: PUT /admin/realms/{realm}/users/{id}/send-verify-email
     *
     * @param {string} userId - The ID of the user
     * @param {SendVerifyEmailParams} [params] - Optional parameters for the request
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or userId is invalid
     */
    sendVerifyEmail(userId: string, params?: SendVerifyEmailParams): Promise<void>;
    /**
     * Get sessions associated with the user.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/sessions
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<UserSessionRepresentation[]>} A list of user sessions
     * @throws {Error} If the request fails or userId is invalid
     */
    getUserSessions(userId: string): Promise<UserSessionRepresentation$1[]>;
    /**
     * Get social logins associated with the user.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/federated-identity
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<FederatedIdentityRepresentation[]>} A list of federated identities
     * @throws {Error} If the request fails or userId is invalid
     */
    getFederatedIdentities(userId: string): Promise<FederatedIdentityRepresentation[]>;
    /**
     * Add a social login provider to the user.
     *
     * Endpoint: POST /admin/realms/{realm}/users/{id}/federated-identity/{provider}
     *
     * @param {string} userId - The ID of the user
     * @param {string} provider - The ID of the social login provider
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    addFederatedIdentity(userId: string, provider: string): Promise<void>;
    /**
     * Remove a social login provider from the user.
     *
     * Endpoint: DELETE /admin/realms/{realm}/users/{id}/federated-identity/{provider}
     *
     * @param {string} userId - The ID of the user
     * @param {string} provider - The ID of the social login provider
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    removeFederatedIdentity(userId: string, provider: string): Promise<void>;
    /**
     * Impersonate the user.
     *
     * Endpoint: POST /admin/realms/{realm}/users/{id}/impersonation
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<Record<string, any>>} The impersonation response
     * @throws {Error} If the request fails or userId is invalid
     */
    impersonate(userId: string): Promise<Record<string, any>>;
    /**
     * Remove all user sessions associated with the user.
     *
     * Endpoint: POST /admin/realms/{realm}/users/{id}/logout
     *
     * @param {string} userId - The ID of the user
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or userId is invalid
     */
    logout(userId: string): Promise<void>;
    /**
     * Get offline sessions associated with the user and client.
     *
     * Endpoint: GET /admin/realms/{realm}/users/{id}/offline-sessions/{clientId}
     *
     * @param {string} userId - The ID of the user
     * @param {string} clientId - The ID of the client
     * @returns {Promise<UserSessionRepresentation[]>} A list of user sessions
     * @throws {Error} If the request fails or parameters are invalid
     */
    getOfflineSessions(userId: string, clientId: string): Promise<UserSessionRepresentation$1[]>;
}

/**
 * Types for the Keycloak Groups API
 */
/**
 * Represents a Keycloak group
 */
interface GroupRepresentation {
    id?: string;
    name?: string;
    path?: string;
    parentId?: string;
    subGroupCount?: number;
    subGroups?: GroupRepresentation[];
    attributes?: Record<string, string[]>;
    realmRoles?: string[];
    clientRoles?: Record<string, string[]>;
    access?: Record<string, boolean>;
}
interface GroupRepresentationResponse extends GroupRepresentation {
    id: string;
}
/**
 * Parameters for getting groups
 */
interface GetGroupsParams {
    briefRepresentation?: boolean;
    exact?: boolean;
    first?: number;
    max?: number;
    populateHierarchy?: boolean;
    q?: string;
    search?: string;
}
/**
 * Parameters for getting group count
 */
interface GetGroupsCountParams {
    search?: string;
    top?: boolean;
}
/**
 * Parameters for getting group members
 */
interface GetGroupMembersParams {
    briefRepresentation?: boolean;
    first?: number;
    max?: number;
}
/**
 * Parameters for getting group children
 */
interface GetGroupChildrenParams {
    briefRepresentation?: boolean;
    exact?: boolean;
    first?: number;
    max?: number;
    search?: string;
}
/**
 * Reference for management permissions
 */
interface ManagementPermissionReference$1 {
    enabled?: boolean;
    resource?: string;
    scopePermissions?: Record<string, string>;
}

/**
 * API for managing Keycloak groups
 */
declare class GroupsApi {
    private sdk;
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get group hierarchy. Only name and id are returned.
     * SubGroups are only returned when using the search or q parameter.
     *
     * Endpoint: GET /admin/realms/{realm}/groups
     *
     * @param {GetGroupsParams} [params] - Parameters to filter the groups
     * @returns {Promise<GroupRepresentation[]>} A list of groups
     * @throws {Error} If the request fails
     */
    list(params?: GetGroupsParams): Promise<GroupRepresentation[]>;
    /**
     * Returns the groups count.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/count
     *
     * @param {GetGroupsCountParams} [params] - Parameters to filter the count
     * @returns {Promise<Record<string, number>>} The count of groups
     * @throws {Error} If the request fails
     */
    count(params?: GetGroupsCountParams): Promise<number>;
    /**
     * Create or add a top level realm group.
     *
     * Endpoint: POST /admin/realms/{realm}/groups
     *
     * @param {GroupRepresentation} group - The group to create
     * @returns {Promise<string>} The ID of the created group
     * @throws {Error} If the request fails or group data is invalid
     */
    create(group: GroupRepresentation): Promise<string>;
    /**
     * Get a specific group by ID.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}
     *
     * @param {string} groupId - The ID of the group
     * @returns {Promise<GroupRepresentation>} The group representation
     * @throws {Error} If the request fails or groupId is invalid
     */
    get(groupId: string): Promise<GroupRepresentationResponse>;
    /**
     * Update group, ignores subgroups.
     *
     * Endpoint: PUT /admin/realms/{realm}/groups/{group-id}
     *
     * @param {string} groupId - The ID of the group
     * @param {GroupRepresentation} group - The group representation with updated data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    update(groupId: string, group: GroupRepresentation): Promise<void>;
    /**
     * Delete a group.
     *
     * Endpoint: DELETE /admin/realms/{realm}/groups/{group-id}
     *
     * @param {string} groupId - The ID of the group
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or groupId is invalid
     */
    delete(groupId: string): Promise<void>;
    /**
     * Return a paginated list of subgroups that have a parent group corresponding to the group ID.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}/children
     *
     * @param {string} groupId - The ID of the parent group
     * @param {GetGroupChildrenParams} [params] - Parameters to filter the children
     * @returns {Promise<GroupRepresentation[]>} A list of child groups
     * @throws {Error} If the request fails or groupId is invalid
     */
    getChildren(groupId: string, params?: GetGroupChildrenParams): Promise<GroupRepresentation[]>;
    /**
     * Set or create child group.
     * This will just set the parent if it exists. Create it and set the parent if the group doesn't exist.
     *
     * Endpoint: POST /admin/realms/{realm}/groups/{group-id}/children
     *
     * @param {string} groupId - The ID of the parent group
     * @param {GroupRepresentation} child - The child group to create or set
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    createChild(groupId: string, child: GroupRepresentation): Promise<void>;
    /**
     * Add a user to a group.
     *
     * @param {string} userId - The ID of the user.
     * @param {string} groupId - The ID of the group.
     * @returns {Promise<void>}
     */
    addMember(userId: string, groupId: string): Promise<void>;
    /**
     * Get users in a group.
     * Returns a stream of users, filtered according to query parameters.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}/members
     *
     * @param {string} groupId - The ID of the group
     * @param {GetGroupMembersParams} [params] - Parameters to filter the members
     * @returns {Promise<UserRepresentation[]>} A list of users in the group
     * @throws {Error} If the request fails or groupId is invalid
     */
    getMembers(groupId: string, params?: GetGroupMembersParams): Promise<UserRepresentation[]>;
    /**
     * Get management permissions for a group.
     * Return object stating whether client Authorization permissions have been initialized or not and a reference.
     *
     * Endpoint: GET /admin/realms/{realm}/groups/{group-id}/management/permissions
     *
     * @param {string} groupId - The ID of the group
     * @returns {Promise<ManagementPermissionReference>} The management permissions reference
     * @throws {Error} If the request fails or groupId is invalid
     */
    getManagementPermissions(groupId: string): Promise<ManagementPermissionReference$1>;
    /**
     * Set management permissions for a group.
     *
     * Endpoint: PUT /admin/realms/{realm}/groups/{group-id}/management/permissions
     *
     * @param {string} groupId - The ID of the group
     * @param {ManagementPermissionReference} permissions - The management permissions to set
     * @returns {Promise<ManagementPermissionReference>} The updated management permissions reference
     * @throws {Error} If the request fails or parameters are invalid
     */
    setManagementPermissions(groupId: string, permissions: ManagementPermissionReference$1): Promise<ManagementPermissionReference$1>;
}

/**
 * Types for Keycloak Clients API
 */
/**
 * Represents a Keycloak client
 */
interface ClientRepresentation {
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
interface ClientScopeRepresentation {
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
interface ProtocolMapperRepresentation {
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
interface CredentialRepresentation {
    type?: string;
    value?: string;
    temporary?: boolean;
}
/**
 * Represents a user session associated with a client
 */
interface UserSessionRepresentation {
    id?: string;
    username?: string;
    userId?: string;
    ipAddress?: string;
    start?: number;
    lastAccess?: number;
    clients?: Record<string, string>;
}

/**
 * Organization types for Keycloak Admin SDK
 *
 * These types represent the organization-related objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */

/**
 * Organization domain representation
 */
interface OrganizationDomainRepresentation {
    /**
     * Domain name
     */
    name?: string;
    /**
     * Whether the domain is verified
     */
    verified?: boolean;
}
/**
 * Organization representation
 */
interface OrganizationRepresentation {
    /**
     * Organization ID
     */
    id?: string;
    /**
     * Organization name
     */
    name?: string;
    /**
     * Organization alias
     */
    alias?: string;
    /**
     * Whether the organization is enabled
     */
    enabled?: boolean;
    /**
     * Organization description
     */
    description?: string;
    /**
     * Organization redirect URL
     */
    redirectUrl?: string;
    /**
     * Organization attributes
     */
    attributes?: Record<string, string[]>;
    /**
     * Organization domains
     */
    domains?: OrganizationDomainRepresentation[];
    /**
     * Organization members
     */
    members?: OrganizationMemberRepresentation[];
    /**
     * Organization identity providers
     */
    identityProviders?: IdentityProviderRepresentation$1[];
}
/**
 * Organization member representation
 */
interface OrganizationMemberRepresentation {
    /**
     * Member ID (user ID)
     */
    id?: string;
    /**
     * Member username
     */
    username?: string;
    /**
     * Member email
     */
    email?: string;
    /**
     * Member first name
     */
    firstName?: string;
    /**
     * Member last name
     */
    lastName?: string;
    /**
     * Member roles within the organization
     */
    roles?: string[];
    /**
     * Member join date
     */
    joinedAt?: string;
}
/**
 * Organization search query parameters
 */
interface OrganizationQuery {
    /**
     * Search string to filter organizations
     */
    search?: string;
    /**
     * First result index
     */
    first?: number;
    /**
     * Maximum number of results
     */
    max?: number;
    /**
     * Exact match for name
     */
    exact?: boolean;
}

/**
 * Types for the Keycloak Realms Admin API
 */

/**
 * Represents a Keycloak role
 */
interface RoleRepresentation {
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
declare enum BruteForceStrategy {
    PERMANENT_LOCKOUT = "PERMANENT_LOCKOUT",
    TEMPORARY_LOCKOUT = "TEMPORARY_LOCKOUT",
    NO_LOCKOUT = "NO_LOCKOUT"
}
/**
 * Represents a user federation provider
 */
interface UserFederationProviderRepresentation {
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
interface UserFederationMapperRepresentation {
    id?: string;
    name?: string;
    federationProviderDisplayName?: string;
    federationMapperType?: string;
    config?: Record<string, string>;
}
/**
 * Represents an identity provider
 */
interface IdentityProviderRepresentation$1 {
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
interface IdentityProviderMapperRepresentation$1 {
    id?: string;
    name?: string;
    identityProviderAlias?: string;
    identityProviderMapper?: string;
    config?: Record<string, string>;
}
/**
 * Represents an authentication flow
 */
interface AuthenticationFlowRepresentation {
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
interface AuthenticationExecutionExportRepresentation {
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
interface AuthenticatorConfigRepresentation {
    id?: string;
    alias?: string;
    config?: Record<string, string>;
}
/**
 * Represents a required action provider
 */
interface RequiredActionProviderRepresentation {
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
interface ScopeMappingRepresentation {
    client?: string;
    clientScope?: string;
    roles?: string[];
    self?: string;
}
/**
 * Represents an application
 */
interface ApplicationRepresentation {
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
interface OAuthClientRepresentation {
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
interface ClientTemplateRepresentation {
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
interface RealmRepresentation {
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
    identityProviders?: IdentityProviderRepresentation$1[];
    identityProviderMappers?: IdentityProviderMapperRepresentation$1[];
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
interface RolesRepresentation {
    realm?: RoleRepresentation[];
    client?: Record<string, RoleRepresentation[]>;
}
/**
 * Represents the realm events configuration
 */
interface RealmEventsConfigRepresentation {
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
interface AdminEventRepresentation {
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
interface AuthDetailsRepresentation {
    realmId?: string;
    clientId?: string;
    userId?: string;
    ipAddress?: string;
}
/**
 * Represents an event
 */
interface EventRepresentation {
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
interface GetRealmsParams {
    briefRepresentation?: boolean;
}
/**
 * Parameters for getting realm events
 */
interface GetRealmEventsParams {
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
interface GetAdminEventsParams {
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
interface ClientTypeRepresentation {
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
interface ClientTypesRepresentation {
    global?: ClientTypeRepresentation[];
    realm?: ClientTypeRepresentation[];
}
/**
 * Client policy condition representation
 */
interface ClientPolicyConditionRepresentation {
    condition?: string;
    configuration?: Record<string, any>;
}
/**
 * Client policy executor representation
 */
interface ClientPolicyExecutorRepresentation {
    executor?: string;
    configuration?: Record<string, any>;
}
/**
 * Client policy representation
 */
interface ClientPolicyRepresentation {
    name?: string;
    description?: string;
    enabled?: boolean;
    conditions?: ClientPolicyConditionRepresentation[];
    profiles?: string[];
}
/**
 * Client policies representation
 */
interface ClientPoliciesRepresentation {
    policies?: ClientPolicyRepresentation[];
    globalPolicies?: ClientPolicyRepresentation[];
}
/**
 * Client profile representation
 */
interface ClientProfileRepresentation {
    name?: string;
    description?: string;
    executors?: ClientPolicyExecutorRepresentation[];
    global?: boolean;
}
/**
 * Client profiles representation
 */
interface ClientProfilesRepresentation {
    profiles?: ClientProfileRepresentation[];
    globalProfiles?: ClientProfileRepresentation[];
}
/**
 * Management permission reference
 */
interface ManagementPermissionReference {
    enabled?: boolean;
    resource?: string;
    scopePermissions?: Record<string, string>;
}
/**
 * Global request result
 */
interface GlobalRequestResult {
    successRequests?: string[];
    failedRequests?: string[];
}

/**
 * API for managing Keycloak realms
 */
declare class RealmsApi {
    private sdk;
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get accessible realms
     * Returns a list of accessible realms. The list is filtered based on what realms the caller is allowed to view.
     *
     * Endpoint: GET /admin/realms
     *
     * @param {GetRealmsParams} [params] - Parameters to filter the realms
     * @returns {Promise<RealmRepresentation[]>} A list of accessible realms
     * @throws {Error} If the request fails
     */
    list(params?: GetRealmsParams): Promise<RealmRepresentation[]>;
    /**
     * Create a new realm
     * Imports a realm from a full representation of that realm.
     *
     * Endpoint: POST /admin/realms
     *
     * @param {RealmRepresentation} realm - The realm representation to create
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or realm data is invalid
     */
    create(realm: RealmRepresentation): Promise<void>;
    /**
     * Get a specific realm
     * Get the top-level representation of the realm. It will not include nested information like User and Client representations.
     *
     * Endpoint: GET /admin/realms/{realm}
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<RealmRepresentation>} The realm representation
     * @throws {Error} If the request fails or realmName is invalid
     */
    get(realmName: string): Promise<RealmRepresentation>;
    /**
     * Update a realm
     * Update the top-level information of the realm. Any user, roles or client information in the representation will be ignored.
     *
     * Endpoint: PUT /admin/realms/{realm}
     *
     * @param {string} realmName - The name of the realm
     * @param {RealmRepresentation} realm - The realm representation with updated data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    update(realmName: string, realm: RealmRepresentation): Promise<void>;
    /**
     * Delete a realm
     *
     * Endpoint: DELETE /admin/realms/{realm}
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or realmName is invalid
     */
    delete(realmName: string): Promise<void>;
    /**
     * Get the events provider configuration
     * Returns JSON object with events provider configuration
     *
     * Endpoint: GET /admin/realms/{realm}/events/config
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<RealmEventsConfigRepresentation>} The events configuration
     * @throws {Error} If the request fails or realmName is invalid
     */
    getEventsConfig(realmName: string): Promise<RealmEventsConfigRepresentation>;
    /**
     * Update the events provider
     * Change the events provider and/or its configuration
     *
     * Endpoint: PUT /admin/realms/{realm}/events/config
     *
     * @param {string} realmName - The name of the realm
     * @param {RealmEventsConfigRepresentation} config - The events configuration
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateEventsConfig(realmName: string, config: RealmEventsConfigRepresentation): Promise<void>;
    /**
     * Get events
     * Returns all events, or filters them based on URL query parameters
     *
     * Endpoint: GET /admin/realms/{realm}/events
     *
     * @param {string} realmName - The name of the realm
     * @param {GetRealmEventsParams} [params] - Parameters to filter the events
     * @returns {Promise<EventRepresentation[]>} A list of events
     * @throws {Error} If the request fails or realmName is invalid
     */
    getEvents(realmName: string, params?: GetRealmEventsParams): Promise<EventRepresentation[]>;
    /**
     * Delete all events
     *
     * Endpoint: DELETE /admin/realms/{realm}/events
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or realmName is invalid
     */
    deleteEvents(realmName: string): Promise<void>;
    /**
     * Get admin events
     * Returns all admin events, or filters events based on URL query parameters
     *
     * Endpoint: GET /admin/realms/{realm}/admin-events
     *
     * @param {string} realmName - The name of the realm
     * @param {GetAdminEventsParams} [params] - Parameters to filter the admin events
     * @returns {Promise<AdminEventRepresentation[]>} A list of admin events
     * @throws {Error} If the request fails or realmName is invalid
     */
    getAdminEvents(realmName: string, params?: GetAdminEventsParams): Promise<AdminEventRepresentation[]>;
    /**
     * Delete all admin events
     *
     * Endpoint: DELETE /admin/realms/{realm}/admin-events
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or realmName is invalid
     */
    deleteAdminEvents(realmName: string): Promise<void>;
    /**
     * Remove all user sessions
     * Any client that has an admin url will also be told to invalidate any sessions they have.
     *
     * Endpoint: POST /admin/realms/{realm}/logout-all
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<GlobalRequestResult>} Result of the logout operation
     * @throws {Error} If the request fails or realmName is invalid
     */
    logoutAll(realmName: string): Promise<GlobalRequestResult>;
    /**
     * Push the realm's revocation policy
     * Push the realm's revocation policy to any client that has an admin url associated with it.
     *
     * Endpoint: POST /admin/realms/{realm}/push-revocation
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<GlobalRequestResult>} Result of the push operation
     * @throws {Error} If the request fails or realmName is invalid
     */
    pushRevocation(realmName: string): Promise<GlobalRequestResult>;
    /**
     * Partial export of existing realm
     * Export a realm into a JSON file.
     *
     * Endpoint: POST /admin/realms/{realm}/partial-export
     *
     * @param {string} realmName - The name of the realm
     * @param {boolean} [exportClients] - Whether to export clients
     * @param {boolean} [exportGroupsAndRoles] - Whether to export groups and roles
     * @returns {Promise<RealmRepresentation>} The exported realm representation
     * @throws {Error} If the request fails or realmName is invalid
     */
    partialExport(realmName: string, exportClients?: boolean, exportGroupsAndRoles?: boolean): Promise<RealmRepresentation>;
    /**
     * Partial import from a JSON file to an existing realm
     *
     * Endpoint: POST /admin/realms/{realm}/partialImport
     *
     * @param {string} realmName - The name of the realm
     * @param {RealmRepresentation} data - The realm data to import
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    partialImport(realmName: string, data: RealmRepresentation): Promise<void>;
    /**
     * Test SMTP connection
     * Test SMTP connection with current logged in user
     *
     * Endpoint: POST /admin/realms/{realm}/testSMTPConnection
     *
     * @param {string} realmName - The name of the realm
     * @param {Record<string, string>} config - SMTP server configuration
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    testSMTPConnection(realmName: string, config: Record<string, string>): Promise<void>;
    /**
     * Get client session stats
     * Returns a JSON map where the key is the client id and the value is the number of active sessions
     *
     * Endpoint: GET /admin/realms/{realm}/client-session-stats
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<Array<{id: string, active: number}>>} Client session stats
     * @throws {Error} If the request fails or realmName is invalid
     */
    getClientSessionStats(realmName: string): Promise<Array<{
        id: string;
        active: string;
        offline: string;
        clientId: string;
    }>>;
    /**
     * Get client policies
     *
     * Endpoint: GET /admin/realms/{realm}/client-policies/policies
     *
     * @param {string} realmName - The name of the realm
     * @param {boolean} [includeGlobalPolicies] - Whether to include global policies
     * @returns {Promise<ClientPoliciesRepresentation>} Client policies
     * @throws {Error} If the request fails or realmName is invalid
     */
    getClientPolicies(realmName: string, includeGlobalPolicies?: boolean): Promise<ClientPoliciesRepresentation>;
    /**
     * Update client policies
     *
     * Endpoint: PUT /admin/realms/{realm}/client-policies/policies
     *
     * @param {string} realmName - The name of the realm
     * @param {ClientPoliciesRepresentation} policies - The client policies to update
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateClientPolicies(realmName: string, policies: ClientPoliciesRepresentation): Promise<void>;
    /**
     * Get client profiles
     *
     * Endpoint: GET /admin/realms/{realm}/client-policies/profiles
     *
     * @param {string} realmName - The name of the realm
     * @param {boolean} [includeGlobalProfiles] - Whether to include global profiles
     * @returns {Promise<ClientProfilesRepresentation>} Client profiles
     * @throws {Error} If the request fails or realmName is invalid
     */
    getClientProfiles(realmName: string, includeGlobalProfiles?: boolean): Promise<ClientProfilesRepresentation>;
    /**
     * Update client profiles
     *
     * Endpoint: PUT /admin/realms/{realm}/client-policies/profiles
     *
     * @param {string} realmName - The name of the realm
     * @param {ClientProfilesRepresentation} profiles - The client profiles to update
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateClientProfiles(realmName: string, profiles: ClientProfilesRepresentation): Promise<void>;
    /**
     * Get client types
     * List all client types available in the current realm
     *
     * Endpoint: GET /admin/realms/{realm}/client-types
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<ClientTypesRepresentation>} Client types
     * @throws {Error} If the request fails or realmName is invalid
     */
    getClientTypes(realmName: string): Promise<ClientTypesRepresentation>;
    /**
     * Update client types
     * This endpoint allows you to update a realm level client type
     *
     * Endpoint: PUT /admin/realms/{realm}/client-types
     *
     * @param {string} realmName - The name of the realm
     * @param {ClientTypesRepresentation} clientTypes - The client types to update
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateClientTypes(realmName: string, clientTypes: ClientTypesRepresentation): Promise<void>;
    /**
     * Get users management permissions
     *
     * Endpoint: GET /admin/realms/{realm}/users-management-permissions
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<ManagementPermissionReference>} Users management permissions
     * @throws {Error} If the request fails or realmName is invalid
     */
    getUsersManagementPermissions(realmName: string): Promise<ManagementPermissionReference>;
    /**
     * Update users management permissions
     *
     * Endpoint: PUT /admin/realms/{realm}/users-management-permissions
     *
     * @param {string} realmName - The name of the realm
     * @param {ManagementPermissionReference} permissions - The permissions to update
     * @returns {Promise<ManagementPermissionReference>} Updated permissions
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateUsersManagementPermissions(realmName: string, permissions: ManagementPermissionReference): Promise<ManagementPermissionReference>;
    /**
     * Convert client representation from an external format
     * Base path for importing clients under this realm
     *
     * Endpoint: POST /admin/realms/{realm}/client-description-converter
     *
     * @param {string} realmName - The name of the realm
     * @param {string} description - The client description in an external format (e.g., OpenID Connect Discovery JSON)
     * @returns {Promise<any>} Converted client representation
     * @throws {Error} If the request fails or parameters are invalid
     */
    convertClientDescription(realmName: string, description: string): Promise<any>;
    /**
     * Get supported locales
     * Returns a list of supported locales for the realm
     *
     * Endpoint: GET /admin/realms/{realm}/localization
     *
     * @param {string} realmName - The name of the realm
     * @returns {Promise<string[]>} List of supported locales
     * @throws {Error} If the request fails or realmName is invalid
     */
    getLocalizationLocales(realmName: string): Promise<string[]>;
    /**
     * Get localization texts for a specific locale
     *
     * Endpoint: GET /admin/realms/{realm}/localization/{locale}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} locale - The locale to get texts for
     * @param {boolean} [useRealmDefaultLocaleFallback] - Whether to use realm default locale as fallback
     * @returns {Promise<Record<string, string>>} Localization texts
     * @throws {Error} If the request fails or parameters are invalid
     */
    getLocalizationTexts(realmName: string, locale: string, useRealmDefaultLocaleFallback?: boolean): Promise<Record<string, string>>;
    /**
     * Add or update localization texts
     * Import localization from uploaded JSON file
     *
     * Endpoint: POST /admin/realms/{realm}/localization/{locale}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} locale - The locale to update
     * @param {Record<string, string>} texts - The localization texts
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    addLocalizationTexts(realmName: string, locale: string, texts: Record<string, string>): Promise<void>;
    /**
     * Delete all texts for a locale
     *
     * Endpoint: DELETE /admin/realms/{realm}/localization/{locale}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} locale - The locale to delete
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    deleteLocalizationTexts(realmName: string, locale: string): Promise<void>;
    /**
     * Get text for a specific key and locale
     *
     * Endpoint: GET /admin/realms/{realm}/localization/{locale}/{key}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} locale - The locale
     * @param {string} key - The key to get text for
     * @returns {Promise<string>} Localization text
     * @throws {Error} If the request fails or parameters are invalid
     */
    getLocalizationText(realmName: string, locale: string, key: string): Promise<string>;
    /**
     * Update text for a specific key and locale
     *
     * Endpoint: PUT /admin/realms/{realm}/localization/{locale}/{key}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} locale - The locale
     * @param {string} key - The key to update
     * @param {string} text - The new text
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateLocalizationText(realmName: string, locale: string, key: string, text: string): Promise<void>;
    /**
     * Delete text for a specific key and locale
     *
     * Endpoint: DELETE /admin/realms/{realm}/localization/{locale}/{key}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} locale - The locale
     * @param {string} key - The key to delete
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    deleteLocalizationText(realmName: string, locale: string, key: string): Promise<void>;
    /**
     * Delete a specific user session
     * Remove a specific user session. Any client that has an admin url will also be told to invalidate this particular session.
     *
     * Endpoint: DELETE /admin/realms/{realm}/sessions/{session}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} sessionId - The session ID to delete
     * @param {boolean} [isOffline] - Whether this is an offline session
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    deleteUserSession(realmName: string, sessionId: string, isOffline?: boolean): Promise<void>;
    /**
     * Get group by path
     *
     * Endpoint: GET /admin/realms/{realm}/group-by-path/{path}
     *
     * @param {string} realmName - The name of the realm
     * @param {string} path - The group path
     * @returns {Promise<any>} Group representation
     * @throws {Error} If the request fails or parameters are invalid
     */
    getGroupByPath(realmName: string, path: string): Promise<any>;
}

/**
 * Type definitions for Keycloak certificate management
 */
/**
 * Represents a certificate configuration
 */
interface CertificateRepresentation {
    /**
     * Certificate in PEM format
     */
    certificate?: string;
    /**
     * Private key in PEM format (only included in specific operations)
     */
    privateKey?: string;
    /**
     * Public key in PEM format
     */
    publicKey?: string;
    /**
     * Key type (e.g., RSA)
     */
    keyType?: string;
    /**
     * Key usage
     */
    keyUsage?: string;
    /**
     * Algorithm used (e.g., RS256)
     */
    algorithm?: string;
    /**
     * Key size in bits
     */
    keySize?: number;
    /**
     * Certificate serial number
     */
    serialNumber?: string;
    /**
     * Certificate subject DN
     */
    subjectDN?: string;
    /**
     * Certificate issuer DN
     */
    issuerDN?: string;
    /**
     * Not before date
     */
    notBefore?: number;
    /**
     * Not after date (expiration)
     */
    notAfter?: number;
}
/**
 * Configuration for keystore generation and management
 */
interface KeyStoreConfig {
    /**
     * Keystore format (JKS, PKCS12)
     */
    format?: string;
    /**
     * Key alias in the keystore
     */
    keyAlias?: string;
    /**
     * Keystore password
     */
    keyPassword?: string;
    /**
     * Store password
     */
    storePassword?: string;
    /**
     * Key size in bits (e.g., 2048, 4096)
     */
    keySize?: number;
    /**
     * Key algorithm (e.g., RSA)
     */
    keyAlgorithm?: string;
    /**
     * Signature algorithm (e.g., SHA256withRSA)
     */
    signatureAlgorithm?: string;
    /**
     * Certificate validity in days
     */
    validity?: number;
    /**
     * Subject DN for the certificate
     */
    subject?: string;
    /**
     * Reuse existing key if present
     */
    reuseKey?: boolean;
}
/**
 * Represents client initial access token information
 */
interface ClientInitialAccessPresentation {
    /**
     * Unique ID of the initial access token
     */
    id?: string;
    /**
     * Token value
     */
    token?: string;
    /**
     * Timestamp when the token was created
     */
    timestamp?: number;
    /**
     * Expiration time in seconds
     */
    expiration?: number;
    /**
     * Number of times the token can be used
     */
    count?: number;
    /**
     * Remaining uses of the token
     */
    remainingCount?: number;
}
/**
 * Parameters for creating a client initial access token
 */
interface ClientInitialAccessCreatePresentation {
    /**
     * Token expiration time in seconds
     */
    expiration?: number;
    /**
     * Number of times the token can be used
     */
    count?: number;
    /**
     * ID of the created token (returned after creation)
     */
    id?: string;
    /**
     * Token value (returned after creation)
     */
    token?: string;
}
/**
 * Component type representation for client registration policy
 */
interface ComponentTypeRepresentation$1 {
    /**
     * Component ID
     */
    id?: string;
    /**
     * Component name
     */
    name?: string;
    /**
     * Help text
     */
    helpText?: string;
    /**
     * Configuration properties
     */
    properties?: Record<string, any>;
    /**
     * Metadata
     */
    metadata?: Record<string, any>;
}

/**
 * Client Certificates API for Keycloak Admin SDK
 * Provides methods for managing client certificates in Keycloak
 */

/**
 * API for managing Keycloak client certificates
 */
declare class ClientCertificatesApi {
    private sdk;
    /**
     * Creates a new instance of the Client Certificates API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get certificate information for a client
     *
     * Endpoint: GET /{realm}/clients/{client-uuid}/certificates/{attr}
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @returns {Promise<CertificateRepresentation>} Certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    getCertificateInfo(clientId: string, attr: string): Promise<CertificateRepresentation>;
    /**
     * Generate a new certificate with new key pair
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/generate
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @returns {Promise<CertificateRepresentation>} Generated certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    generateCertificate(clientId: string, attr: string): Promise<CertificateRepresentation>;
    /**
     * Upload only certificate, not private key
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/upload-certificate
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {CertificateRepresentation} certificate - Certificate data with certificate field
     * @returns {Promise<CertificateRepresentation>} Updated certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    uploadCertificate(clientId: string, attr: string, certificate: CertificateRepresentation): Promise<CertificateRepresentation>;
    /**
     * Upload certificate and eventually private key
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/upload
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {CertificateRepresentation} certificate - Certificate data with certificate and privateKey fields
     * @returns {Promise<CertificateRepresentation>} Updated certificate information
     * @throws {Error} If the request fails or parameters are invalid
     */
    uploadCertificateWithKey(clientId: string, attr: string, certificate: CertificateRepresentation): Promise<CertificateRepresentation>;
    /**
     * Get a keystore file for the client, containing private key and public certificate
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/download
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {KeyStoreConfig} config - Keystore configuration
     * @returns {Promise<ArrayBuffer>} Keystore file as binary data
     * @throws {Error} If the request fails or parameters are invalid
     */
    downloadKeystore(clientId: string, attr: string, config: KeyStoreConfig): Promise<ArrayBuffer>;
    /**
     * Generate a new keypair and certificate, and get the private key file
     * Only generated public certificate is saved in Keycloak DB - the private key is not.
     *
     * Endpoint: POST /{realm}/clients/{client-uuid}/certificates/{attr}/generate-and-download
     *
     * @param {string} clientId - The client UUID (not client-id)
     * @param {string} attr - Certificate attribute (e.g., 'jwt.credential')
     * @param {KeyStoreConfig} config - Keystore configuration
     * @returns {Promise<ArrayBuffer>} Generated keystore file as binary data
     * @throws {Error} If the request fails or parameters are invalid
     */
    generateAndDownloadKeystore(clientId: string, attr: string, config: KeyStoreConfig): Promise<ArrayBuffer>;
}

/**
 * Client Initial Access API for Keycloak Admin SDK
 * Provides methods for managing client initial access tokens in Keycloak
 */

/**
 * API for managing Keycloak client initial access tokens
 */
declare class ClientInitialAccessApi {
    private sdk;
    /**
     * Creates a new instance of the Client Initial Access API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all client initial access tokens
     *
     * Endpoint: GET /{realm}/clients-initial-access
     *
     * @returns {Promise<ClientInitialAccessPresentation[]>} List of client initial access tokens
     * @throws {Error} If the request fails
     */
    findAll(): Promise<ClientInitialAccessPresentation[]>;
    /**
     * Create a new client initial access token
     *
     * Endpoint: POST /{realm}/clients-initial-access
     *
     * @param {ClientInitialAccessCreatePresentation} token - The token configuration
     * @returns {Promise<ClientInitialAccessCreatePresentation>} The created token with ID and token value
     * @throws {Error} If the request fails or token configuration is invalid
     */
    create(token: ClientInitialAccessCreatePresentation): Promise<ClientInitialAccessCreatePresentation>;
    /**
     * Delete a client initial access token
     *
     * Endpoint: DELETE /{realm}/clients-initial-access/{id}
     *
     * @param {string} id - The token ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or ID is invalid
     */
    delete(id: string): Promise<void>;
}

/**
 * Client Registration Policy API for Keycloak Admin SDK
 * Provides methods for managing client registration policies in Keycloak
 */

/**
 * API for managing Keycloak client registration policies
 */
declare class ClientRegistrationPolicyApi {
    private sdk;
    /**
     * Creates a new instance of the Client Registration Policy API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all client registration policy providers
     * Base path for retrieve providers with the configProperties properly filled
     *
     * Endpoint: GET /{realm}/client-registration-policy/providers
     *
     * @returns {Promise<ComponentTypeRepresentation[]>} List of client registration policy providers
     * @throws {Error} If the request fails
     */
    getProviders(): Promise<ComponentTypeRepresentation$1[]>;
}

/**
 * Client Scopes API for Keycloak Admin SDK
 * Provides methods for managing client scopes in Keycloak
 */

/**
 * API for managing Keycloak client scopes
 */
declare class ClientScopesApi {
    private sdk;
    /**
     * Creates a new instance of the Client Scopes API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all client scopes in a realm
     *
     * Endpoint: GET /{realm}/client-scopes
     *
     * @returns {Promise<ClientScopeRepresentation[]>} List of client scopes
     * @throws {Error} If the request fails
     */
    findAll(): Promise<ClientScopeRepresentation[]>;
    /**
     * Create a new client scope
     *
     * Endpoint: POST /{realm}/client-scopes
     *
     * @param {ClientScopeRepresentation} clientScope - The client scope to create
     * @returns {Promise<string>} The ID of the created client scope
     * @throws {Error} If the request fails or client scope data is invalid
     */
    create(clientScope: ClientScopeRepresentation): Promise<string>;
    /**
     * Get a client scope by ID
     *
     * Endpoint: GET /{realm}/client-scopes/{id}
     *
     * @param {string} id - The client scope ID
     * @returns {Promise<ClientScopeRepresentation>} The client scope representation
     * @throws {Error} If the request fails or ID is invalid
     */
    findById(id: string): Promise<ClientScopeRepresentation>;
    /**
     * Update a client scope
     *
     * Endpoint: PUT /{realm}/client-scopes/{id}
     *
     * @param {string} id - The client scope ID
     * @param {ClientScopeRepresentation} clientScope - The updated client scope data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    update(id: string, clientScope: ClientScopeRepresentation): Promise<void>;
    /**
     * Delete a client scope
     *
     * Endpoint: DELETE /{realm}/client-scopes/{id}
     *
     * @param {string} id - The client scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or ID is invalid
     */
    delete(id: string): Promise<void>;
    /**
     * Get protocol mappers for a client scope
     *
     * Endpoint: GET /{realm}/client-scopes/{id}/protocol-mappers/models
     *
     * @param {string} id - The client scope ID
     * @returns {Promise<ProtocolMapperRepresentation[]>} List of protocol mappers
     * @throws {Error} If the request fails or ID is invalid
     */
    getProtocolMappers(id: string): Promise<ProtocolMapperRepresentation[]>;
    /**
     * Create a protocol mapper for a client scope
     *
     * Endpoint: POST /{realm}/client-scopes/{id}/protocol-mappers/models
     *
     * @param {string} id - The client scope ID
     * @param {ProtocolMapperRepresentation} mapper - The protocol mapper to create
     * @returns {Promise<string>} The ID of the created protocol mapper
     * @throws {Error} If the request fails or parameters are invalid
     */
    createProtocolMapper(id: string, mapper: ProtocolMapperRepresentation): Promise<string>;
    /**
     * Get a protocol mapper by ID for a client scope
     *
     * Endpoint: GET /{realm}/client-scopes/{id}/protocol-mappers/models/{mapperId}
     *
     * @param {string} id - The client scope ID
     * @param {string} mapperId - The protocol mapper ID
     * @returns {Promise<ProtocolMapperRepresentation>} The protocol mapper representation
     * @throws {Error} If the request fails or parameters are invalid
     */
    getProtocolMapper(id: string, mapperId: string): Promise<ProtocolMapperRepresentation>;
    /**
     * Update a protocol mapper for a client scope
     *
     * Endpoint: PUT /{realm}/client-scopes/{id}/protocol-mappers/models/{mapperId}
     *
     * @param {string} id - The client scope ID
     * @param {string} mapperId - The protocol mapper ID
     * @param {ProtocolMapperRepresentation} mapper - The updated protocol mapper data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    updateProtocolMapper(id: string, mapperId: string, mapper: ProtocolMapperRepresentation): Promise<void>;
    /**
     * Delete a protocol mapper from a client scope
     *
     * Endpoint: DELETE /{realm}/client-scopes/{id}/protocol-mappers/models/{mapperId}
     *
     * @param {string} id - The client scope ID
     * @param {string} mapperId - The protocol mapper ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    deleteProtocolMapper(id: string, mapperId: string): Promise<void>;
}

/**
 * Client Role Mappings API
 *
 * This module provides methods to manage client role mappings for users and groups in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Client Role Mappings API
 *
 * Provides methods to manage client role mappings for users and groups
 */
declare class ClientRoleMappingsApi {
    private sdk;
    /**
     * Constructor for ClientRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get client-level role mappings for a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of role representations
     */
    getUserClientRoleMappings(userId: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add client-level roles to a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addUserClientRoleMappings(userId: string, clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete client-level roles from a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    deleteUserClientRoleMappings(userId: string, clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available client-level roles that can be mapped to a user
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of available role representations
     */
    getAvailableUserClientRoleMappings(userId: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective client-level role mappings for a user (including composite roles)
     *
     * @param userId - User ID
     * @param clientId - Client ID (not client ID)
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of effective role representations
     */
    getEffectiveUserClientRoleMappings(userId: string, clientId: string, briefRepresentation?: boolean): Promise<RoleRepresentation$1[]>;
    /**
     * Get client-level role mappings for a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of role representations
     */
    getGroupClientRoleMappings(groupId: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add client-level roles to a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addGroupClientRoleMappings(groupId: string, clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete client-level roles from a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    deleteGroupClientRoleMappings(groupId: string, clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available client-level roles that can be mapped to a group
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @returns Promise resolving to an array of available role representations
     */
    getAvailableGroupClientRoleMappings(groupId: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective client-level role mappings for a group (including composite roles)
     *
     * @param groupId - Group ID
     * @param clientId - Client ID (not client ID)
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of effective role representations
     */
    getEffectiveGroupClientRoleMappings(groupId: string, clientId: string, briefRepresentation?: boolean): Promise<RoleRepresentation$1[]>;
}

/**
 * Clients API for Keycloak Admin SDK
 * Provides methods for managing clients in Keycloak
 */

/**
 * API for managing Keycloak clients
 */
declare class ClientsApi {
    private sdk;
    /**
     * Client certificates API for managing client certificates
     */
    certificates: ClientCertificatesApi;
    /**
     * Client initial access API for managing client registration tokens
     */
    initialAccess: ClientInitialAccessApi;
    /**
     * Client registration policy API for managing registration policies
     */
    registrationPolicy: ClientRegistrationPolicyApi;
    /**
     * API for managing Keycloak client scopes
     */
    clientScopes: ClientScopesApi;
    /**
     * Client Role Mappings API
     */
    clientRoleMappings: ClientRoleMappingsApi;
    /**
     * Creates a new instance of the Clients API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all clients in a realm
     *
     * Endpoint: GET /{realm}/clients
     *
     * @param {string} [clientId] - Filter by clientId
     * @param {number} [first] - First result index
     * @param {number} [max] - Maximum number of results
     * @returns {Promise<ClientRepresentation[]>} List of clients
     * @throws {Error} If the request fails
     */
    findAll(clientId?: string, first?: number, max?: number): Promise<ClientRepresentation[]>;
    /**
     * Create a new client
     *
     * Endpoint: POST /{realm}/clients
     *
     * @param {ClientRepresentation} client - The client to create
     * @returns {Promise<string>} The ID of the created client
     * @throws {Error} If the request fails or client data is invalid
     */
    create(client: ClientRepresentation): Promise<string>;
    /**
     * Get a client by ID
     *
     * Endpoint: GET /{realm}/clients/{id}
     *
     * @param {string} id - The client ID
     * @returns {Promise<ClientRepresentation>} The client representation
     * @throws {Error} If the request fails or ID is invalid
     */
    findById(id: string): Promise<ClientRepresentation>;
    /**
     * Update a client
     *
     * Endpoint: PUT /{realm}/clients/{id}
     *
     * @param {string} id - The client ID
     * @param {ClientRepresentation} client - The updated client data
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    update(id: string, client: ClientRepresentation): Promise<void>;
    /**
     * Delete a client
     *
     * Endpoint: DELETE /{realm}/clients/{id}
     *
     * @param {string} id - The client ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or ID is invalid
     */
    delete(id: string): Promise<void>;
    /**
     * Get client secret
     *
     * Endpoint: GET /{realm}/clients/{id}/client-secret
     *
     * @param {string} id - The client ID
     * @returns {Promise<CredentialRepresentation>} The client secret
     * @throws {Error} If the request fails or ID is invalid
     */
    getClientSecret(id: string): Promise<CredentialRepresentation>;
    /**
     * Generate a new client secret
     *
     * Endpoint: POST /{realm}/clients/{id}/client-secret
     *
     * @param {string} id - The client ID
     * @returns {Promise<CredentialRepresentation>} The new client secret
     * @throws {Error} If the request fails or ID is invalid
     */
    generateClientSecret(id: string): Promise<CredentialRepresentation>;
    /**
     * Get default client scopes
     *
     * Endpoint: GET /{realm}/clients/{id}/default-client-scopes
     *
     * @param {string} id - The client ID
     * @returns {Promise<ClientScopeRepresentation[]>} List of default client scopes
     * @throws {Error} If the request fails or ID is invalid
     */
    getDefaultClientScopes(id: string): Promise<ClientScopeRepresentation[]>;
    /**
     * Add default client scope
     *
     * Endpoint: PUT /{realm}/clients/{id}/default-client-scopes/{scopeId}
     *
     * @param {string} id - The client ID
     * @param {string} scopeId - The scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    addDefaultClientScope(id: string, scopeId: string): Promise<void>;
    /**
     * Remove default client scope
     *
     * Endpoint: DELETE /{realm}/clients/{id}/default-client-scopes/{scopeId}
     *
     * @param {string} id - The client ID
     * @param {string} scopeId - The scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    removeDefaultClientScope(id: string, scopeId: string): Promise<void>;
    /**
     * Get optional client scopes
     *
     * Endpoint: GET /{realm}/clients/{id}/optional-client-scopes
     *
     * @param {string} id - The client ID
     * @returns {Promise<ClientScopeRepresentation[]>} List of optional client scopes
     * @throws {Error} If the request fails or ID is invalid
     */
    getOptionalClientScopes(id: string): Promise<ClientScopeRepresentation[]>;
    /**
     * Add optional client scope
     *
     * Endpoint: PUT /{realm}/clients/{id}/optional-client-scopes/{scopeId}
     *
     * @param {string} id - The client ID
     * @param {string} scopeId - The scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    addOptionalClientScope(id: string, scopeId: string): Promise<void>;
    /**
     * Remove optional client scope
     *
     * Endpoint: DELETE /{realm}/clients/{id}/optional-client-scopes/{scopeId}
     *
     * @param {string} id - The client ID
     * @param {string} scopeId - The scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    removeOptionalClientScope(id: string, scopeId: string): Promise<void>;
    /**
     * Get user sessions for client
     *
     * Endpoint: GET /{realm}/clients/{id}/user-sessions
     *
     * @param {string} id - The client ID
     * @param {number} [first] - First result index
     * @param {number} [max] - Maximum number of results
     * @returns {Promise<UserSessionRepresentation[]>} List of user sessions
     * @throws {Error} If the request fails or ID is invalid
     */
    getUserSessions(id: string, first?: number, max?: number): Promise<UserSessionRepresentation[]>;
    /**
     * Test OIDC client registration endpoint
     *
     * Endpoint: POST /{realm}/clients/registration-access-token
     *
     * @param {string} clientId - The client ID
     * @returns {Promise<Record<string, any>>} The registration access token
     * @throws {Error} If the request fails or clientId is invalid
     */
    getRegistrationAccessToken(clientId: string): Promise<Record<string, any>>;
    /**
     * Get all roles for a client
     *
     * Endpoint: GET /{realm}/clients/{id}/roles
     *
     * @param {string} clientId - Client ID
     * @returns {Promise<RoleRepresentation[]>} List of client roles
     * @throws {Error} If the request fails
     */
    listRoles(clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get a role by name for a client
     *
     * Endpoint: GET /{realm}/clients/{id}/roles/{role-name}
     *
     * @param {string} clientId - Client ID
     * @param {string} roleName - Role name
     * @returns {Promise<RoleRepresentation>} Role representation
     * @throws {Error} If the request fails
     */
    getRole(clientId: string, roleName: string): Promise<RoleRepresentation$1>;
    /**
     * Create a new role for a client
     *
     * Endpoint: POST /{realm}/clients/{id}/roles
     *
     * @param {string} clientId - Client ID
     * @param {RoleRepresentation} role - Role representation
     * @returns {Promise<string>} ID of the created role
     * @throws {Error} If the request fails
     */
    createRole(clientId: string, role: RoleRepresentation$1): Promise<string>;
    /**
     * Update a role for a client
     *
     * Endpoint: PUT /{realm}/clients/{id}/roles/{role-name}
     *
     * @param {string} clientId - Client ID
     * @param {string} roleName - Role name
     * @param {RoleRepresentation} role - Updated role representation
     * @returns {Promise<void>}
     * @throws {Error} If the request fails
     */
    updateRole(clientId: string, roleName: string, role: RoleRepresentation$1): Promise<void>;
    /**
     * Delete a role from a client
     *
     * Endpoint: DELETE /{realm}/clients/{id}/roles/{role-name}
     *
     * @param {string} clientId - Client ID
     * @param {string} roleName - Role name
     * @returns {Promise<void>}
     * @throws {Error} If the request fails
     */
    deleteRole(clientId: string, roleName: string): Promise<void>;
}

/**
 * Identity Provider Types for Keycloak Admin SDK
 *
 * This module provides TypeScript interfaces for Keycloak Identity Providers.
 * Following SOLID principles and clean code practices.
 */
/**
 * Representation of a Keycloak Identity Provider
 */
interface IdentityProviderRepresentation {
    /**
     * Unique identifier of the identity provider
     */
    id?: string;
    /**
     * Alias used to identify the provider
     */
    alias?: string;
    /**
     * Display name of the provider
     */
    displayName?: string;
    /**
     * Whether the provider is enabled
     */
    enabled?: boolean;
    /**
     * Provider type (e.g., 'oidc', 'saml', etc.)
     */
    providerId?: string;
    /**
     * Whether this provider is the default
     */
    firstBrokerLoginFlowAlias?: string;
    /**
     * Authentication flow to use after first broker login
     */
    postBrokerLoginFlowAlias?: string;
    /**
     * Whether to store tokens locally
     */
    storeToken?: boolean;
    /**
     * Whether to add read token role on login
     */
    addReadTokenRoleOnCreate?: boolean;
    /**
     * Whether to trust email from this provider
     */
    trustEmail?: boolean;
    /**
     * Whether to link users automatically
     */
    linkOnly?: boolean;
    /**
     * Provider-specific configuration
     */
    config?: Record<string, string>;
}

/**
 * Organizations API for Keycloak Admin SDK
 *
 * This module provides methods to manage organizations in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_organizations
 */

/**
 * Organizations API
 *
 * Provides methods to manage organizations in Keycloak
 */
declare class OrganizationsApi {
    private sdk;
    /**
     * Constructor for OrganizationsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all organizations with optional filtering
     *
     * Endpoint: GET /{realm}/organizations
     *
     * @param query - Query parameters for filtering organizations
     * @returns Promise resolving to an array of organization representations
     */
    list(query?: OrganizationQuery): Promise<OrganizationRepresentation[]>;
    /**
     * Create a new organization
     *
     * Endpoint: POST /{realm}/organizations
     *
     * @param organization - Organization representation to create
     * @returns Promise resolving to the ID of the created organization
     */
    create(organization: OrganizationRepresentation): Promise<string>;
    /**
     * Get an organization by ID
     *
     * Endpoint: GET /{realm}/organizations/{id}
     *
     * @param id - Organization ID
     * @returns Promise resolving to the organization representation
     */
    get(id: string): Promise<OrganizationRepresentation>;
    /**
     * Update an organization
     *
     * Endpoint: PUT /{realm}/organizations/{id}
     *
     * @param id - Organization ID
     * @param organization - Updated organization representation
     * @returns Promise resolving when the update is complete
     */
    update(id: string, organization: OrganizationRepresentation): Promise<void>;
    /**
     * Delete an organization
     *
     * Endpoint: DELETE /{realm}/organizations/{id}
     *
     * @param id - Organization ID
     * @returns Promise resolving when the deletion is complete
     */
    delete(id: string): Promise<void>;
    /**
     * Get organization members
     *
     * Endpoint: GET /{realm}/organizations/{id}/members
     *
     * @param id - Organization ID
     * @param first - First result index (optional)
     * @param max - Maximum number of results (optional)
     * @returns Promise resolving to an array of organization member representations
     */
    getMembers(id: string, first?: number, max?: number): Promise<OrganizationMemberRepresentation[]>;
    /**
     * Add a member to an organization
     *
     * Endpoint: POST /{realm}/organizations/{id}/members/{userId}
     *
     * @param id - Organization ID
     * @param userId - User ID to add as member
     * @returns Promise resolving when the member is added
     */
    addMember(id: string, userId: string): Promise<void>;
    /**
     * Remove a member from an organization
     *
     * Endpoint: DELETE /{realm}/organizations/{id}/members/{userId}
     *
     * @param id - Organization ID
     * @param userId - User ID to remove
     * @returns Promise resolving when the member is removed
     */
    removeMember(id: string, userId: string): Promise<void>;
    /**
     * Invite an existing user to the organization
     *
     * Endpoint: POST /{realm}/organizations/{id}/members/invite-existing-user
     *
     * @param id - Organization ID
     * @param userId - User ID to invite
     * @returns Promise resolving when the invitation is sent
     */
    inviteExistingUser(id: string, userId: string): Promise<void>;
    /**
     * Invite a user to the organization by email
     *
     * Endpoint: POST /{realm}/organizations/{id}/members/invite-user
     *
     * If the user with the given e-mail address exists, it sends an invitation link,
     * otherwise it sends a registration link.
     *
     * @param id - Organization ID
     * @param email - Email address of the user to invite
     * @param firstName - Optional first name for new users
     * @param lastName - Optional last name for new users
     * @returns Promise resolving when the invitation is sent
     */
    inviteUser(id: string, email: string, firstName?: string, lastName?: string): Promise<void>;
    /**
     * Get all identity providers associated with an organization
     *
     * Endpoint: GET /{realm}/organizations/{id}/identity-providers
     *
     * @param id - Organization ID
     * @returns Promise resolving to an array of identity provider representations
     */
    getIdentityProviders(id: string): Promise<IdentityProviderRepresentation[]>;
    /**
     * Get a specific identity provider associated with an organization
     *
     * Endpoint: GET /{realm}/organizations/{id}/identity-providers/{alias}
     *
     * @param id - Organization ID
     * @param alias - Identity provider alias
     * @returns Promise resolving to the identity provider representation
     */
    getIdentityProvider(id: string, alias: string): Promise<IdentityProviderRepresentation>;
    /**
     * Add an identity provider to an organization
     *
     * Endpoint: POST /{realm}/organizations/{id}/identity-providers
     *
     * @param id - Organization ID
     * @param providerAlias - Identity provider alias
     * @returns Promise resolving when the identity provider is added
     */
    addIdentityProvider(id: string, providerAlias: string): Promise<void>;
    /**
     * Remove an identity provider from an organization
     *
     * Endpoint: DELETE /{realm}/organizations/{id}/identity-providers/{alias}
     *
     * @param id - Organization ID
     * @param alias - Identity provider alias
     * @returns Promise resolving when the identity provider is removed
     */
    removeIdentityProvider(id: string, alias: string): Promise<void>;
    /**
     * Get the count of members in an organization
     *
     * Endpoint: GET /{realm}/organizations/{id}/members/count
     *
     * @param id - Organization ID
     * @returns Promise resolving to the number of members in the organization
     */
    getMembersCount(id: string): Promise<number>;
}

/**
 * Type definitions for Identity Provider Mappers in Keycloak Admin SDK
 *
 * These types represent the structure of identity provider mappers in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_identity_provider_mapper_representation
 */
/**
 * Configuration property for an identity provider mapper type
 */
interface IdentityProviderMapperConfigProperty {
    /**
     * Name of the configuration property
     */
    name: string;
    /**
     * Label for the configuration property
     */
    label: string;
    /**
     * Help text for the configuration property
     */
    helpText?: string;
    /**
     * Type of the configuration property (e.g., 'String', 'boolean')
     */
    type: string;
    /**
     * Default value for the configuration property
     */
    defaultValue?: string;
    /**
     * Whether the configuration property is required
     */
    required?: boolean;
    /**
     * Whether the configuration property is a secret (e.g., password)
     */
    secret?: boolean;
    /**
     * Whether the configuration property is read-only
     */
    readOnly?: boolean;
    /**
     * Options for the configuration property (for enum-like properties)
     */
    options?: string[];
}
/**
 * Representation of an identity provider mapper type
 */
interface IdentityProviderMapperTypeRepresentation {
    /**
     * ID of the mapper type
     */
    id: string;
    /**
     * Name of the mapper type
     */
    name: string;
    /**
     * Category of the mapper type
     */
    category?: string;
    /**
     * Help text for the mapper type
     */
    helpText?: string;
    /**
     * Configuration properties for the mapper type
     */
    properties?: IdentityProviderMapperConfigProperty[];
}
/**
 * Representation of an identity provider mapper
 */
interface IdentityProviderMapperRepresentation {
    /**
     * ID of the mapper
     */
    id?: string;
    /**
     * Name of the mapper
     */
    name: string;
    /**
     * ID of the identity provider
     */
    identityProviderAlias: string;
    /**
     * ID of the mapper type
     */
    identityProviderMapper: string;
    /**
     * Configuration for the mapper
     */
    config?: Record<string, string>;
}

/**
 * Identity Providers API for Keycloak Admin SDK
 *
 * This module provides methods to manage identity providers in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_identity_providers
 */

/**
 * Identity Providers API
 *
 * Provides methods to manage identity providers in Keycloak
 */
declare class IdentityProvidersApi {
    private sdk;
    /**
     * Constructor for IdentityProvidersApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all identity providers
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances
     *
     * @returns Promise resolving to an array of identity provider representations
     * @param options
     */
    findAll(options?: {
        briefRepresentation?: boolean;
        first?: number;
        max?: number;
        search?: string;
        realmOnly?: boolean;
    }): Promise<IdentityProviderRepresentation[]>;
    /**
     * Create a new identity provider
     *
     * Endpoint: POST /admin/realms/{realm}/identity-provider/instances
     *
     * @param provider - Identity provider representation to create
     * @returns Promise resolving to the alias of the created identity provider
     */
    create(provider: IdentityProviderRepresentation): Promise<string>;
    /**
     * Get an identity provider by alias
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving to the identity provider representation
     */
    get(alias: string): Promise<IdentityProviderRepresentation>;
    /**
     * Update an identity provider
     *
     * Endpoint: PUT /admin/realms/{realm}/identity-provider/instances/{alias}
     *
     * @param alias - Identity provider alias
     * @param provider - Updated identity provider representation
     * @returns Promise resolving when the update is complete
     */
    update(alias: string, provider: IdentityProviderRepresentation): Promise<void>;
    /**
     * Delete an identity provider
     *
     * Endpoint: DELETE /admin/realms/{realm}/identity-provider/instances/{alias}
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving when the deletion is complete
     */
    delete(alias: string): Promise<void>;
    /**
     * Get the factory for a specific identity provider type
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/providers/{provider_id}
     *
     * @param providerId - Identity provider type ID (e.g., 'oidc', 'saml')
     * @returns Promise resolving to the identity provider factory
     */
    getProviderFactory(providerId: string): Promise<Record<string, any>>;
    /**
     * Get a specific provider type
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/providers/{provider_id}
     *
     * @param providerId - The ID of the provider type to get
     * @returns Promise resolving to the provider type configuration
     */
    getProviderType(providerId: string): Promise<Record<string, any>>;
    /**
     * Import an identity provider from a JSON file
     *
     * Endpoint: POST /admin/realms/{realm}/identity-provider/import-config
     *
     * @param providerJson - JSON string containing the provider configuration
     * @returns Promise resolving to the imported identity provider representation
     */
    importFromJson(providerJson: string): Promise<IdentityProviderRepresentation>;
    /**
     * Get all mappers for an identity provider
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mappers
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving to an array of identity provider mapper representations
     */
    getMappers(alias: string): Promise<IdentityProviderMapperRepresentation[]>;
    /**
     * Create a new mapper for an identity provider
     *
     * Endpoint: POST /admin/realms/{realm}/identity-provider/instances/{alias}/mappers
     *
     * @param alias - Identity provider alias
     * @param mapper - Identity provider mapper representation to create
     * @returns Promise resolving to the ID of the created mapper
     */
    createMapper(alias: string, mapper: IdentityProviderMapperRepresentation): Promise<string>;
    /**
     * Get a specific mapper for an identity provider
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
     *
     * @param alias - Identity provider alias
     * @param id - Mapper ID
     * @returns Promise resolving to the identity provider mapper representation
     */
    getMapper(alias: string, id: string): Promise<IdentityProviderMapperRepresentation>;
    /**
     * Update a mapper for an identity provider
     *
     * Endpoint: PUT /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
     *
     * @param alias - Identity provider alias
     * @param id - Mapper ID
     * @param mapper - Updated identity provider mapper representation
     * @returns Promise resolving when the update is complete
     */
    updateMapper(alias: string, id: string, mapper: IdentityProviderMapperRepresentation): Promise<void>;
    /**
     * Delete a mapper for an identity provider
     *
     * Endpoint: DELETE /admin/realms/{realm}/identity-provider/instances/{alias}/mappers/{id}
     *
     * @param alias - Identity provider alias
     * @param id - Mapper ID
     * @returns Promise resolving when the deletion is complete
     */
    deleteMapper(alias: string, id: string): Promise<void>;
    /**
     * Get available mapper types for an identity provider
     *
     * Endpoint: GET /admin/realms/{realm}/identity-provider/instances/{alias}/mapper-types
     *
     * @param alias - Identity provider alias
     * @returns Promise resolving to a map of identity provider mapper type representations
     */
    getMapperTypes(alias: string): Promise<Record<string, IdentityProviderMapperTypeRepresentation>>;
}

/**
 * Roles by ID API for Keycloak Admin SDK
 *
 * This module provides methods to manage roles directly by their ID in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Interface for querying role composites
 */
interface GetRoleCompositesQuery {
    first?: number;
    max?: number;
    search?: string;
}
/**
 * Roles by ID API class
 *
 * Provides methods to manage roles directly by their ID in Keycloak
 */
declare class RolesByIdApi {
    private sdk;
    /**
     * Constructor for RolesByIdApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get a specific role by ID
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}
     *
     * @param roleId - ID of the role
     * @returns Promise resolving to the role representation
     */
    get(roleId: string): Promise<RoleRepresentation$1>;
    /**
     * Update a role by ID
     *
     * Endpoint: PUT /{realm}/roles-by-id/{role-id}
     *
     * @param roleId - ID of the role
     * @param role - Updated role representation
     * @returns Promise resolving when the operation completes
     */
    update(roleId: string, role: RoleRepresentation$1): Promise<void>;
    /**
     * Delete a role by ID
     *
     * Endpoint: DELETE /{realm}/roles-by-id/{role-id}
     *
     * @param roleId - ID of the role
     * @returns Promise resolving when the operation completes
     */
    delete(roleId: string): Promise<void>;
    /**
     * Get role composites
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites
     *
     * @param roleId - ID of the role
     * @param query - Optional query parameters
     * @returns Promise resolving to an array of role representations
     */
    getComposites(roleId: string, query?: GetRoleCompositesQuery): Promise<RoleRepresentation$1[]>;
    /**
     * Add composites to a role
     *
     * Endpoint: POST /{realm}/roles-by-id/{role-id}/composites
     *
     * @param roleId - ID of the role
     * @param roles - Array of roles to add as composites
     * @returns Promise resolving when the operation completes
     */
    addComposites(roleId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Remove composites from a role
     *
     * Endpoint: DELETE /{realm}/roles-by-id/{role-id}/composites
     *
     * @param roleId - ID of the role
     * @param roles - Array of roles to remove from composites
     * @returns Promise resolving when the operation completes
     */
    removeComposites(roleId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get realm-level role composites
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites/realm
     *
     * @param roleId - ID of the role
     * @returns Promise resolving to an array of role representations
     */
    getRealmRoleComposites(roleId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get client-level role composites for a specific client
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/composites/clients/{clientId}
     *
     * @param roleId - ID of the role
     * @param clientId - ID of the client
     * @returns Promise resolving to an array of role representations
     */
    getClientRoleComposites(roleId: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get role permissions
     *
     * Endpoint: GET /{realm}/roles-by-id/{role-id}/management/permissions
     *
     * @param roleId - ID of the role
     * @returns Promise resolving to the management permission reference
     */
    getPermissions(roleId: string): Promise<ManagementPermissionReference$1>;
    /**
     * Update role permissions
     *
     * Endpoint: PUT /{realm}/roles-by-id/{role-id}/management/permissions
     *
     * @param roleId - ID of the role
     * @param permissions - Management permission reference
     * @returns Promise resolving to the updated management permission reference
     */
    updatePermissions(roleId: string, permissions: ManagementPermissionReference$1): Promise<ManagementPermissionReference$1>;
}

/**
 * Roles API for Keycloak Admin SDK
 *
 * This module provides methods to manage realm and client roles in Keycloak.
 * It follows SOLID principles and clean code practices.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html#_roles
 */

/**
 * Roles API
 *
 * Provides methods to manage realm and client roles in Keycloak
 */
declare class RolesApi {
    private sdk;
    /**
     * Roles by ID API for direct ID-based operations
     */
    byId: RolesByIdApi;
    /**
     * Constructor for RolesApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all realm roles
     *
     * Endpoint: GET /{realm}/roles
     *
     * @param query - Query parameters for filtering roles
     * @returns Promise resolving to an array of role representations
     */
    list(query?: RoleQuery): Promise<RoleRepresentation$1[]>;
    /**
     * Create a new realm role
     *
     * Endpoint: POST /{realm}/roles
     *
     * @param role - Role representation to create
     * @returns Promise resolving to the ID of the created role
     */
    create(role: RoleRepresentation$1): Promise<string>;
    /**
     * Get a realm role by name
     *
     * Endpoint: GET /{realm}/roles/{role-name}
     *
     * @param name - Role name
     * @returns Promise resolving to the role representation
     */
    getByName(name: string): Promise<RoleRepresentation$1>;
    /**
     * Update a realm role
     *
     * Endpoint: PUT /{realm}/roles/{role-name}
     *
     * @param name - Role name
     * @param role - Updated role representation
     * @returns Promise resolving when the update is complete
     */
    update(name: string, role: RoleRepresentation$1): Promise<void>;
    /**
     * Delete a realm role
     *
     * Endpoint: DELETE /{realm}/roles/{role-name}
     *
     * @param name - Role name
     * @returns Promise resolving when the deletion is complete
     */
    delete(name: string): Promise<void>;
    /**
     * Get role composites
     *
     * Endpoint: GET /{realm}/roles/{role-name}/composites
     *
     * @param name - Role name
     * @returns Promise resolving to an array of composite roles
     */
    getComposites(name: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add composites to a role
     *
     * Endpoint: POST /{realm}/roles/{role-name}/composites
     *
     * @param name - Role name
     * @param roles - Array of roles to add as composites
     * @returns Promise resolving when the composites are added
     */
    addComposites(name: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Remove composites from a role
     *
     * Endpoint: DELETE /{realm}/roles/{role-name}/composites
     *
     * @param name - Role name
     * @param roles - Array of roles to remove from composites
     * @returns Promise resolving when the composites are removed
     */
    removeComposites(name: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get realm role composites
     *
     * Endpoint: GET /{realm}/roles/{role-name}/composites/realm
     *
     * @param name - Role name
     * @returns Promise resolving to an array of realm role composites
     */
    getRealmRoleComposites(name: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get client role composites for a specific client
     *
     * Endpoint: GET /{realm}/roles/{role-name}/composites/clients/{client-ID}
     *
     * @param name - Role name
     * @param clientId - Client ID
     * @returns Promise resolving to an array of client role composites
     */
    getClientRoleComposites(name: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get users with a specific role
     *
     * Endpoint: GET /{realm}/roles/{role-name}/users
     *
     * @param name - Role name
     * @param query - Query parameters for pagination and representation
     * @returns Promise resolving to an array of users with the role
     */
    getUsersWithRole(name: string, query?: {
        first?: number;
        max?: number;
        briefRepresentation?: boolean;
    }): Promise<UserRepresentation[]>;
    /**
     * Get groups with a specific role
     *
     * Endpoint: GET /{realm}/roles/{role-name}/groups
     *
     * @param name - Role name
     * @param query - Query parameters for pagination and representation
     * @returns Promise resolving to an array of groups with the role
     */
    getGroupsWithRole(name: string, query?: {
        first?: number;
        max?: number;
        briefRepresentation?: boolean;
    }): Promise<GroupRepresentation[]>;
    /**
     * Get role permissions
     *
     * Endpoint: GET /{realm}/roles/{role-name}/management/permissions
     *
     * @param name - Role name
     * @returns Promise resolving to the management permission reference
     */
    getPermissions(name: string): Promise<ManagementPermissionReference$1>;
    /**
     * Update role permissions
     *
     * Endpoint: PUT /{realm}/roles/{role-name}/management/permissions
     *
     * @param name - Role name
     * @param permissions - Management permission reference
     * @returns Promise resolving to the updated management permission reference
     */
    updatePermissions(name: string, permissions: ManagementPermissionReference$1): Promise<ManagementPermissionReference$1>;
}

/**
 * Role Mappings types for Keycloak Admin SDK
 *
 * These types represent the role mappings objects in Keycloak.
 * Based on: https://www.keycloak.org/docs-api/latest/rest-api/index.html
 */

/**
 * Representation of client role mappings
 */
interface ClientMappingsRepresentation {
    /**
     * Client ID
     */
    id?: string;
    /**
     * Client name
     */
    client?: string;
    /**
     * Array of mapped roles
     */
    mappings?: RoleRepresentation$1[];
}
/**
 * Representation of all role mappings
 */
interface MappingsRepresentation {
    /**
     * Realm role mappings
     */
    realmMappings?: RoleRepresentation$1[];
    /**
     * Client role mappings
     */
    clientMappings?: Record<string, ClientMappingsRepresentation>;
}
/**
 * Query parameters for effective role mappings
 */
interface EffectiveRoleMappingsQuery {
    /**
     * If false, return roles with their attributes
     * @default true
     */
    briefRepresentation?: boolean;
}

/**
 * Role Mappings API for Keycloak Admin SDK
 *
 * This module provides a base class for managing role mappings in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Base Role Mappings API
 *
 * Provides common methods for managing role mappings that can be used by both users and groups
 */
declare abstract class BaseRoleMappingsApi {
    protected sdk: KeycloakAdminSDK;
    protected abstract resourcePath: string;
    /**
     * Constructor for BaseRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all role mappings for the resource
     *
     * @returns Promise resolving to the mappings representation
     */
    getAll(): Promise<MappingsRepresentation>;
    /**
     * Get realm-level role mappings
     *
     * @returns Promise resolving to an array of role representations
     */
    getRealmRoleMappings(): Promise<RoleRepresentation$1[]>;
    /**
     * Add realm-level role mappings
     *
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addRealmRoleMappings(roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete realm-level role mappings
     *
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    deleteRealmRoleMappings(roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available realm-level role mappings
     *
     * @returns Promise resolving to an array of role representations
     */
    getAvailableRealmRoleMappings(): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective realm-level role mappings
     *
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of role representations
     */
    getEffectiveRealmRoleMappings(briefRepresentation?: boolean): Promise<RoleRepresentation$1[]>;
    /**
     * Get client-level role mappings
     *
     * @param clientId - Client ID
     * @returns Promise resolving to an array of role representations
     */
    getClientRoleMappings(clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add client-level role mappings
     *
     * @param clientId - Client ID
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addClientRoleMappings(clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete client-level role mappings
     *
     * @param clientId - Client ID
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    deleteClientRoleMappings(clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available client-level role mappings
     *
     * @param clientId - Client ID
     * @returns Promise resolving to an array of role representations
     */
    getAvailableClientRoleMappings(clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective client-level role mappings
     *
     * @param clientId - Client ID
     * @param briefRepresentation - If false, return roles with their attributes
     * @returns Promise resolving to an array of role representations
     */
    getEffectiveClientRoleMappings(clientId: string, briefRepresentation?: boolean): Promise<RoleRepresentation$1[]>;
}

/**
 * User Role Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for users in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * User Role Mappings API
 *
 * Provides methods to manage role mappings for users in Keycloak
 */
declare class UserRoleMappingsApi extends BaseRoleMappingsApi {
    protected resourcePath: string;
    /**
     * Constructor for UserRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param userId - ID of the user
     */
    constructor(sdk: KeycloakAdminSDK, userId: string);
}

/**
 * Group Role Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage role mappings for groups in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Group Role Mappings API
 *
 * Provides methods to manage role mappings for groups in Keycloak
 */
declare class GroupRoleMappingsApi extends BaseRoleMappingsApi {
    protected resourcePath: string;
    /**
     * Constructor for GroupRoleMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param groupId - ID of the group
     */
    constructor(sdk: KeycloakAdminSDK, groupId: string);
}

/**
 * Client Role Mappings API for Keycloak Admin SDK
 * Provides methods for managing client-level role mappings for users and groups
 */

/**
 * Base class for client role mappings operations
 */
declare abstract class BaseClientRoleMappingsApi {
    protected sdk: KeycloakAdminSDK;
    protected abstract getBasePath(id: string): string;
    /**
     * Creates a new instance of the Base Client Role Mappings API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get client-level role mappings for the user or group, and the app
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @returns {Promise<RoleRepresentation[]>} List of role mappings
     * @throws {Error} If the request fails or parameters are invalid
     */
    getClientRoleMappings(id: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add client-level roles to the user or group role mapping
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @param {RoleRepresentation[]} roles - The roles to add
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    addClientRoleMappings(id: string, clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete client-level roles from user or group role mapping
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @param {RoleRepresentation[]} roles - The roles to delete
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or parameters are invalid
     */
    deleteClientRoleMappings(id: string, clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available client-level roles that can be mapped to the user or group
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @returns {Promise<RoleRepresentation[]>} List of available roles
     * @throws {Error} If the request fails or parameters are invalid
     */
    getAvailableClientRoleMappings(id: string, clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective client-level role mappings
     * This recurses any composite roles
     *
     * @param {string} id - The user or group ID
     * @param {string} clientId - The client ID (not client-id)
     * @param {boolean} [briefRepresentation=true] - If false, return roles with their attributes
     * @returns {Promise<RoleRepresentation[]>} List of effective role mappings
     * @throws {Error} If the request fails or parameters are invalid
     */
    getEffectiveClientRoleMappings(id: string, clientId: string, briefRepresentation?: boolean): Promise<RoleRepresentation$1[]>;
}
/**
 * API for managing client role mappings for users
 */
declare class UserClientRoleMappingsApi extends BaseClientRoleMappingsApi {
    /**
     * Get the base path for user role mappings
     *
     * @param {string} userId - The user ID
     * @returns {string} The base path
     */
    protected getBasePath(userId: string): string;
}
/**
 * API for managing client role mappings for groups
 */
declare class GroupClientRoleMappingsApi extends BaseClientRoleMappingsApi {
    /**
     * Get the base path for group role mappings
     *
     * @param {string} groupId - The group ID
     * @returns {string} The base path
     */
    protected getBasePath(groupId: string): string;
}

/**
 * Role Mappings API for Keycloak Admin SDK
 *
 * This module exports the role mappings API classes and factory functions.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Role Mappings API Factory
 *
 * Factory class for creating role mappings API instances for different resource types
 */
declare class RoleMappingsApiFactory {
    private sdk;
    /**
     * Constructor for RoleMappingsApiFactory
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Create a role mappings API for a user
     *
     * @param userId - ID of the user
     * @returns UserRoleMappingsApi instance
     */
    forUser(userId: string): UserRoleMappingsApi;
    /**
     * Create a role mappings API for a group
     *
     * @param groupId - ID of the group
     * @returns GroupRoleMappingsApi instance
     */
    forGroup(groupId: string): GroupRoleMappingsApi;
    /**
     * Create a client role mappings API for a user
     *
     * @returns UserClientRoleMappingsApi instance
     */
    forClientRoleMappingsUser(): UserClientRoleMappingsApi;
    /**
     * Create a client role mappings API for a group
     *
     * @returns GroupClientRoleMappingsApi instance
     */
    forClientRoleMappingsGroup(): GroupClientRoleMappingsApi;
}

/**
 * Attack Detection API for Keycloak Admin SDK
 * Provides methods for managing brute force detection for users
 */

/**
 * Represents the status of a user in brute force detection
 */
interface BruteForceStatus {
    /**
     * Number of failed login attempts
     */
    numFailures: number;
    /**
     * Last failed login time in milliseconds since epoch
     */
    lastFailure: number;
    /**
     * Last IP address that failed login
     */
    lastIPFailure: string;
    /**
     * Whether the user is currently disabled due to brute force protection
     */
    disabled: boolean;
}
/**
 * API for managing attack detection in Keycloak
 */
declare class AttackDetectionApi {
    private sdk;
    /**
     * Creates a new instance of the Attack Detection API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Clear any user login failures for all users
     * This can release temporary disabled users
     *
     * Endpoint: DELETE /admin/realms/{realm}/attack-detection/brute-force/users
     *
     * @returns {Promise<void>} A promise that resolves when the operation is complete
     * @throws {Error} If the request fails
     */
    clearAllBruteForce(): Promise<void>;
    /**
     * Clear any user login failures for a specific user
     * This can release a temporary disabled user
     *
     * Endpoint: DELETE /admin/realms/{realm}/attack-detection/brute-force/users/{userId}
     *
     * @param {string} userId - ID of the user to clear brute force attempts for
     * @returns {Promise<void>} A promise that resolves when the operation is complete
     * @throws {Error} If the request fails or userId is invalid
     */
    clearBruteForceForUser(userId: string): Promise<void>;
    /**
     * Get status of a user in brute force detection
     *
     * Endpoint: GET /admin/realms/{realm}/attack-detection/brute-force/users/{userId}
     *
     * @param {string} userId - ID of the user to get status for
     * @returns {Promise<BruteForceStatus>} The brute force status for the user
     * @throws {Error} If the request fails or userId is invalid
     */
    getBruteForceStatusForUser(userId: string): Promise<BruteForceStatus>;
}

/**
 * Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides a base class for managing scope mappings in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Base Scope Mappings API
 *
 * Provides common methods for managing scope mappings that can be used by both clients and client scopes
 */
declare abstract class BaseScopeMappingsApi {
    protected sdk: KeycloakAdminSDK;
    protected abstract resourcePath: string;
    /**
     * Constructor for BaseScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all scope mappings for the resource
     *
     * @returns Promise resolving to the mappings representation
     */
    getAll(): Promise<MappingsRepresentation>;
    /**
     * Get realm-level roles associated with the resource's scope
     *
     * @returns Promise resolving to an array of role representations
     */
    getRealmScopeMappings(): Promise<RoleRepresentation$1[]>;
    /**
     * Add realm-level roles to the resource's scope
     *
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addRealmScopeMappings(roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete realm-level roles from the resource's scope
     *
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    deleteRealmScopeMappings(roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available realm-level roles that can be mapped to the resource's scope
     *
     * @returns Promise resolving to an array of role representations
     */
    getAvailableRealmScopeMappings(): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective realm-level roles associated with the resource's scope
     *
     * @param query - Optional query parameters
     * @returns Promise resolving to an array of role representations
     */
    getEffectiveRealmScopeMappings(query?: EffectiveRoleMappingsQuery): Promise<RoleRepresentation$1[]>;
    /**
     * Get client-level roles associated with the resource's scope
     *
     * @param clientId - ID of the client
     * @returns Promise resolving to an array of role representations
     */
    getClientScopeMappings(clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Add client-level roles to the resource's scope
     *
     * @param clientId - ID of the client
     * @param roles - Array of roles to add
     * @returns Promise resolving when the operation completes
     */
    addClientScopeMappings(clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Delete client-level roles from the resource's scope
     *
     * @param clientId - ID of the client
     * @param roles - Array of roles to remove
     * @returns Promise resolving when the operation completes
     */
    deleteClientScopeMappings(clientId: string, roles: RoleRepresentation$1[]): Promise<void>;
    /**
     * Get available client-level roles that can be mapped to the resource's scope
     *
     * @param clientId - ID of the client
     * @returns Promise resolving to an array of role representations
     */
    getAvailableClientScopeMappings(clientId: string): Promise<RoleRepresentation$1[]>;
    /**
     * Get effective client-level roles associated with the resource's scope
     *
     * @param clientId - ID of the client
     * @param query - Optional query parameters
     * @returns Promise resolving to an array of role representations
     */
    getEffectiveClientScopeMappings(clientId: string, query?: EffectiveRoleMappingsQuery): Promise<RoleRepresentation$1[]>;
}

/**
 * Client Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for client scopes in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Client Scope Mappings API
 *
 * Provides methods to manage scope mappings for client scopes in Keycloak
 */
declare class ClientScopeMappingsApi extends BaseScopeMappingsApi {
    protected resourcePath: string;
    /**
     * Constructor for ClientScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param clientScopeId - ID of the client scope
     */
    constructor(sdk: KeycloakAdminSDK, clientScopeId: string);
}

/**
 * Client Template Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for client templates in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Client Template Scope Mappings API
 *
 * Provides methods to manage scope mappings for client templates in Keycloak
 */
declare class ClientTemplateScopeMappingsApi extends BaseScopeMappingsApi {
    protected resourcePath: string;
    /**
     * Constructor for ClientTemplateScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param clientTemplateId - ID of the client template
     */
    constructor(sdk: KeycloakAdminSDK, clientTemplateId: string);
}

/**
 * Client ID Scope Mappings API for Keycloak Admin SDK
 *
 * This module provides methods to manage scope mappings for clients in Keycloak.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Client ID Scope Mappings API
 *
 * Provides methods to manage scope mappings for clients in Keycloak
 */
declare class clientIdScopeMappingsApi extends BaseScopeMappingsApi {
    protected resourcePath: string;
    /**
     * Constructor for clientIdScopeMappingsApi
     *
     * @param sdk - KeycloakAdminSDK instance
     * @param clientId - ID of the client
     */
    constructor(sdk: KeycloakAdminSDK, clientId: string);
}

/**
 * Scope Mappings API Factory for Keycloak Admin SDK
 *
 * This module provides a factory for creating scope mappings API instances.
 * It follows SOLID principles and clean code practices.
 */

/**
 * Scope Mappings API Factory
 *
 * Factory for creating scope mappings API instances for different resource types
 */
declare class ScopeMappingsApiFactory {
    private sdk;
    /**
     * Constructor for ScopeMappingsApiFactory
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get scope mappings API for a client scope
     *
     * @param clientScopeId - ID of the client scope
     * @returns ClientScopeMappingsApi instance
     */
    forClientScope(clientScopeId: string): ClientScopeMappingsApi;
    /**
     * Get scope mappings API for a client template
     *
     * @param clientTemplateId - ID of the client template
     * @returns ClientTemplateScopeMappingsApi instance
     */
    forClientTemplate(clientTemplateId: string): ClientTemplateScopeMappingsApi;
    /**
     * Get scope mappings API for a client
     *
     * @param clientId - ID of the client
     * @returns clientIdScopeMappingsApi instance
     */
    forClient(clientId: string): clientIdScopeMappingsApi;
}

/**
 * Types for Keycloak Key API
 */
/**
 * Represents the key usage
 */
declare enum KeyUse {
    SIG = "sig",
    ENC = "enc"
}
/**
 * Represents metadata for a single key
 */
interface KeyMetadataRepresentation {
    /**
     * Provider ID
     */
    providerId?: string;
    /**
     * Provider priority
     */
    providerPriority?: number;
    /**
     * Key ID
     */
    kid?: string;
    /**
     * Key status
     */
    status?: string;
    /**
     * Key type
     */
    type?: string;
    /**
     * Algorithm used
     */
    algorithm?: string;
    /**
     * Public key
     */
    publicKey?: string;
    /**
     * Certificate
     */
    certificate?: string;
    /**
     * Key usage
     */
    use?: KeyUse;
    /**
     * Valid until timestamp
     */
    validTo?: number;
}
/**
 * Represents metadata for all keys in a realm
 */
interface KeysMetadataRepresentation {
    /**
     * Map of active keys by algorithm
     */
    active?: Record<string, string>;
    /**
     * List of all keys
     */
    keys?: KeyMetadataRepresentation[];
}

/**
 * Keys API for Keycloak Admin SDK
 * Provides methods for managing keys in Keycloak
 */

/**
 * API for managing Keycloak keys
 */
declare class KeysApi {
    private sdk;
    /**
     * Creates a new instance of the Keys API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get keys metadata for the current realm
     *
     * Endpoint: GET /{realm}/keys
     *
     * @returns {Promise<KeysMetadataRepresentation>} Keys metadata
     * @throws {Error} If the request fails
     */
    getKeys(): Promise<KeysMetadataRepresentation>;
}

/**
 * Represents a resource server in Keycloak Authorization Services
 */
interface ResourceServerRepresentation {
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
interface ResourceRepresentation {
    _id?: string;
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
interface ResourceRepresentationResponse extends ResourceRepresentation {
    _id: string;
}
/**
 * Represents a scope in Keycloak Authorization Services
 */
interface ScopeRepresentation {
    id?: string;
    name?: string;
    displayName?: string;
    iconUri?: string;
}
/**
 * Base representation for policies in Keycloak Authorization Services
 */
interface AbstractPolicyRepresentation {
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
interface PolicyRepresentation extends AbstractPolicyRepresentation {
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
interface PolicyProviderRepresentation {
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
interface PolicyEvaluationRequest {
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
interface PolicyEvaluationResponse {
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

/**
 * Resource Server API for Keycloak Admin SDK
 * Focused on managing resource server configuration
 */

/**
 * API for managing Resource Server configuration in Keycloak
 *
 * A Resource Server is a client application that hosts protected resources
 * and relies on authorization policies to decide whether access should be granted.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_resource_server
 */
declare class ResourceServerApi {
    private sdk;
    /**
     * Creates a new instance of the Resource Server API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get the resource server configuration
     *
     * Endpoint: GET /clients/{clientId}/authz/resource-server
     *
     * @param clientId - UUID of the client
     * @returns Resource server configuration
     */
    getResourceServer(clientId: string): Promise<ResourceServerRepresentation>;
    /**
     * Create a resource
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/resource
     *
     * @param clientUuid - UUID of the client
     * @param resource - Resource to create
     * @returns Created resource
     */
    createResource(clientUuid: string, resource: ResourceRepresentation): Promise<ResourceRepresentationResponse>;
    /**
     * Get a resource by ID
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @returns Resource
     */
    getResource(clientUuid: string, resourceId: string): Promise<ResourceRepresentation>;
    /**
     * Update the resource server configuration
     *
     * Endpoint: PUT /clients/{clientUuid}/authz/resource-server
     *
     * @param clientUuid - UUID of the client
     * @param config - Resource server configuration
     */
    updateResourceServer(clientUuid: string, config: ResourceServerRepresentation): Promise<void>;
    /**
     * Get resources associated with the resource server
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource
     *
     * @param clientUuid - UUID of the client
     * @param options - Query parameters
     * @returns List of resources
     */
    getResources(clientUuid: string, options?: {
        deep?: boolean;
        exactName?: boolean;
        first?: number;
        max?: number;
        name?: string;
        owner?: string;
        scope?: string;
        type?: string;
        uri?: string;
        matchingUri?: string;
    }): Promise<ResourceRepresentation[]>;
    /**
     * Import a resource server configuration
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/import
     *
     * @param clientUuid - UUID of the client
     * @param config - Resource server configuration to import
     */
    importResourceServer(clientUuid: string, config: ResourceServerRepresentation): Promise<void>;
    /**
     * Get resource server settings
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/settings
     *
     * @param clientUuid - UUID of the client
     * @returns Resource server settings
     */
    getSettings(clientUuid: string): Promise<ResourceServerRepresentation>;
    /**
     * Search for a resource by name
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/search
     *
     * @param clientUuid - UUID of the client
     * @param name - Name to search for
     * @returns Resource if found
     */
    searchResource(clientUuid: string, name: string): Promise<ResourceRepresentation>;
    /**
     * Update a resource
     *
     * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @param resource - Updated resource
     */
    updateResource(clientUuid: string, resourceId: string, resource: ResourceRepresentation): Promise<void>;
    /**
     * Delete a resource
     *
     * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     */
    deleteResource(clientUuid: string, resourceId: string): Promise<void>;
}

/**
 * Resources API for Keycloak Admin SDK
 * Focused on managing protected resources
 */

/**
 * API for managing protected resources in Keycloak Authorization Services
 *
 * A resource is part of the assets of an application and the organization.
 * It can be a set of one or more endpoints, a classic web resource such as an HTML page, etc.
 * In authorization policy terminology, a resource is the object being protected.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_resource
 */
declare class ResourcesApi {
    private sdk;
    /**
     * Creates a new instance of the Resources API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get resources associated with the resource server
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource
     *
     * @param clientUuid - UUID of the client
     * @param options - Query parameters
     * @returns List of resources
     */
    getResources(clientUuid: string, options?: {
        deep?: boolean;
        exactName?: boolean;
        first?: number;
        max?: number;
        name?: string;
        owner?: string;
        scope?: string;
        type?: string;
        uri?: string;
        matchingUri?: string;
    }): Promise<ResourceRepresentation[]>;
    /**
     * Create a resource
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/resource
     *
     * @param clientUuid - UUID of the client
     * @param resource - Resource to create
     * @returns Created resource
     */
    createResource(clientUuid: string, resource: ResourceRepresentation): Promise<ResourceRepresentationResponse>;
    /**
     * Get a resource by ID
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @returns Resource
     */
    getResource(clientUuid: string, resourceId: string): Promise<ResourceRepresentation>;
    /**
     * Update a resource
     *
     * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @param resource - Updated resource
     */
    updateResource(clientUuid: string, resourceId: string, resource: ResourceRepresentation): Promise<void>;
    /**
     * Delete a resource
     *
     * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/resource/{resourceId}
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     */
    deleteResource(clientUuid: string, resourceId: string): Promise<void>;
    /**
     * Get resource permissions
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}/permissions
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @returns List of permissions
     */
    getResourcePermissions(clientUuid: string, resourceId: string): Promise<PolicyRepresentation[]>;
    /**
     * Get resource scopes
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}/scopes
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @returns List of scopes
     */
    getResourceScopes(clientUuid: string, resourceId: string): Promise<ScopeRepresentation[]>;
    /**
     * Get resource attributes
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/{resourceId}/attributes
     *
     * @param clientUuid - UUID of the client
     * @param resourceId - ID of the resource
     * @returns Resource attributes
     */
    getResourceAttributes(clientUuid: string, resourceId: string): Promise<Record<string, string[]>>;
    /**
     * Search for a resource by name
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/resource/search
     *
     * @param clientUuid - UUID of the client
     * @param name - Name to search for
     * @returns Resource if found
     */
    searchResource(clientUuid: string, name: string): Promise<ResourceRepresentation>;
}

/**
 * Scopes API for Keycloak Admin SDK
 * Focused on managing authorization scopes
 */

/**
 * API for managing authorization scopes in Keycloak
 *
 * A scope is a bounded extent of access that is possible to perform on a resource.
 * In authorization policy terminology, a scope is one of the potentially many verbs
 * that can logically apply to a resource.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_scope
 */
declare class ScopesApi {
    private sdk;
    /**
     * Creates a new instance of the Scopes API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get scopes
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope
     *
     * @param clientUuid - UUID of the client
     * @param options - Query parameters
     * @returns List of scopes
     */
    getScopes(clientUuid: string, options?: {
        deep?: boolean;
        exactName?: boolean;
        first?: number;
        max?: number;
        name?: string;
    }): Promise<ScopeRepresentation[]>;
    /**
     * Create a scope
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/scope
     *
     * @param clientUuid - UUID of the client
     * @param scope - Scope to create
     */
    createScope(clientUuid: string, scope: ScopeRepresentation): Promise<void>;
    /**
     * Get a scope by ID
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/{scopeId}
     *
     * @param clientUuid - UUID of the client
     * @param scopeId - ID of the scope
     * @returns Scope
     */
    getScope(clientUuid: string, scopeId: string): Promise<ScopeRepresentation>;
    /**
     * Update a scope
     *
     * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/scope/{scopeId}
     *
     * @param clientUuid - UUID of the client
     * @param scopeId - ID of the scope
     * @param scope - Updated scope
     */
    updateScope(clientUuid: string, scopeId: string, scope: ScopeRepresentation): Promise<void>;
    /**
     * Delete a scope
     *
     * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/scope/{scopeId}
     *
     * @param clientUuid - UUID of the client
     * @param scopeId - ID of the scope
     */
    deleteScope(clientUuid: string, scopeId: string): Promise<void>;
    /**
     * Get scope permissions
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/{scopeId}/permissions
     *
     * @param clientUuid - UUID of the client
     * @param scopeId - ID of the scope
     * @returns List of permissions
     */
    getScopePermissions(clientUuid: string, scopeId: string): Promise<PolicyRepresentation[]>;
    /**
     * Get scope resources
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/{scopeId}/resources
     *
     * @param clientUuid - UUID of the client
     * @param scopeId - ID of the scope
     * @returns List of resources
     */
    getScopeResources(clientUuid: string, scopeId: string): Promise<ResourceRepresentation[]>;
    /**
     * Search for a scope by name
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/scope/search
     *
     * @param clientUuid - UUID of the client
     * @param name - Name to search for
     * @param exactName - Optional flag to search for exact name match
     * @returns List of scopes matching the search criteria
     * @throws Error if the search fails
     */
    searchScope(clientUuid: string, name: string, exactName?: boolean): Promise<ScopeRepresentation>;
}

/**
 * Policies API for Keycloak Admin SDK
 * Focused on managing authorization policies
 */

/**
 * API for managing authorization policies in Keycloak
 *
 * Policies define the conditions that must be satisfied to grant access to an object.
 * Unlike permissions, you do not specify the object being protected but rather the conditions
 * that must be satisfied for access to a given object (resource or scope).
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_policy
 */
declare class PoliciesApi {
    private sdk;
    /**
     * Creates a new instance of the Policies API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get policies
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/policy
     *
     * @param clientUuid - UUID of the client
     * @param options - Query parameters
     * @returns List of policies
     */
    getPolicies(clientUuid: string, options?: {
        first?: number;
        max?: number;
        name?: string;
        permission?: boolean;
        resource?: string;
        scope?: string;
        type?: string;
        owner?: string;
        fields?: string;
        policyId?: string;
    }): Promise<AbstractPolicyRepresentation[]>;
    /**
     * Create a policy
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/policy/{type}
     *
     * @param clientUuid - UUID of the client
     * @param policy - Policy to create
     * @returns Created policy
     * @throws Error if policy creation fails
     */
    createPolicy(clientUuid: string, policy: PolicyRepresentation): Promise<PolicyRepresentation>;
    /**
     * Update a policy
     *
     * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/policy/{type}/{policyId}
     *
     * @param clientUuid - UUID of the client
     * @param policyId - PolicyId to update
     * @param policyData - PolicyData to update
     * @returns Created policy
     * @throws Error if policy creation fails
     */
    updatePolicy(clientUuid: string, policyId: string, policyData: PolicyRepresentation): Promise<PolicyRepresentation>;
    /**
     * Delete a policy
     *
     * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/policy/{policyId}
     *
     * @param clientUuid - UUID of the client
     * @param policyId - ID of the policy to delete
     */
    deletePolicy(clientUuid: string, policyId: string): Promise<void>;
    /**
     * Get policy providers
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/policy/providers
     *
     * @param clientUuid - UUID of the client
     * @returns List of policy providers
     */
    getPolicyProviders(clientUuid: string): Promise<PolicyProviderRepresentation[]>;
    /**
     * Search for a policy by name
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/policy/search
     *
     * @param clientUuid - UUID of the client
     * @param name - Name to search for
     * @param fields - Fields to include
     * @returns Policy if found
     */
    searchPolicy(clientUuid: string, name: string, fields?: string): Promise<AbstractPolicyRepresentation>;
    /**
     * Evaluate policies
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/policy/evaluate
     *
     * @param clientUuid - UUID of the client
     * @param request - Evaluation request
     * @returns Evaluation response
     */
    evaluatePolicy(clientUuid: string, request: PolicyEvaluationRequest): Promise<PolicyEvaluationResponse>;
}

/**
 * Permissions API for Keycloak Admin SDK
 * Focused on managing authorization permissions
 */

/**
 * API for managing permissions in Keycloak Authorization Services
 *
 * A permission associates the object being protected with the policies that must be evaluated
 * to determine whether access is granted. Permissions can be resource-based or scope-based.
 *
 * @see https://www.keycloak.org/docs/latest/authorization_services/#_permission
 */
declare class PermissionsApi {
    private sdk;
    /**
     * Creates a new instance of the Permissions API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get permissions
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/permission
     *
     * @param clientUuid - UUID of the client
     * @param options - Query parameters
     * @returns List of permissions
     */
    getPermissions(clientUuid: string, options?: {
        first?: number;
        max?: number;
        name?: string;
        resource?: string;
        scope?: string;
        type?: string;
        owner?: string;
        fields?: string;
        permission?: boolean;
        policyId?: string;
    }): Promise<AbstractPolicyRepresentation[]>;
    /**
     * Create a permission
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/permission/{type}
     *
     * @param clientUuid - UUID of the client
     * @param permission - Permission to create
     * @returns Created permission
     */
    createPermission(clientUuid: string, permission: PolicyRepresentation): Promise<PolicyRepresentation>;
    /**
     * Update a permission
     *
     * Endpoint: PUT /clients/{clientUuid}/authz/resource-server/permission/{type}/{permissionId}
     *
     * @param clientUuid - UUID of the client
     * @param permissionId - ID of the permission
     * @param permission - Updated permission data
     * @returns Updated permission
     */
    updatePermission(clientUuid: string, permissionId: string, permission: PolicyRepresentation): Promise<PolicyRepresentation>;
    /**
     * Delete a permission
     *
     * Endpoint: DELETE /clients/{clientUuid}/authz/resource-server/permission/{permissionId}
     *
     * @param clientUuid - UUID of the client
     * @param permissionId - ID of the permission to delete
     */
    deletePermission(clientUuid: string, permissionId: string): Promise<void>;
    /**
     * Get permission providers
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/permission/providers
     *
     * @param clientUuid - UUID of the client
     * @returns List of permission providers
     */
    getPermissionProviders(clientUuid: string): Promise<PolicyProviderRepresentation[]>;
    /**
     * Search for a permission by name
     *
     * Endpoint: GET /clients/{clientUuid}/authz/resource-server/permission/search
     *
     * @param clientUuid - UUID of the client
     * @param name - Name to search for
     * @param fields - Fields to include
     * @returns Permission if found
     */
    searchPermission(clientUuid: string, name: string, fields?: string): Promise<AbstractPolicyRepresentation>;
    /**
     * Evaluate permissions
     *
     * Endpoint: POST /clients/{clientUuid}/authz/resource-server/permission/evaluate
     *
     * @param clientUuid - UUID of the client
     * @param request - Evaluation request
     * @returns Evaluation response
     */
    evaluatePermission(clientUuid: string, request: PolicyEvaluationRequest): Promise<PolicyEvaluationResponse>;
}

/**
 * Authorization Services API for Keycloak Admin SDK
 * Main entry point for authorization services functionality
 */

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
declare class AuthorizationServicesApi {
    private sdk;
    /**
     * Resource Server API for managing resource server configuration
     */
    resourceServer: ResourceServerApi;
    /**
     * Resources API for managing protected resources
     */
    resources: ResourcesApi;
    /**
     * Scopes API for managing resource scopes
     */
    scopes: ScopesApi;
    /**
     * Policies API for managing authorization policies
     */
    policies: PoliciesApi;
    /**
     * Permissions API for managing resource and scope permissions
     */
    permissions: PermissionsApi;
    /**
     * Creates a new instance of the Authorization Services API
     *
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
}

/**
 * Component representation types for Keycloak Admin SDK
 */
/**
 * Represents a Keycloak component
 */
interface ComponentRepresentation {
    /**
     * Component ID
     */
    id?: string;
    /**
     * Component name
     */
    name?: string;
    /**
     * Provider ID
     */
    providerId?: string;
    /**
     * Provider type
     */
    providerType?: string;
    /**
     * Parent ID
     */
    parentId?: string;
    /**
     * Component sub type
     */
    subType?: string;
    /**
     * Component configuration
     */
    config?: Record<string, string[]>;
}
/**
 * Represents a Keycloak component type
 */
interface ComponentTypeRepresentation {
    /**
     * Component type ID
     */
    id?: string;
    /**
     * Component help text
     */
    helpText?: string;
    /**
     * Properties of the component type
     */
    properties?: ComponentPropertyRepresentation[];
    /**
     * Metadata of the component type
     */
    metadata?: Record<string, any>;
}
/**
 * Represents a property of a component type
 */
interface ComponentPropertyRepresentation {
    /**
     * Property name
     */
    name?: string;
    /**
     * Property label
     */
    label?: string;
    /**
     * Property help text
     */
    helpText?: string;
    /**
     * Property type
     */
    type?: string;
    /**
     * Default value
     */
    defaultValue?: string;
    /**
     * Options for select types
     */
    options?: string[];
    /**
     * Is the property secret?
     */
    secret?: boolean;
    /**
     * Is the property required?
     */
    required?: boolean;
}

/**
 * Component API for Keycloak Admin SDK
 */

/**
 * Component API class for managing Keycloak components
 */
declare class ComponentApi {
    private sdk;
    /**
     * Constructor for ComponentApi
     *
     * @param sdk - KeycloakAdminSDK instance
     */
    constructor(sdk: KeycloakAdminSDK);
    /**
     * Get all components in a realm
     *
     * Endpoint: GET /admin/realms/{realm}/components
     *
     * @param realm - Realm name
     * @param options - Optional query parameters
     * @returns List of components
     */
    getComponents(realm: string, options?: {
        name?: string;
        parent?: string;
        type?: string;
    }): Promise<ComponentRepresentation[]>;
    /**
     * Get a component by ID
     *
     * Endpoint: GET /admin/realms/{realm}/components/{id}
     *
     * @param realm - Realm name
     * @param id - Component ID
     * @returns Component
     */
    getComponent(realm: string, id: string): Promise<ComponentRepresentation>;
    /**
     * Create a component
     *
     * Endpoint: POST /admin/realms/{realm}/components
     *
     * @param realm - Realm name
     * @param component - Component to create
     * @returns Created component
     */
    createComponent(realm: string, component: ComponentRepresentation): Promise<void>;
    /**
     * Update a component
     *
     * Endpoint: PUT /admin/realms/{realm}/components/{id}
     *
     * @param realm - Realm name
     * @param id - Component ID
     * @param component - Updated component
     */
    updateComponent(realm: string, id: string, component: ComponentRepresentation): Promise<void>;
    /**
     * Delete a component
     *
     * Endpoint: DELETE /admin/realms/{realm}/components/{id}
     *
     * @param realm - Realm name
     * @param id - Component ID
     */
    deleteComponent(realm: string, id: string): Promise<void>;
    /**
     * Get sub-component types for a component
     *
     * Endpoint: GET /admin/realms/{realm}/components/{id}/sub-component-types
     *
     * @param realm - Realm name
     * @param id - Component ID
     * @param type - Required type parameter (e.g., 'org.keycloak.storage.UserStorageProvider')
     * @returns List of sub-component types
     */
    getSubComponentTypes(realm: string, id: string, type?: string): Promise<ComponentTypeRepresentation[]>;
}

interface KeycloakConfig {
    baseUrl: string;
    realm: string;
    authMethod: 'bearer' | 'client' | 'password';
    credentials: BearerCredentials | ClientCredentials | PasswordCredentials;
}
interface BearerCredentials {
    token: string;
}
interface ClientCredentials {
    clientId: string;
    clientSecret: string;
}
interface PasswordCredentials {
    username: string;
    password: string;
    clientId: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Keycloak Admin SDK
 * A TypeScript SDK for interacting with the Keycloak Admin REST API
 */

/**
 * Main SDK class for interacting with the Keycloak Admin REST API
 */
declare class KeycloakAdminSDK {
    private baseUrl;
    private adminUrl;
    private config;
    private token;
    users: UsersApi;
    groups: GroupsApi;
    realms: RealmsApi;
    clients: ClientsApi;
    organizations: OrganizationsApi;
    identityProviders: IdentityProvidersApi;
    roles: RolesApi;
    roleMappings: RoleMappingsApiFactory;
    scopeMappings: ScopeMappingsApiFactory;
    keys: KeysApi;
    authorizationServices: AuthorizationServicesApi;
    component: ComponentApi;
    attackDetection: AttackDetectionApi;
    /**
     * Creates a new instance of the Keycloak Admin SDK
     *
     * @param {KeycloakConfig} config - Configuration for connecting to Keycloak
     */
    constructor(config: KeycloakConfig);
    /**
     * Gets a valid authentication token
     *
     * @returns {Promise<string>} A valid authentication token
     */
    getValidToken(): Promise<string>;
    /**
     * Makes an authenticated request to the Keycloak Admin REST API for the configured realm
     *
     * @param {string} endpoint - The API endpoint to call
     * @param {HttpMethod} method - The HTTP method to use
     * @param {any} [body] - Optional request body
     * @param options Overrides default HTTP headers
  
     * @returns {Promise<T>} The response data
     */
    request<T>(endpoint: string, method: HttpMethod, body?: any, options?: {
        headers?: Record<string, string>;
    } | Record<string, any>): Promise<T>;
    /**
     * Makes an authenticated request to the Keycloak Admin REST API without including a realm in the URL
     * Used for global admin endpoints like /admin/realms
     *
     * @param {string} endpoint - The API endpoint to call
     * @param {HttpMethod} method - The HTTP method to use
     * @param {any} [body] - Optional request body
     * @param options Overrides default HTTP headers
     * @returns {Promise<T>} The response data
     */
    requestWithoutRealm<T>(endpoint: string, method: HttpMethod, body?: any, options?: {
        headers?: Record<string, string>;
    }): Promise<T>;
    /**
     * Makes an authenticated request to the Keycloak Admin REST API for a specific realm
     * Used when accessing a realm other than the one configured in the SDK
     *
     * @param {string} realmName - The name of the realm to access
     * @param {string} endpoint - The API endpoint to call
     * @param {HttpMethod} method - The HTTP method to use
     * @param {any} [body] - Optional request body
     * @param options Overrides default HTTP headers
     * @returns {Promise<T>} The response data
     */
    requestForRealm<T>(realmName: string, endpoint: string, method: HttpMethod, body?: any, options?: {
        headers?: Record<string, string>;
    }): Promise<T>;
}

export { KeycloakAdminSDK as default };
