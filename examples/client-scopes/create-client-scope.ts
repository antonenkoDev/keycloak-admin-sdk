/**
 * Example: Create a client scope with protocol mappers
 * 
 * This example demonstrates how to create a new client scope with protocol mappers
 * using the Keycloak Admin SDK.
 */

import KeycloakAdminSDK from '../../src/index';
import { ClientScopeRepresentation, ProtocolMapperRepresentation } from '../../src/types/clients';
import { KeycloakConfig } from '../../src/types/auth';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new instance of the Keycloak Admin SDK with proper typing
const config: KeycloakConfig = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: 'password',
  credentials: {
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'admin-cli',
    username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'
  }
};

const sdk = new KeycloakAdminSDK(config);

/**
 * Create a new client scope with protocol mappers
 */
async function createClientScope() {
  try {
    // Generate a unique name for the client scope
    const scopeName = `example-scope-${Date.now()}`;
    
    // Define the client scope following SOLID principles
    // Single Responsibility: Each object has a clear purpose
    const clientScope: ClientScopeRepresentation = {
      name: scopeName,
      description: 'Example client scope created via SDK',
      protocol: 'openid-connect',
      attributes: {
        'display.on.consent.screen': 'true',
        'include.in.token.scope': 'true',
        'gui.order': '1000'
      }
    };
    
    // Create the client scope
    console.log(`Creating client scope: ${scopeName}`);
    const clientScopeId = await sdk.clientScopes.create(clientScope);
    console.log(`Client scope created with ID: ${clientScopeId}`);
    
    // Define protocol mappers for the client scope
    // Following Interface Segregation Principle: Only include necessary properties
    const emailMapper: ProtocolMapperRepresentation = {
      name: 'email',
      protocol: 'openid-connect',
      protocolMapper: 'oidc-usermodel-property-mapper',
      consentRequired: false,
      config: {
        'userinfo.token.claim': 'true',
        'user.attribute': 'email',
        'id.token.claim': 'true',
        'access.token.claim': 'true',
        'claim.name': 'email',
        'jsonType.label': 'String'
      }
    };
    
    const usernameMapper: ProtocolMapperRepresentation = {
      name: 'username',
      protocol: 'openid-connect',
      protocolMapper: 'oidc-usermodel-property-mapper',
      consentRequired: false,
      config: {
        'userinfo.token.claim': 'true',
        'user.attribute': 'username',
        'id.token.claim': 'true',
        'access.token.claim': 'true',
        'claim.name': 'preferred_username',
        'jsonType.label': 'String'
      }
    };
    
    // Add protocol mappers to the client scope with proper error handling
    try {
      console.log('Adding email protocol mapper');
      const emailMapperId = await sdk.clientScopes.createProtocolMapper(clientScopeId, emailMapper);
      console.log(`Email mapper created with ID: ${emailMapperId}`);
    } catch (error) {
      console.error('Failed to create email mapper:', error instanceof Error ? error.message : String(error));
    }
    
    try {
      console.log('Adding username protocol mapper');
      const usernameMapperId = await sdk.clientScopes.createProtocolMapper(clientScopeId, usernameMapper);
      console.log(`Username mapper created with ID: ${usernameMapperId}`);
    } catch (error) {
      console.error('Failed to create username mapper:', error instanceof Error ? error.message : String(error));
    }
    
    // Retrieve the client scope to verify it was created correctly
    const createdScope = await sdk.clientScopes.findById(clientScopeId);
    console.log('\nCreated client scope details:');
    console.log(`- Name: ${createdScope.name}`);
    console.log(`- Description: ${createdScope.description}`);
    console.log(`- Protocol: ${createdScope.protocol}`);
    
    // Display attributes with defensive programming
    if (createdScope.attributes) {
      console.log('- Attributes:');
      Object.entries(createdScope.attributes).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    
    // Retrieve and display protocol mappers with proper error handling
    try {
      const protocolMappers = await sdk.clientScopes.getProtocolMappers(clientScopeId);
      console.log(`- Protocol Mappers (${protocolMappers.length}):`);
      protocolMappers.forEach(mapper => {
        console.log(`  - ${mapper.name} (${mapper.protocolMapper})`);
        if (mapper.config) {
          console.log('    Config:');
          Object.entries(mapper.config).forEach(([key, value]) => {
            console.log(`      ${key}: ${value}`);
          });
        }
      });
    } catch (error) {
      console.error('Failed to retrieve protocol mappers:', error instanceof Error ? error.message : String(error));
    }
    
    console.log('\nClient scope created successfully!');
    
    return clientScopeId;
  } catch (error) {
    console.error('Error creating client scope:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Execute the function with proper error handling
createClientScope()
  .then(clientScopeId => {
    console.log(`\nTo clean up this example, you can delete the client scope with ID: ${clientScopeId}`);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
