import { KeycloakConfig, BearerCredentials, ClientCredentials, PasswordCredentials } from '../types/auth';
import fetch from 'node-fetch';

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    token_type: string;
    'not-before-policy': number;
    scope: string;
}

interface ErrorResponse {
    error: string;
    error_description?: string;
}

function isTokenResponse(data: unknown): data is TokenResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'access_token' in data &&
        typeof (data as TokenResponse).access_token === 'string'
    );
}

function isErrorResponse(data: unknown): data is ErrorResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as ErrorResponse).error === 'string'
    );
}

export async function getToken(config: KeycloakConfig): Promise<string> {
    if (config.authMethod === 'bearer') {
        return (config.credentials as BearerCredentials).token;
    }

    const tokenUrl = `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/token`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let body: URLSearchParams;

    if (config.authMethod === 'client') {
        const { clientId, clientSecret } = config.credentials as ClientCredentials;
        body = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        });
    } else if (config.authMethod === 'password') {
        const { username, password, clientId } = config.credentials as PasswordCredentials;
        body = new URLSearchParams({
            grant_type: 'password',
            client_id: clientId,
            username,
            password,
        });
    } else {
        throw new Error('Invalid authentication method');
    }

    const response = await fetch(tokenUrl, { method: 'POST', headers, body });
    const data: unknown = await response.json();

    if (!response.ok) {
        if (isErrorResponse(data)) {
            throw new Error(`Authentication failed: ${data.error_description || data.error}`);
        } else {
            throw new Error('Authentication failed: Unknown error');
        }
    }

    if (isTokenResponse(data)) {
        return data.access_token;
    } else {
        throw new Error('Invalid token response');
    }
}
