/**
 * Example: Manage Users Management Permissions
 *
 * This example demonstrates how to manage users management permissions
 * using the Keycloak Admin SDK.
 */

import KeycloakClient from '../../src';
import { config } from '../config';
import { ManagementPermissionReference } from '../../src/types/realms'; // Main execution

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakClient(config);

    // Get users management permissions
    try {
      const permissions = await sdk.realms.getUsersManagementPermissions(config.realm);

      console.log(JSON.stringify(permissions, null, 2));

      // Update users management permissions

      // Enable fine-grained permissions
      const updatedPermissions: ManagementPermissionReference = {
        enabled: true,
        ...permissions
      };

      const result = await sdk.realms.updateUsersManagementPermissions(
        config.realm,
        updatedPermissions
      );

      console.log(JSON.stringify(result, null, 2));

      // Get updated permissions to verify changes
      const verifiedPermissions = await sdk.realms.getUsersManagementPermissions(config.realm);

      console.log(JSON.stringify(verifiedPermissions, null, 2));

      // Disable fine-grained permissions if needed
      if (verifiedPermissions.enabled) {
        const disabledPermissions: ManagementPermissionReference = {
          ...verifiedPermissions,
          enabled: false
        };

        const disableResult = await sdk.realms.updateUsersManagementPermissions(
          config.realm,
          disabledPermissions
        );

        console.log(JSON.stringify(disableResult, null, 2));
      }
    } catch (error) {
      console.log(
        `Failed to get users management permissions: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
