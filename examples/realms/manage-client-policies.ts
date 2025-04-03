/**
 * Example: Manage Client Policies and Profiles
 * 
 * This example demonstrates how to manage client policies and profiles
 * using the Keycloak Admin SDK.
 */

import KeycloakAdminSDK from "../../src";
import { config } from "../config";
import { ClientPoliciesRepresentation, ClientProfilesRepresentation } from "../../src/types/realms";

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    
    console.log('Getting client policies...');
    
    // Get client policies including global policies
    const policies = await sdk.realms.getClientPolicies(config.realm, true);
    console.log('Current client policies:');
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
    
    console.log('Updating client policies...');
    await sdk.realms.updateClientPolicies(config.realm, updatedPolicies);
    console.log('Client policies updated successfully');
    
    // Get client profiles
    console.log('Getting client profiles...');
    const profiles = await sdk.realms.getClientProfiles(config.realm, true);
    console.log('Current client profiles:');
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
    
    console.log('Updating client profiles...');
    await sdk.realms.updateClientProfiles(config.realm, updatedProfiles);
    console.log('Client profiles updated successfully');
    
    // Get updated client policies to verify changes
    const updatedPoliciesResult = await sdk.realms.getClientPolicies(config.realm, true);
    console.log('Updated client policies:');
    console.log(JSON.stringify(updatedPoliciesResult, null, 2));
    
    // Get updated client profiles to verify changes
    const updatedProfilesResult = await sdk.realms.getClientProfiles(config.realm, true);
    console.log('Updated client profiles:');
    console.log(JSON.stringify(updatedProfilesResult, null, 2));
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
