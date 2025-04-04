export interface UserRepresentation {
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
  credentials?: CredentialRepresentation[];
  federatedIdentities?: FederatedIdentityRepresentation[];
  groups?: string[];
  clientConsents?: ClientConsentRepresentation[];
  userProfileMetadata?: UserProfileMetadata;
}

export interface CredentialRepresentation {
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

export interface FederatedIdentityRepresentation {
  identityProvider?: string;
  userId?: string;
  userName?: string;
}

export interface ClientConsentRepresentation {
  clientId?: string;
  grantedClientScopes?: string[];
  createdDate?: number;
  lastUpdatedDate?: number;
}

export interface UserProfileMetadata {
  attributes?: UserProfileAttribute[];
  groups?: UserProfileGroup[];
}

export interface UserProfileAttribute {
  name?: string;
  displayName?: string;
  required?: boolean;
  readOnly?: boolean;
  annotations?: Record<string, string>;
  validators?: Record<string, Record<string, string>>;
  group?: string;
  multivalued?: boolean;
}

export interface UserProfileGroup {
  name?: string;
  displayHeader?: string;
  displayDescription?: string;
  annotations?: Record<string, string>;
}

export interface GetUsersParams {
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

export interface GetUserParams {
  userProfileMetadata?: boolean;
}

export interface CountUsersParams {
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName?: string;
  lastName?: string;
  q?: string;
  search?: string;
  username?: string;
}

export interface UPConfig {
  attributes?: UserProfileAttribute[];
  groups?: UserProfileGroup[];
}

export interface ConsentRepresentation {
  [key: string]: any;
}

export interface ExecuteActionsEmailParams {
  client_id?: string;
  lifespan?: number;
  redirect_uri?: string;
}

export interface SendVerifyEmailParams {
  client_id?: string;
  lifespan?: number;
  redirect_uri?: string;
}

export interface UserSessionRepresentation {
  id?: string;
  userId?: string;
  ipAddress?: string;
  start?: number;
  lastAccess?: number;
  clients?: Record<string, any>;
  applications?: Record<string, any>;
}

export interface FederatedIdentityRepresentation {
  identityProvider?: string;
  userId?: string;
  userName?: string;
}

export interface GroupRepresentation {
  id?: string;
  name?: string;
  path?: string;
  subGroups?: GroupRepresentation[];
  attributes?: Record<string, string[]>;
  access?: Record<string, boolean>;
}
