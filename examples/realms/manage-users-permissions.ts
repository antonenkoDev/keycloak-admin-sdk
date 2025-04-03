/**
 * Example: Manage Users Management Permissions
 * 
 * This example demonstrates how to manage users management permissions
 * using the Keycloak Admin SDK.
 */

import KeycloakAdminSDK from "../../src";
import { config } from "../config";
import { ManagementPermissionReference } from "../../src/types/realms";

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakAdminSDK(config);
    
    console.log(`Getting users management permissions for realm: ${config.realm}`);
    
    // Get users management permissions
    try {
      const permissions = await sdk.realms.getUsersManagementPermissions(config.realm);
      console.log('Current users management permissions:');
      console.log(JSON.stringify(permissions, null, 2));
      
      // Update users management permissions
      console.log('Updating users management permissions...');
      
      // Enable fine-grained permissions
      const updatedPermissions: ManagementPermissionReference = {
        enabled: true,
        ...permissions
      };
      
      const result = await sdk.realms.updateUsersManagementPermissions(config.realm, updatedPermissions);
      console.log('Users management permissions updated successfully:');
      console.log(JSON.stringify(result, null, 2));
      
      // Get updated permissions to verify changes
      const verifiedPermissions = await sdk.realms.getUsersManagementPermissions(config.realm);
      console.log('Verified users management permissions:');
      console.log(JSON.stringify(verifiedPermissions, null, 2));
      
      // Disable fine-grained permissions if needed
      if (verifiedPermissions.enabled) {
        console.log('Disabling users management permissions...');
        const disabledPermissions: ManagementPermissionReference = {
          ...verifiedPermissions,
          enabled: false
        };
        
        const disableResult = await sdk.realms.updateUsersManagementPermissions(config.realm, disabledPermissions);
        console.log('Users management permissions disabled:');
        console.log(JSON.stringify(disableResult, null, 2));
      }
    } catch (error) {
      console.log(`Failed to get users management permissions: ${error instanceof Error ? error.message : String(error)}`);
      console.log('This may be because the realm does not support fine-grained permissions management');
    }
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
