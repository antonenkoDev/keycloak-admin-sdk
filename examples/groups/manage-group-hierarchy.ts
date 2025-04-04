/**
 * Example: Manage group hierarchy
 * 
 * This example demonstrates how to create and manage a complex group hierarchy
 * including nested subgroups and permissions using the Keycloak Admin SDK.
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
 * Create a complete organizational structure with nested groups
 * This demonstrates creating a complex hierarchy in a single operation
 */
async function createOrganizationalStructure(): Promise<void> {
    try {
        // Create the top-level "Company" group
        const companyGroup: GroupRepresentation = {
            name: 'Company',
            attributes: {
                'type': ['Organization'],
                'established': ['2020']
            }
        };
        
        await sdk.groups.create(companyGroup);

        // Find the Company group to get its ID
        const groups = await sdk.groups.list();
        const companyGroupObj = groups.find(g => g.name === 'Company');
        
        if (!companyGroupObj || !companyGroupObj.id) {
            throw new Error('Failed to find Company group after creation');
        }
        
        const companyGroupId = companyGroupObj.id;
        
        // Create department groups under Company
        const departments = [
            {
                name: 'Engineering',
                attributes: { 'department': ['Technical'], 'headcount': ['150'] }
            },
            {
                name: 'Marketing',
                attributes: { 'department': ['Business'], 'headcount': ['45'] }
            },
            {
                name: 'Finance',
                attributes: { 'department': ['Business'], 'headcount': ['30'] }
            },
            {
                name: 'Human Resources',
                attributes: { 'department': ['Operations'], 'headcount': ['25'] }
            }
        ];
        
        // Create all department groups
        const departmentIds: Record<string, string> = {};
        
        for (const dept of departments) {
            await sdk.groups.createChild(companyGroupId, dept);
            
        }
        
        // Get updated company group with subgroups
        const updatedCompanyGroup = await sdk.groups.get(companyGroupId);
        
        // Store department IDs for later use
        if (updatedCompanyGroup.subGroups) {
            for (const dept of updatedCompanyGroup.subGroups) {
                if (dept.name && dept.id) {
                    departmentIds[dept.name] = dept.id;
                }
            }
        }
        
        // Create teams under Engineering department
        if (departmentIds['Engineering']) {
            const engineeringTeams = [
                {
                    name: 'Frontend',
                    attributes: { 'team': ['Development'], 'stack': ['React', 'TypeScript'] }
                },
                {
                    name: 'Backend',
                    attributes: { 'team': ['Development'], 'stack': ['Node.js', 'Java'] }
                },
                {
                    name: 'DevOps',
                    attributes: { 'team': ['Operations'], 'stack': ['Kubernetes', 'Docker'] }
                },
                {
                    name: 'QA',
                    attributes: { 'team': ['Quality'], 'stack': ['Selenium', 'Jest'] }
                }
            ];
            
            for (const team of engineeringTeams) {
                await sdk.groups.createChild(departmentIds['Engineering'], team);
                
            }
        }
        
        // Create teams under Marketing department
        if (departmentIds['Marketing']) {
            const marketingTeams = [
                {
                    name: 'Digital',
                    attributes: { 'team': ['Marketing'], 'focus': ['Online'] }
                },
                {
                    name: 'Content',
                    attributes: { 'team': ['Marketing'], 'focus': ['Blog', 'Social'] }
                }
            ];
            
            for (const team of marketingTeams) {
                await sdk.groups.createChild(departmentIds['Marketing'], team);
                
            }
        }
        
        
    } catch (error) {
        console.error('Error creating organizational structure:', 
            error instanceof Error ? error.message : String(error));
        throw error;
    }
}

/**
 * Display the complete group hierarchy in a tree-like format
 */
async function displayGroupHierarchy(): Promise<void> {
    try {
        // Get all groups with full hierarchy
        const groups = await sdk.groups.list({ 
            briefRepresentation: false,
            populateHierarchy: true
        });
        
        
        
        // Display groups in a tree-like structure
        function printGroup(group: GroupRepresentation, level: number = 0): void {
            const indent = '  '.repeat(level);
            const prefix = level > 0 ? '└─ ' : '';
            
            
            // Print attributes if they exist
            if (group.attributes && Object.keys(group.attributes).length > 0) {
                console.log(`${indent}   Attributes: ${JSON.stringify(group.attributes)}`);
            }
            
            // Print subgroups recursively
            if (group.subGroups && group.subGroups.length > 0) {
                group.subGroups.forEach(subGroup => {
                    printGroup(subGroup, level + 1);
                });
            }
        }
        
        // Print each top-level group and its hierarchy
        groups.forEach(group => {
            printGroup(group);
        });
    } catch (error) {
        console.error('Error displaying group hierarchy:', 
            error instanceof Error ? error.message : String(error));
    }
}

/**
 * Set management permissions for a group
 * 
 * @param groupId - The ID of the group
 */
async function setGroupPermissions(groupId: string): Promise<void> {
    try {
        // Get current permissions
        const currentPermissions = await sdk.groups.getManagementPermissions(groupId);
        console.log('Current permissions:', JSON.stringify(currentPermissions, null, 2));
        
        // Enable permissions
        const updatedPermissions = {
            enabled: true,
            resource: currentPermissions.resource,
            scopePermissions: currentPermissions.scopePermissions
        };
        
        const result = await sdk.groups.setManagementPermissions(groupId, updatedPermissions);
        console.log('Updated permissions:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error setting group permissions:', 
            error instanceof Error ? error.message : String(error));
    }
}

/**
 * Clean up by deleting the organizational structure
 */
async function cleanupOrganizationalStructure(): Promise<void> {
    try {
        // Find the Company group
        const groups = await sdk.groups.list();
        const companyGroup = groups.find(g => g.name === 'Company');
        
        if (companyGroup && companyGroup.id) {
            // Delete the Company group (this will delete all subgroups as well)
            await sdk.groups.delete(companyGroup.id);
            
        } else {
            
        }
    } catch (error) {
        console.error('Error cleaning up organizational structure:', 
            error instanceof Error ? error.message : String(error));
    }
}

// Main execution
(async () => {
    try {
        // Check if Company group already exists
        const existingGroups = await sdk.groups.list();
        const companyExists = existingGroups.some(g => g.name === 'Company');
        
        if (companyExists) {
            
            await cleanupOrganizationalStructure();
        }
        
        // Create the organizational structure
        await createOrganizationalStructure();
        
        // Display the complete hierarchy
        await displayGroupHierarchy();
        
        // Set permissions on the Engineering group
        const groups = await sdk.groups.list();
        const companyGroup = groups.find(g => g.name === 'Company');
        
        if (companyGroup && companyGroup.id) {
            // Get the updated company group with subgroups
            const updatedCompanyGroup = await sdk.groups.get(companyGroup.id);
            
            if (updatedCompanyGroup.subGroups) {
                const engineeringGroup = updatedCompanyGroup.subGroups.find(g => g.name === 'Engineering');
                
                if (engineeringGroup && engineeringGroup.id) {
                    
                    await setGroupPermissions(engineeringGroup.id);
                }
            }
        }
        
        // Uncomment the following line if you want to clean up after running the example
        // await cleanupOrganizationalStructure();
        
    } catch (error) {
        console.error('Error in main execution:', error instanceof Error ? error.message : String(error));
    }
})();
