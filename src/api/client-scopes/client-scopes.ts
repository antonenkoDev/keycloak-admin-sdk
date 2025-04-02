/**
 * Client Scopes API for Keycloak Admin SDK
 * Provides methods for managing client scopes in Keycloak
 */

import KeycloakAdminSDK from '../../index';
import { ClientScopeRepresentation, ProtocolMapperRepresentation } from '../../types/clients';

/**
 * API for managing Keycloak client scopes
 */
export class ClientScopesApi {
    private sdk: KeycloakAdminSDK;

    /**
     * Creates a new instance of the Client Scopes API
     * 
     * @param {KeycloakAdminSDK} sdk - The Keycloak Admin SDK instance
     */
    constructor(sdk: KeycloakAdminSDK) {
        this.sdk = sdk;
    }

    /**
     * Get all client scopes in a realm
     * 
     * Endpoint: GET /{realm}/client-scopes
     * 
     * @returns {Promise<ClientScopeRepresentation[]>} List of client scopes
     * @throws {Error} If the request fails
     */
    async findAll(): Promise<ClientScopeRepresentation[]> {
        try {
            return this.sdk.request<ClientScopeRepresentation[]>('/client-scopes', 'GET');
        } catch (error) {
            throw new Error(`Failed to get client scopes: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Create a new client scope
     * 
     * Endpoint: POST /{realm}/client-scopes
     * 
     * @param {ClientScopeRepresentation} clientScope - The client scope to create
     * @returns {Promise<string>} The ID of the created client scope
     * @throws {Error} If the request fails or client scope data is invalid
     */
    async create(clientScope: ClientScopeRepresentation): Promise<string> {
        if (!clientScope) {
            throw new Error('Client scope data is required');
        }
        
        if (!clientScope.name) {
            throw new Error('Client scope name is required');
        }
        
        try {
            // Make the request to create the client scope
            const response = await this.sdk.request<any>('/client-scopes', 'POST', clientScope);
            
            // Find the created client scope by name to get its ID
            const clientScopes = await this.findAll();
            const createdScope = clientScopes.find(scope => scope.name === clientScope.name);
            
            if (createdScope && createdScope.id) {
                return createdScope.id;
            }
            
            throw new Error('Client scope was created but ID could not be retrieved');
        } catch (error) {
            throw new Error(`Failed to create client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get a client scope by ID
     * 
     * Endpoint: GET /{realm}/client-scopes/{id}
     * 
     * @param {string} id - The client scope ID
     * @returns {Promise<ClientScopeRepresentation>} The client scope representation
     * @throws {Error} If the request fails or ID is invalid
     */
    async findById(id: string): Promise<ClientScopeRepresentation> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        try {
            return this.sdk.request<ClientScopeRepresentation>(`/client-scopes/${id}`, 'GET');
        } catch (error) {
            throw new Error(`Failed to get client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

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
    async update(id: string, clientScope: ClientScopeRepresentation): Promise<void> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        if (!clientScope) {
            throw new Error('Client scope data is required');
        }
        
        try {
            await this.sdk.request<void>(`/client-scopes/${id}`, 'PUT', clientScope);
        } catch (error) {
            throw new Error(`Failed to update client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Delete a client scope
     * 
     * Endpoint: DELETE /{realm}/client-scopes/{id}
     * 
     * @param {string} id - The client scope ID
     * @returns {Promise<void>}
     * @throws {Error} If the request fails or ID is invalid
     */
    async delete(id: string): Promise<void> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        try {
            await this.sdk.request<void>(`/client-scopes/${id}`, 'DELETE');
        } catch (error) {
            throw new Error(`Failed to delete client scope: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get protocol mappers for a client scope
     * 
     * Endpoint: GET /{realm}/client-scopes/{id}/protocol-mappers/models
     * 
     * @param {string} id - The client scope ID
     * @returns {Promise<ProtocolMapperRepresentation[]>} List of protocol mappers
     * @throws {Error} If the request fails or ID is invalid
     */
    async getProtocolMappers(id: string): Promise<ProtocolMapperRepresentation[]> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        try {
            return this.sdk.request<ProtocolMapperRepresentation[]>(`/client-scopes/${id}/protocol-mappers/models`, 'GET');
        } catch (error) {
            throw new Error(`Failed to get protocol mappers: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

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
    async createProtocolMapper(id: string, mapper: ProtocolMapperRepresentation): Promise<string> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        if (!mapper) {
            throw new Error('Protocol mapper data is required');
        }
        
        if (!mapper.name) {
            throw new Error('Protocol mapper name is required');
        }
        
        if (!mapper.protocol) {
            throw new Error('Protocol mapper protocol is required');
        }
        
        try {
            // Create the protocol mapper
            await this.sdk.request<void>(`/client-scopes/${id}/protocol-mappers/models`, 'POST', mapper);
            
            // Get all protocol mappers to find the ID of the one we just created
            const mappers = await this.getProtocolMappers(id);
            const createdMapper = mappers.find(m => m.name === mapper.name);
            
            if (createdMapper && createdMapper.id) {
                return createdMapper.id;
            }
            
            throw new Error('Protocol mapper was created but ID could not be retrieved');
        } catch (error) {
            throw new Error(`Failed to create protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

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
    async getProtocolMapper(id: string, mapperId: string): Promise<ProtocolMapperRepresentation> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        if (!mapperId) {
            throw new Error('Protocol mapper ID is required');
        }
        
        try {
            return this.sdk.request<ProtocolMapperRepresentation>(`/client-scopes/${id}/protocol-mappers/models/${mapperId}`, 'GET');
        } catch (error) {
            throw new Error(`Failed to get protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

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
    async updateProtocolMapper(id: string, mapperId: string, mapper: ProtocolMapperRepresentation): Promise<void> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        if (!mapperId) {
            throw new Error('Protocol mapper ID is required');
        }
        
        if (!mapper) {
            throw new Error('Protocol mapper data is required');
        }
        
        try {
            // First get the current mapper to ensure we have all required fields
            const currentMapper = await this.getProtocolMapper(id, mapperId);
            
            // Create a merged mapper with current values and updates
            // This follows the Open/Closed principle by extending functionality without modifying existing code
            const updatedMapper: ProtocolMapperRepresentation = {
                ...currentMapper,
                // Override with new values from the mapper parameter
                ...mapper,
                // Ensure ID is preserved
                id: mapperId
            };
            
            // Send the update request
            await this.sdk.request<void>(`/client-scopes/${id}/protocol-mappers/models/${mapperId}`, 'PUT', updatedMapper);
        } catch (error) {
            // Provide detailed error information for better debugging
            if (error instanceof Error) {
                throw new Error(`Failed to update protocol mapper: ${error.message}${error.stack ? '\n' + error.stack : ''}`);
            } else {
                throw new Error(`Failed to update protocol mapper: ${String(error)}`);
            }
        }
    }

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
    async deleteProtocolMapper(id: string, mapperId: string): Promise<void> {
        if (!id) {
            throw new Error('Client scope ID is required');
        }
        
        if (!mapperId) {
            throw new Error('Protocol mapper ID is required');
        }
        
        try {
            await this.sdk.request<void>(`/client-scopes/${id}/protocol-mappers/models/${mapperId}`, 'DELETE');
        } catch (error) {
            throw new Error(`Failed to delete protocol mapper: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
