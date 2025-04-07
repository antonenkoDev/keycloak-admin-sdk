/**
 * Example: Manage Client Policies and Profiles
 *
 * This example demonstrates how to manage client policies and profiles
 * using the Keycloak Admin SDK.
 */

import KeycloakClient from '../../src';
import { config } from '../config';
import { ClientPoliciesRepresentation, ClientProfilesRepresentation } from '../../src/types/realms'; // Main execution

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakClient(config);

    // Get client policies including global policies
    const policies = await sdk.realms.getClientPolicies(config.realm, true);

    console.log(JSON.stringify(policies, null, 2));

    // Create or update client policies
    const updatedPolicies: ClientPoliciesRepresentation = {
      policies: [
        ...(policies.policies || []),
        {
          name: 'example-policy',
          description: 'Example policy created via SDK',
          enabled: true,
          conditions: [
            {
              condition: 'client-updater-context',
              configuration: {
                'update-client-source': ['ADMIN_API']
              }
            }
          ],
          // List of profile names this policy applies to
          profiles: ['example-profile']
        }
      ]
    };

    await sdk.realms.updateClientPolicies(config.realm, updatedPolicies);

    // Get client profiles

    const profiles = await sdk.realms.getClientProfiles(config.realm, true);

    console.log(JSON.stringify(profiles, null, 2));

    // Create or update client profiles
    const updatedProfiles: ClientProfilesRepresentation = {
      profiles: [
        ...(profiles.profiles || []),
        {
          name: 'example-profile',
          description: 'Example profile created via SDK',
          executors: [
            {
              executor: 'secure-client',
              configuration: {
                'client-authentication-requirement': 'OPTIONAL'
              }
            }
          ]
        }
      ]
    };

    await sdk.realms.updateClientProfiles(config.realm, updatedProfiles);

    // Get updated client policies to verify changes
    const updatedPoliciesResult = await sdk.realms.getClientPolicies(config.realm, true);

    console.log(JSON.stringify(updatedPoliciesResult, null, 2));

    // Get updated client profiles to verify changes
    const updatedProfilesResult = await sdk.realms.getClientProfiles(config.realm, true);

    console.log(JSON.stringify(updatedProfilesResult, null, 2));
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
