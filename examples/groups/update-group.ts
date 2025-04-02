/**
 * Example: Update a group
 * 
 * This example demonstrates how to update an existing group's
 * attributes and properties using the Keycloak Admin SDK.
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

/**
 * Find a group by name
 * 
 * @param name - The name of the group to find
 * @returns The group if found, undefined otherwise
 */
async function findGroupByName(name: string): Promise<GroupRepresentation | undefined> {
    const groups = await sdk.groups.list();
    return groups.find(group => group.name === name);
}

(async () => {
    try {
        // Find the group we want to update
        const groupName = 'Engineering';
        const group = await findGroupByName(groupName);
        
        if (!group || !group.id) {
            console.log(`Group '${groupName}' not found. Please create it first.`);
            return;
        }
        
        // Get the current group details
        const currentGroup = await sdk.groups.get(group.id);
        console.log('Current group details:', JSON.stringify(currentGroup, null, 2));
        
        // Update the group with new attributes
        const updatedGroup: GroupRepresentation = {
            ...currentGroup,
            name: currentGroup.name, // Keep the same name
            attributes: {
                ...(currentGroup.attributes || {}),
                'department': ['Technology'],
                'location': ['Building B'], // Changed from Building A to Building B
                'priority': ['High'],       // Added new attribute
            },
            // Add realm roles if needed
            realmRoles: ['offline_access', 'uma_authorization']
        };
        
        // Update the group
        await sdk.groups.update(group.id, updatedGroup);
        console.log(`Group '${groupName}' updated successfully`);
        
        // Get the updated group to verify changes
        const verifyGroup = await sdk.groups.get(group.id);
        console.log('Updated group details:', JSON.stringify(verifyGroup, null, 2));
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    }
})();
