export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Custom error class for request failures
 */
export class RequestError extends Error {
  public status: number;
  public responseBody?: string;

  constructor(status: number, message: string, responseBody?: string) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.responseBody = responseBody;
  }
}

/**
 * Make an HTTP request with proper error handling
 * @param url The URL to request
 * @param method The HTTP method to use
 * @param token The authentication token
 * @param body Optional request body
 * @returns The response data
 */
export async function makeRequest<T>(
  url: string,
  method: HttpMethod,
  token: string,
  body?: any,
  options?: { headers?: Record<string, string> }
): Promise<T> {
  // Use the global fetch API
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...options?.headers
  };

  // Set default content type to application/json if not specified in options
  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Determine if we're dealing with form data
  const isFormData = headers['Content-Type'] === 'application/x-www-form-urlencoded';

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body ? (isFormData || typeof body === 'string' ? body : JSON.stringify(body)) : undefined
  };

  try {
    const response = await fetch(url, requestOptions);

    // Handle unsuccessful responses
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No response body');
      console.error(`Request failed with status ${response.status}: ${errorText}`);
      throw new RequestError(response.status, response.statusText, errorText);
    }

    // Handle 201 Created responses with Location header (typically for resource creation)
    if (response.status === 201) {
      const location = response.headers.get('location');
      if (location) {
        // Extract the ID from the location header (last part of the URL)
        const id = location.split('/').pop();
        if (id) {
          // Only return ID as an object for create operations where we expect an ID
          // This is determined by checking if the method is POST and the URL ends with a collection endpoint
          if (
            method === 'POST' &&
            /\/(users|groups|clients|roles|client-scopes|organizations)$/.test(url)
          ) {
            return { id } as T;
          }
        }
      }
      // For other 201 responses without a location header or where we don't need to extract an ID
      return {} as T;
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    // Handle response based on content type and status
    const contentType = response.headers.get('content-type');

    // For 204 No Content or empty responses, return empty object
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    // For JSON responses, parse the JSON
    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        if (!text || text.trim() === '') {
          return {} as T;
        }

        const data = JSON.parse(text);
        return data as T;
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        throw new Error(
          `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    } else {
      // For non-JSON responses, return the response text as the result
      const text = await response.text();
      return { text } as unknown as T;
    }
  } catch (error) {
    // Handle network errors
    if (!(error instanceof RequestError)) {
      console.error('Network error during request:', error);
      throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
    }
    throw error;
  }
}
