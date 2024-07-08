// src/types/auth.ts

export interface KeycloakConfig {
    baseUrl: string;
    realm: string;
    authMethod: 'bearer' | 'client' | 'password';
    credentials: BearerCredentials | ClientCredentials | PasswordCredentials;
}

export interface BearerCredentials {
    token: string;
}

export interface ClientCredentials {
    clientId: string;
    clientSecret: string;
}

export interface PasswordCredentials {
    username: string;
    password: string;
    clientId: string;
}
