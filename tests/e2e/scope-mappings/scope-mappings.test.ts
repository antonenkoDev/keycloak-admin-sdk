/**
 * Scope Mappings API E2E Tests
 *
 * This module contains end-to-end tests for the Scope Mappings API.
 * It follows SOLID principles and clean code practices.
 */

import KeycloakAdminSDK from '../../../src';
import { RoleRepresentation } from '../../../src/types/roles';
import { ClientRepresentation } from '../../../src/types/clients';
import { cleanupTestEnvironment, setupTestEnvironment } from '../utils/test-setup'; // Test variables

// Test variables
let sdk: KeycloakAdminSDK;
let testRealmName: string;
let clientId: string;
let targetClientId: string;
let clientScopeId: string;
let roleId: string;
let clientRoleId: string;
let role: RoleRepresentation;
let clientRole: RoleRepresentation;

describe('Scope Mappings API E2E Tests', () => {
  beforeAll(async () => {
    // Setup test environment
    const setup = await setupTestEnvironment();
    sdk = setup.sdk;
    testRealmName = setup.testRealmName;

    // Create a test client
    const testClient: ClientRepresentation = {
      clientId: `test-client-${Date.now()}`,
      name: 'Test Client for Scope Mappings',
      description: 'Test client for scope mappings API tests',
      enabled: true,
      protocol: 'openid-connect',
      publicClient: false,
      directAccessGrantsEnabled: true
    };

    clientId = await sdk.clients.create(testClient);

    // Create a target client for client-level scope mappings
    const targetClient: ClientRepresentation = {
      clientId: `target-client-${Date.now()}`,
      name: 'Target Client for Scope Mappings',
      description: 'Target client for scope mappings API tests',
      enabled: true,
      protocol: 'openid-connect',
      publicClient: false,
      directAccessGrantsEnabled: true
    };

    targetClientId = await sdk.clients.create(targetClient);

    // Create a test client scope
    const testClientScope = {
      name: `test-client-scope-${Date.now()}`,
      protocol: 'openid-connect',
      description: 'Test client scope for scope mappings API tests'
    };

    clientScopeId = await sdk.clientScopes.create(testClientScope);

    // Create a test role
    const testRole = {
      name: `test-role-${Date.now()}`,
      description: 'Test role for scope mappings API tests'
    };

    roleId = await sdk.roles.create(testRole);
    role = await sdk.roles.getByName(testRole.name!);

    // Create a test client role
    const testClientRole = {
      name: `test-client-role-${Date.now()}`,
      description: 'Test client role for scope mappings API tests'
    };

    await sdk.clients.createRole(targetClientId, testClientRole);
    clientRole = await sdk.clients.getRole(targetClientId, testClientRole.name!);
    clientRoleId = clientRole.id!;
  });

  afterAll(async () => {
    // Clean up test resources
    if (clientId) {
      await sdk.clients.delete(clientId);
    }

    if (targetClientId) {
      await sdk.clients.delete(targetClientId);
    }

    if (clientScopeId) {
      await sdk.clientScopes.delete(clientScopeId);
    }

    if (role && role.name) {
      await sdk.roles.delete(role.name);
    }

    // Clean up test environment
    await cleanupTestEnvironment({ sdk, realmName: testRealmName });
  });

  describe('Client Scope Mappings', () => {
    test('should get all scope mappings for a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      const allMappings = await clientScopeMappings.getAll();

      expect(allMappings).toBeDefined();
      expect(typeof allMappings).toBe('object');
    });

    test('should get available realm scope mappings for a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      const availableMappings = await clientScopeMappings.getAvailableRealmScopeMappings();

      expect(availableMappings).toBeDefined();
      expect(Array.isArray(availableMappings)).toBe(true);
    });

    test('should add realm scope mappings to a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      await clientScopeMappings.addRealmScopeMappings([role]);

      const mappings = await clientScopeMappings.getRealmScopeMappings();
      const addedRole = mappings.find(r => r.id === roleId);

      expect(addedRole).toBeDefined();
      expect(addedRole?.name).toBe(role.name);
    });

    test('should get effective realm scope mappings for a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      const effectiveMappings = await clientScopeMappings.getEffectiveRealmScopeMappings();

      expect(effectiveMappings).toBeDefined();
      expect(Array.isArray(effectiveMappings)).toBe(true);

      const addedRole = effectiveMappings.find(r => r.id === roleId);
      expect(addedRole).toBeDefined();
    });

    test('should delete realm scope mappings from a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      await clientScopeMappings.deleteRealmScopeMappings([role]);

      const mappings = await clientScopeMappings.getRealmScopeMappings();
      const deletedRole = mappings.find(r => r.id === roleId);

      expect(deletedRole).toBeUndefined();
    });

    test('should get available client scope mappings for a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      const availableMappings =
        await clientScopeMappings.getAvailableClientScopeMappings(targetClientId);

      expect(availableMappings).toBeDefined();
      expect(Array.isArray(availableMappings)).toBe(true);
    });

    test('should add client scope mappings to a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      await clientScopeMappings.addClientScopeMappings(targetClientId, [clientRole]);

      const mappings = await clientScopeMappings.getClientScopeMappings(targetClientId);
      const addedRole = mappings.find(r => r.id === clientRoleId);

      expect(addedRole).toBeDefined();
      expect(addedRole?.name).toBe(clientRole.name);
    });

    test('should get effective client scope mappings for a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      const effectiveMappings =
        await clientScopeMappings.getEffectiveClientScopeMappings(targetClientId);

      expect(effectiveMappings).toBeDefined();
      expect(Array.isArray(effectiveMappings)).toBe(true);

      const addedRole = effectiveMappings.find(r => r.id === clientRoleId);
      expect(addedRole).toBeDefined();
    });

    test('should delete client scope mappings from a client', async () => {
      const clientScopeMappings = sdk.scopeMappings.forClient(clientId);
      await clientScopeMappings.deleteClientScopeMappings(targetClientId, [clientRole]);

      const mappings = await clientScopeMappings.getClientScopeMappings(targetClientId);
      const deletedRole = mappings.find(r => r.id === clientRoleId);

      expect(deletedRole).toBeUndefined();
    });
  });

  describe("Client Scope's Scope Mappings", () => {
    test('should get all scope mappings for a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      const allMappings = await scopeMappings.getAll();

      expect(allMappings).toBeDefined();
      expect(typeof allMappings).toBe('object');
    });

    test('should get available realm scope mappings for a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      const availableMappings = await scopeMappings.getAvailableRealmScopeMappings();

      expect(availableMappings).toBeDefined();
      expect(Array.isArray(availableMappings)).toBe(true);
    });

    test('should add realm scope mappings to a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      await scopeMappings.addRealmScopeMappings([role]);

      const mappings = await scopeMappings.getRealmScopeMappings();
      const addedRole = mappings.find(r => r.id === roleId);

      expect(addedRole).toBeDefined();
      expect(addedRole?.name).toBe(role.name);
    });

    test('should get effective realm scope mappings for a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      const effectiveMappings = await scopeMappings.getEffectiveRealmScopeMappings();

      expect(effectiveMappings).toBeDefined();
      expect(Array.isArray(effectiveMappings)).toBe(true);

      const addedRole = effectiveMappings.find(r => r.id === roleId);
      expect(addedRole).toBeDefined();
    });

    test('should delete realm scope mappings from a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      await scopeMappings.deleteRealmScopeMappings([role]);

      const mappings = await scopeMappings.getRealmScopeMappings();
      const deletedRole = mappings.find(r => r.id === roleId);

      expect(deletedRole).toBeUndefined();
    });

    test('should add client scope mappings to a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      await scopeMappings.addClientScopeMappings(targetClientId, [clientRole]);

      const mappings = await scopeMappings.getClientScopeMappings(targetClientId);
      const addedRole = mappings.find(r => r.id === clientRoleId);

      expect(addedRole).toBeDefined();
      expect(addedRole?.name).toBe(clientRole.name);
    });

    test('should delete client scope mappings from a client scope', async () => {
      const scopeMappings = sdk.scopeMappings.forClientScope(clientScopeId);
      await scopeMappings.deleteClientScopeMappings(targetClientId, [clientRole]);

      const mappings = await scopeMappings.getClientScopeMappings(targetClientId);
      const deletedRole = mappings.find(r => r.id === clientRoleId);

      expect(deletedRole).toBeUndefined();
    });
  });
});
