/**
 * Example: List all groups in a realm
 * 
 * This example demonstrates how to use the Keycloak Admin SDK
 * to retrieve a list of all groups in a realm.
 */

// Configuration for Keycloak SDK
import { KeycloakConfig } from "../../src/types/auth";
import KeycloakAdminSDK from "../../src";

const config: KeycloakConfig = {
    baseUrl: 'http://localhost:8080',
    realm: 'your-realm',
    authMethod: 'client',
    credentials: {
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
    },
};

// Instantiate Keycloak SDK
const sdk = new KeycloakAdminSDK(config);

(async () => {
    try {
        // Get all top-level groups
        const groups = await sdk.groups.list();
        console.log('Groups:', JSON.stringify(groups, null, 2));
        
        // Count all groups
        const count = await sdk.groups.count();
        
        
        // If there are groups, get details of the first one
        if (groups.length > 0) {
            const groupId = groups[0].id;
            if (groupId) {
                // Get detailed information about the group
                const groupDetails = await sdk.groups.get(groupId);
                console.log('Group details:', JSON.stringify(groupDetails, null, 2));
                
                // Get members of the group
                const members = await sdk.groups.getMembers(groupId);
                console.log('Group members:', JSON.stringify(members, null, 2));
                
                // Get subgroups
                const children = await sdk.groups.getChildren(groupId);
                console.log('Subgroups:', JSON.stringify(children, null, 2));
            }
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    }
})();
