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

    const sdk = new KeycloakAdminSDK(config);

    // Get the OIDC provider factory details

    const oidcFactory = await sdk.identityProviders.getProviderFactory('oidc');

    // List all identity providers

    const providers = await sdk.identityProviders.findAll();

    providers.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.alias} (${provider.providerId})`);
    });

    // Create a new identity provider

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

      // Get the created identity provider

      const createdProvider = await sdk.identityProviders.get(newProviderAlias);
      console.log(`Retrieved provider: ${createdProvider.displayName} (${createdProvider.alias})`);

      // Update the identity provider

      const updatedProvider: IdentityProviderRepresentation = {
        ...createdProvider,
        displayName: 'Updated GitHub Example',
        config: {
          ...createdProvider.config,
          defaultScope: 'user:email'
        }
      };
      await sdk.identityProviders.update(newProviderAlias, updatedProvider);

      // Get the updated identity provider
      const retrievedProvider = await sdk.identityProviders.get(newProviderAlias);

      // Get mapper types for the provider

      const mapperTypes = await sdk.identityProviders.getMapperTypes(newProviderAlias);

      const mapperTypesArray = Object.values(mapperTypes);
      mapperTypesArray.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.id})`);
      });

      // Create a mapper for the provider
      if (mapperTypesArray.length > 0) {
        const mapperType = mapperTypesArray[0]; // Use the first available mapper type
        const mapper: IdentityProviderMapperRepresentation = {
          name: 'example-mapper',
          identityProviderAlias: newProviderAlias,
          identityProviderMapper: mapperType.id,
          config: {
            syncMode: 'INHERIT'
          }
        };

        const mapperId = await sdk.identityProviders.createMapper(newProviderAlias, mapper);

        // Get all mappers for the provider

        const mappers = await sdk.identityProviders.getMappers(newProviderAlias);

        // Get the created mapper

        const createdMapper = await sdk.identityProviders.getMapper(newProviderAlias, mapperId);

        // Update the mapper

        const updatedMapper: IdentityProviderMapperRepresentation = {
          ...createdMapper,
          name: 'updated-example-mapper'
        };
        await sdk.identityProviders.updateMapper(newProviderAlias, mapperId, updatedMapper);

        // Delete the mapper

        await sdk.identityProviders.deleteMapper(newProviderAlias, mapperId);
      }

      // Delete the identity provider

      await sdk.identityProviders.delete(newProviderAlias);

      // Verify the identity provider was deleted

      try {
        await sdk.identityProviders.get(newProviderAlias);
      } catch (error) {}
    } catch (error) {
      console.error('Error in identity provider operations:', error);
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the example
main().catch(console.error);
