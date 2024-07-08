import fetch, { RequestInit, Response, Headers } from 'node-fetch';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class RequestError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export async function makeRequest<T>(
    url: string,
    method: HttpMethod,
    token: string,
    body?: any
): Promise<T> {
    const headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    const response: Response = await fetch(url, options);

    if (!response.ok) {
        throw new RequestError(response.status, response.statusText);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json() as Promise<T>;
}
