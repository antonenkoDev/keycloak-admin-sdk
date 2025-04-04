/**
 * Example: Manage Client Types
 * 
 * This example demonstrates how to manage client types
 * using the Keycloak Admin SDK.
 */

import KeycloakAdminSDK from "../../src";
import { config } from "../config";
import { ClientTypesRepresentation } from "../../src/types/realms";

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    
    console.log('Getting client types...');
    
    // Get client types
    const clientTypes = await sdk.realms.getClientTypes(config.realm);
    console.log('Current client types:');
    console.log(JSON.stringify(clientTypes, null, 2));
    
    // Create or update client types
    // Note: Be careful when updating client types as they affect client behavior
    if (clientTypes && clientTypes.realm) {
      const updatedClientTypes: ClientTypesRepresentation = {
        global: clientTypes.global, // Keep global types unchanged
        realm: [
          ...(clientTypes.realm || []),
          {
            id: `custom-type-${Date.now()}`,
            name: 'Custom Client Type',
            description: 'Custom client type created via SDK',
            global: false,
            builtin: false,
            clientAttributes: {
              'access.token.lifespan': '1800',
              'client.session.timeout': '3600',
              'client.offline.session.idle.timeout': '7200'
            }
          }
        ]
      };
      
      console.log('Updating client types...');
      await sdk.realms.updateClientTypes(config.realm, updatedClientTypes);
      console.log('Client types updated successfully');
      
      // Get updated client types to verify changes
      const updatedClientTypesResult = await sdk.realms.getClientTypes(config.realm);
      console.log('Updated client types:');
      console.log(JSON.stringify(updatedClientTypesResult, null, 2));
    } else {
      console.log('No realm-specific client types found to update');
    }
    
    // Get client session stats
    console.log('Getting client session stats...');
    const sessionStats = await sdk.realms.getClientSessionStats(config.realm);
    console.log('Client session stats:');
    console.log(JSON.stringify(sessionStats, null, 2));
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
