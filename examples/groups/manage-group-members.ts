/**
 * Example: Manage group members
 * 
 * This example demonstrates how to retrieve and manage members of a group
 * using the Keycloak Admin SDK.
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

/**
 * Display group members with formatted output
 * 
 * @param groupId - The ID of the group
 * @param groupName - The name of the group (for display purposes)
 */
async function displayGroupMembers(groupId: string, groupName: string): Promise<void> {
    const members = await sdk.groups.getMembers(groupId);
    
    console.log(`\n=== Members of '${groupName}' group (${members.length}) ===`);
    
    if (members.length === 0) {
        
        return;
    }
    
    // Display members in a formatted table-like output
    
    console.log('-'.repeat(100));
    
    members.forEach(member => {
        console.log(
            `${member.id?.substring(0, 8)}...\t` +
            `${member.username || 'N/A'}\t\t` +
            `${member.email || 'N/A'}\t\t` +
            `${member.firstName || 'N/A'}\t\t` +
            `${member.lastName || 'N/A'}`
        );
    });
}

(async () => {
    try {
        // Find the Engineering group
        const groupName = 'Engineering';
        const group = await findGroupByName(groupName);
        
        if (!group || !group.id) {
            
            return;
        }
        
        // Get and display current members of the group
        await displayGroupMembers(group.id, groupName);
        
        // Find users that we could add to the group
        // For example, find users with "engineer" in their username or email
        const potentialMembers = await sdk.users.list({
            search: 'engineer',
            max: 5
        });
        
        
        potentialMembers.forEach(user => {
            console.log(`- ${user.username} (${user.email || 'No email'})`);
        });
        
        // Add the first user to the group (if any users were found)
        if (potentialMembers.length > 0 && potentialMembers[0].id) {
            const userId = potentialMembers[0].id;
            const username = potentialMembers[0].username || 'user';
            
            // In the actual user-groups API, we would add the user to the group
            // This is using the user-centric API from the existing GroupsApi in your SDK
            await sdk.users.groups.add(userId, group.id);
            
            
            // Display updated members
            await displayGroupMembers(group.id, groupName);
            
            // Remove the user from the group
            await sdk.users.groups.remove(userId, group.id);
            
            
            // Display final members list
            await displayGroupMembers(group.id, groupName);
        } else {
            
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    }
})();
