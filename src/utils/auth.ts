import { KeycloakConfig, BearerCredentials, ClientCredentials, PasswordCredentials } from '../types/auth';

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

/**
 * Get an authentication token from Keycloak
 * @param config The Keycloak configuration
 * @returns A promise that resolves to the authentication token
 */
export async function getToken(config: KeycloakConfig): Promise<string> {
    // For bearer token authentication, just return the token
    if (config.authMethod === 'bearer') {
        return (config.credentials as BearerCredentials).token;
    }

    // For client credentials or password authentication, get a token from Keycloak
    const tokenUrl = `${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/token`;

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    let body: URLSearchParams;

    // Prepare the request body based on the authentication method
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
        throw new Error(`Invalid authentication method: ${config.authMethod}`);
    }

    try {
        // Make the request to get a token
        const response = await fetch(tokenUrl, { method: 'POST', headers, body });
        
        // Try to parse the response as JSON
        let data: unknown;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Failed to parse token response as JSON:', error);
            const responseText = await response.text().catch(() => 'Unable to get response text');
            console.error('Response text:', responseText);
            throw new Error(`Failed to parse token response: ${error instanceof Error ? error.message : String(error)}`);
        }

        // Handle error responses
        if (!response.ok) {
            console.error(`Token request failed with status: ${response.status}`);
            console.error('Response data:', data);
            
            if (isErrorResponse(data)) {
                throw new Error(`Authentication failed: ${data.error_description || data.error}`);
            } else {
                throw new Error(`Authentication failed: Unknown error (Status: ${response.status})`);
            }
        }

        // Validate the token response
        if (isTokenResponse(data)) {
            return data.access_token;
        } else {
            console.error('Invalid token response:', data);
            throw new Error('Invalid token response: Expected access_token in response');
        }
    } catch (error) {
        // Handle network errors
        if (error instanceof Error) {
            console.error('Error getting token:', error.message);
            console.error('Error stack:', error.stack);
        } else {
            console.error('Unknown error getting token:', error);
        }
        throw error;
    }
}
