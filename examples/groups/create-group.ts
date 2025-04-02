/**
 * Example: Create a new group
 * 
 * This example demonstrates how to create a new top-level group
 * and a subgroup within it using the Keycloak Admin SDK.
 */

// Configuration for Keycloak SDK
import { KeycloakConfig } from "../../src/types/auth";
import KeycloakAdminSDK from "../../src";
import { GroupRepresentation } from "../../src/types/groups";

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
        // Create a new top-level group
        const newGroup: GroupRepresentation = {
            name: 'Engineering',
            attributes: {
                'department': ['Technology'],
                'location': ['Building A']
            }
        };
        
        await sdk.groups.create(newGroup);
        console.log('Created top-level group: Engineering');
        
        // Get all groups to find the ID of our newly created group
        const groups = await sdk.groups.list();
        const engineeringGroup = groups.find(group => group.name === 'Engineering');
        
        if (engineeringGroup && engineeringGroup.id) {
            // Create a subgroup under the Engineering group
            const subGroup: GroupRepresentation = {
                name: 'Frontend Team',
                attributes: {
                    'team': ['UI/UX', 'Web Development'],
                    'stack': ['React', 'TypeScript']
                }
            };
            
            await sdk.groups.createChild(engineeringGroup.id, subGroup);
            console.log(`Created subgroup 'Frontend Team' under 'Engineering' group`);
            
            // Get the updated group with its subgroups
            const updatedGroup = await sdk.groups.get(engineeringGroup.id);
            console.log('Updated group structure:', JSON.stringify(updatedGroup, null, 2));
        } else {
            console.log('Could not find the Engineering group');
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    }
})();
