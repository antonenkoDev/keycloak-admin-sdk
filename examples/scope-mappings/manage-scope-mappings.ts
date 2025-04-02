/**
 * Scope Mappings API Example
 * 
 * This example demonstrates how to use the Scope Mappings API to manage scope mappings
 * for clients and client scopes in Keycloak.
 * 
 * It shows how to:
 * - Get all scope mappings for a client
 * - Get realm-level scope mappings for a client
 * - Add realm-level scope mappings to a client
 * - Delete realm-level scope mappings from a client
 * - Get client-level scope mappings
 * - Add client-level scope mappings
 * - Delete client-level scope mappings
 * - Work with client scopes and client templates
 */

import KeycloakAdminSDK from '../../src';
import { config } from '../config';

// Create the Keycloak Admin SDK instance
const sdk = new KeycloakAdminSDK(config);

async function main() {
  try {
    console.log('Starting Scope Mappings API example...');
    
    // Find the first client to use for this example
    const clients = await sdk.clients.findAll();
    if (clients.length === 0) {
      throw new Error('No clients found in the realm');
    }
    
    const client = clients[0];
    console.log(`Using client: ${client.clientId} (${client.id})`);
    
    // Create a test role to use in scope mappings
    const testRoleName = `test-scope-role-${Date.now()}`;
    const testRole = {
      name: testRoleName,
      description: 'Test role for scope mappings example'
    };
    
    const roleId = await sdk.roles.create(testRole);
    console.log(`Created test role: ${testRoleName} (${roleId})`);
    
    // Get the role details
    const role = await sdk.roles.getByName(testRoleName);
    if (!role) {
      throw new Error(`Role ${testRoleName} not found`);
    }
    
    // Create a client scope to use in this example
    const testClientScopeName = `test-client-scope-${Date.now()}`;
    const testClientScope = {
      name: testClientScopeName,
      protocol: 'openid-connect',
      description: 'Test client scope for scope mappings example'
    };
    
    const clientScopeId = await sdk.clientScopes.create(testClientScope);
    console.log(`Created test client scope: ${testClientScopeName} (${clientScopeId})`);
    
    // Step 1: Work with client scope mappings
    console.log('\n--- Client Scope Mappings ---');
    
    // Get scope mappings API for the client
    const clientScopeMappings = sdk.scopeMappings.forClient(client.id!);
    
    // Get all scope mappings for the client
    console.log('Getting all scope mappings for the client...');
    const allMappings = await clientScopeMappings.getAll();
    console.log('All scope mappings:', JSON.stringify(allMappings, null, 2));
    
    // Get realm-level scope mappings
    console.log('\nGetting realm-level scope mappings...');
    const realmScopeMappings = await clientScopeMappings.getRealmScopeMappings();
    console.log('Realm scope mappings:', realmScopeMappings.length);
    
    // Get available realm-level scope mappings
    console.log('\nGetting available realm-level scope mappings...');
    const availableRealmScopeMappings = await clientScopeMappings.getAvailableRealmScopeMappings();
    console.log('Available realm scope mappings:', availableRealmScopeMappings.length);
    
    // Add realm-level scope mappings
    console.log('\nAdding realm-level scope mappings...');
    await clientScopeMappings.addRealmScopeMappings([role]);
    console.log('Added realm scope mapping for role:', role.name);
    
    // Get effective realm-level scope mappings
    console.log('\nGetting effective realm-level scope mappings...');
    const effectiveRealmScopeMappings = await clientScopeMappings.getEffectiveRealmScopeMappings();
    console.log('Effective realm scope mappings:', effectiveRealmScopeMappings.length);
    
    // Delete realm-level scope mappings
    console.log('\nDeleting realm-level scope mappings...');
    await clientScopeMappings.deleteRealmScopeMappings([role]);
    console.log('Deleted realm scope mapping for role:', role.name);
    
    // Step 2: Work with client-level scope mappings
    console.log('\n--- Client-level Scope Mappings ---');
    
    // Find another client to use for client-level scope mappings
    const targetClient = clients.find(c => c.id !== client.id);
    if (!targetClient || !targetClient.id) {
      console.log('No other client found for client-level scope mappings example');
    } else {
      console.log(`Using target client: ${targetClient.clientId} (${targetClient.id})`);
      
      // Create a role in the target client
      const testClientRoleName = `test-client-role-${Date.now()}`;
      const testClientRole = {
        name: testClientRoleName,
        description: 'Test client role for scope mappings example'
      };
      
      await sdk.clients.createRole(targetClient.id, testClientRole);
      const clientRole = await sdk.clients.getRole(targetClient.id, testClientRoleName);
      console.log(`Created test client role: ${clientRole.name} (${clientRole.id})`);
      
      // Get available client-level scope mappings
      console.log('\nGetting available client-level scope mappings...');
      const availableClientScopeMappings = await clientScopeMappings.getAvailableClientScopeMappings(targetClient.id);
      console.log('Available client scope mappings:', availableClientScopeMappings.length);
      
      // Add client-level scope mappings
      console.log('\nAdding client-level scope mappings...');
      await clientScopeMappings.addClientScopeMappings(targetClient.id, [clientRole]);
      console.log('Added client scope mapping for role:', clientRole.name);
      
      // Get client-level scope mappings
      console.log('\nGetting client-level scope mappings...');
      const clientLevelScopeMappings = await clientScopeMappings.getClientScopeMappings(targetClient.id);
      console.log('Client-level scope mappings:', clientLevelScopeMappings.length);
      
      // Get effective client-level scope mappings
      console.log('\nGetting effective client-level scope mappings...');
      const effectiveClientScopeMappings = await clientScopeMappings.getEffectiveClientScopeMappings(targetClient.id);
      console.log('Effective client scope mappings:', effectiveClientScopeMappings.length);
      
      // Delete client-level scope mappings
      console.log('\nDeleting client-level scope mappings...');
      await clientScopeMappings.deleteClientScopeMappings(targetClient.id, [clientRole]);
      console.log('Deleted client scope mapping for role:', clientRole.name);
      
      // Clean up client role
      console.log('\nCleaning up client role...');
      await sdk.clients.deleteRole(targetClient.id, clientRole.id!);
      console.log('Deleted client role:', clientRole.name);
    }
    
    // Step 3: Work with client scope's scope mappings
    console.log('\n--- Client Scope\'s Scope Mappings ---');
    
    // Get scope mappings API for the client scope
    const clientScopeScopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
    
    // Get all scope mappings for the client scope
    console.log('Getting all scope mappings for the client scope...');
    const allClientScopeMappings = await clientScopeScopeMappings.getAll();
    console.log('All client scope mappings:', JSON.stringify(allClientScopeMappings, null, 2));
    
    // Add realm-level scope mappings to the client scope
    console.log('\nAdding realm-level scope mappings to the client scope...');
    await clientScopeScopeMappings.addRealmScopeMappings([role]);
    console.log('Added realm scope mapping for role:', role.name);
    
    // Get realm-level scope mappings for the client scope
    console.log('\nGetting realm-level scope mappings for the client scope...');
    const clientScopeRealmMappings = await clientScopeScopeMappings.getRealmScopeMappings();
    console.log('Client scope realm mappings:', clientScopeRealmMappings.length);
    
    // Delete realm-level scope mappings from the client scope
    console.log('\nDeleting realm-level scope mappings from the client scope...');
    await clientScopeScopeMappings.deleteRealmScopeMappings([role]);
    console.log('Deleted realm scope mapping for role:', role.name);
    
    // Clean up
    console.log('\n--- Cleaning Up ---');
    
    // Delete the test role
    console.log('Deleting test role...');
    await sdk.roles.delete(testRoleName);
    console.log('Deleted role:', testRoleName);
    
    // Delete the test client scope
    console.log('Deleting test client scope...');
    await sdk.clientScopes.delete(clientScopeId);
    console.log('Deleted client scope:', testClientScopeName);
    
    console.log('\nScope Mappings API example completed successfully!');
  } catch (error) {
    console.error('Error in Scope Mappings API example:', error);
  }
}

// Run the example
main().catch(console.error);
