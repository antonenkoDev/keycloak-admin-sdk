/**
 * Example: Managing Identity Providers with Keycloak Admin SDK
 * 
 * This example demonstrates how to use the Identity Providers API to:
 * - List all identity providers
 * - Create a new identity provider
 * - Get a specific identity provider
 * - Update an identity provider
 * - Manage identity provider mappers
 * - Delete an identity provider
 * 
 * Following SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../src/index';
import { IdentityProviderRepresentation } from '../../src/types/identity-providers';
import { IdentityProviderMapperRepresentation } from '../../src/types/identity-provider-mappers';

// Configuration for connecting to Keycloak
// In a real application, these values should come from environment variables
const config = {
  baseUrl: process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080',
  realm: process.env.KEYCLOAK_REALM || 'master',
  authMethod: 'password' as const,
  credentials: {
    username: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
    password: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin',
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || 'admin-cli'
  }
};

/**
 * Main function to demonstrate Identity Providers API usage
 */
async function main() {
  try {
    // Initialize the SDK
    console.log('Initializing Keycloak Admin SDK...');
    const sdk = new KeycloakAdminSDK(config);

    // Get all available identity provider types
    console.log('\nGetting available identity provider types...');
    const providerTypes = await sdk.identityProviders.getProviderTypes();
    console.log(`Available provider types: ${Object.keys(providerTypes).join(', ')}`);

    // Get the OIDC provider factory details
    console.log('\nGetting OIDC provider factory details...');
    const oidcFactory = await sdk.identityProviders.getProviderFactory('oidc');
    console.log(`OIDC factory ID: ${oidcFactory.id}`);
    console.log(`OIDC factory name: ${oidcFactory.name}`);

    // List all identity providers
    console.log('\nListing all identity providers...');
    const providers = await sdk.identityProviders.findAll();
    console.log(`Found ${providers.length} identity providers`);
    providers.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.alias} (${provider.providerId})`);
    });

    // Create a new identity provider
    console.log('\nCreating a new identity provider...');
    const newProviderAlias = `example-github-${Date.now()}`;
    const newProvider: IdentityProviderRepresentation = {
      alias: newProviderAlias,
      displayName: 'Example GitHub',
      providerId: 'github',
      enabled: true,
      storeToken: false,
      trustEmail: false,
      firstBrokerLoginFlowAlias: 'first broker login',
      config: {
        clientId: 'your-github-client-id',
        clientSecret: 'your-github-client-secret',
        useJwksUrl: 'true'
      }
    };

    try {
      const providerId = await sdk.identityProviders.create(newProvider);
      console.log(`Created identity provider with ID: ${providerId}`);

      // Get the created identity provider
      console.log('\nGetting the created identity provider...');
      const createdProvider = await sdk.identityProviders.get(newProviderAlias);
      console.log(`Retrieved provider: ${createdProvider.displayName} (${createdProvider.alias})`);

      // Update the identity provider
      console.log('\nUpdating the identity provider...');
      const updatedProvider: IdentityProviderRepresentation = {
        ...createdProvider,
        displayName: 'Updated GitHub Example',
        config: {
          ...createdProvider.config,
          defaultScope: 'user:email'
        }
      };
      await sdk.identityProviders.update(newProviderAlias, updatedProvider);
      console.log('Identity provider updated successfully');

      // Get the updated identity provider
      const retrievedProvider = await sdk.identityProviders.get(newProviderAlias);
      console.log(`Updated provider name: ${retrievedProvider.displayName}`);
      console.log(`Updated scope: ${retrievedProvider.config?.defaultScope}`);

      // Get mapper types for the provider
      console.log('\nGetting mapper types for the provider...');
      const mapperTypes = await sdk.identityProviders.getMapperTypes(newProviderAlias);
      console.log(`Found ${mapperTypes.length} mapper types`);
      mapperTypes.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.id})`);
      });

      // Create a mapper for the provider
      if (mapperTypes.length > 0) {
        console.log('\nCreating a mapper for the provider...');
        const mapperType = mapperTypes[0]; // Use the first available mapper type
        const mapper: IdentityProviderMapperRepresentation = {
          name: 'example-mapper',
          identityProviderAlias: newProviderAlias,
          identityProviderMapper: mapperType.id,
          config: {
            syncMode: 'INHERIT'
          }
        };

        const mapperId = await sdk.identityProviders.createMapper(newProviderAlias, mapper);
        console.log(`Created mapper with ID: ${mapperId}`);

        // Get all mappers for the provider
        console.log('\nGetting all mappers for the provider...');
        const mappers = await sdk.identityProviders.getMappers(newProviderAlias);
        console.log(`Found ${mappers.length} mappers`);

        // Get the created mapper
        console.log('\nGetting the created mapper...');
        const createdMapper = await sdk.identityProviders.getMapper(newProviderAlias, mapperId);
        console.log(`Retrieved mapper: ${createdMapper.name}`);

        // Update the mapper
        console.log('\nUpdating the mapper...');
        const updatedMapper: IdentityProviderMapperRepresentation = {
          ...createdMapper,
          name: 'updated-example-mapper'
        };
        await sdk.identityProviders.updateMapper(newProviderAlias, mapperId, updatedMapper);
        console.log('Mapper updated successfully');

        // Delete the mapper
        console.log('\nDeleting the mapper...');
        await sdk.identityProviders.deleteMapper(newProviderAlias, mapperId);
        console.log('Mapper deleted successfully');
      }

      // Delete the identity provider
      console.log('\nDeleting the identity provider...');
      await sdk.identityProviders.delete(newProviderAlias);
      console.log('Identity provider deleted successfully');

      // Verify the identity provider was deleted
      console.log('\nVerifying the identity provider was deleted...');
      try {
        await sdk.identityProviders.get(newProviderAlias);
        console.log('Error: Identity provider still exists');
      } catch (error) {
        console.log('Success: Identity provider was deleted');
      }
    } catch (error) {
      console.error('Error in identity provider operations:', error);
    }

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the example
main().catch(console.error);
