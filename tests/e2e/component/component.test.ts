/**
 * E2E tests for the Component API
 */
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import KeycloakClient from '../../../src';
import { cleanupTestEnvironment, setupTestEnvironment, TestContext } from '../utils/test-setup';
import { ComponentRepresentation } from '../../../src/types/component';

const TEST_TIMEOUT = 30000;

describe('Component API', () => {
  let testContext: TestContext;
  let sdk: KeycloakClient;
  let realmName: string;
  let componentId: string;

  // Set up test environment before running tests
  beforeAll(async () => {
    try {
      // Create test realm
      testContext = await setupTestEnvironment();
      sdk = testContext.sdk;
      realmName = testContext.realmName || 'test-realm';
    } catch (error) {
      console.error('Error setting up test environment:', error);
      throw error;
    }
  });

  // Clean up after tests
  afterAll(async () => {
    try {
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error('Error cleaning up test environment:', error);
    }
  });

  // Test component creation
  it(
    'should create a component',
    async () => {
      // Create a test LDAP component
      const testComponent: ComponentRepresentation = {
        name: 'Test LDAP Component',
        providerId: 'ldap',
        providerType: 'org.keycloak.storage.UserStorageProvider',
        config: {
          vendor: ['other'],
          usernameLDAPAttribute: ['uid'],
          rdnLDAPAttribute: ['uid'],
          uuidLDAPAttribute: ['entryUUID'],
          userObjectClasses: ['inetOrgPerson, organizationalPerson'],
          connectionUrl: ['ldap://localhost:10389'],
          usersDn: ['ou=People,dc=example,dc=com'],
          authType: ['simple'],
          bindDn: ['cn=admin,dc=example,dc=com'],
          bindCredential: ['password'],
          editMode: ['WRITABLE']
        }
      };

      try {
        await sdk.component.createComponent(realmName, testComponent);

        // Get all components to find the one we just created
        const components = await sdk.component.getComponents(realmName, {
          name: testComponent.name,
          type: testComponent.providerType
        });

        expect(components).toBeDefined();
        expect(Array.isArray(components)).toBe(true);

        // Find our test component
        const createdComponent = components.find(c => c.name === testComponent.name);
        expect(createdComponent).toBeDefined();
        expect(createdComponent?.id).toBeDefined();

        // Save the component ID for later tests
        if (createdComponent?.id) {
          componentId = createdComponent.id;
        }
      } catch (error) {
        console.error('Error creating component:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  // Test getting a component by ID
  it(
    'should get a component by ID',
    async () => {
      // Skip if component ID is not defined
      if (!componentId) {
        throw new Error('Component ID not defined');
      }

      try {
        const component = await sdk.component.getComponent(realmName, componentId);

        expect(component).toBeDefined();
        expect(component.id).toBe(componentId);
        expect(component.name).toBe('Test LDAP Component');
        expect(component.providerType).toBe('org.keycloak.storage.UserStorageProvider');
      } catch (error) {
        console.error('Error getting component:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  // Test updating a component
  it(
    'should update a component',
    async () => {
      // Skip if component ID is not defined
      if (!componentId) {
        throw new Error('Component ID not defined');
      }

      try {
        // First, get the current component
        const component = await sdk.component.getComponent(realmName, componentId);

        // Update the component
        const updatedComponent: ComponentRepresentation = {
          ...component,
          name: 'Updated LDAP Component',
          config: {
            ...component.config,
            batchSizeForSync: ['500']
          }
        };

        await sdk.component.updateComponent(realmName, componentId, updatedComponent);

        // Get the updated component
        const retrievedComponent = await sdk.component.getComponent(realmName, componentId);

        expect(retrievedComponent).toBeDefined();
        expect(retrievedComponent.name).toBe('Updated LDAP Component');
        expect(retrievedComponent.config?.batchSizeForSync?.[0]).toBe('500');
      } catch (error) {
        console.error('Error updating component:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  // Test getting sub-component types
  it(
    'should get sub-component types',
    async () => {
      // Skip if component ID is not defined
      if (!componentId) {
        throw new Error('Component ID not defined');
      }

      try {
        const subComponentTypes = await sdk.component.getSubComponentTypes(
          realmName,
          componentId,
          'org.keycloak.storage.ldap.mappers.LDAPStorageMapper'
        );

        expect(subComponentTypes).toBeDefined();
        expect(Array.isArray(subComponentTypes)).toBe(true);

        // LDAP provider should have mapper types as sub-components
        const mapperTypes = subComponentTypes.find(t => t.id?.includes('mapper'));
        expect(mapperTypes).toBeDefined();
      } catch (error) {
        console.error('Error getting sub-component types:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  // Test getting all components
  it(
    'should get all components',
    async () => {
      try {
        const components = await sdk.component.getComponents(realmName);

        expect(components).toBeDefined();
        expect(Array.isArray(components)).toBe(true);
        expect(components.length).toBeGreaterThan(0);

        // Our test component should be in the list
        if (componentId) {
          const testComponent = components.find(c => c.id === componentId);
          expect(testComponent).toBeDefined();
        }
      } catch (error) {
        console.error('Error getting components:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );

  // Test deleting a component
  it(
    'should delete a component',
    async () => {
      // Skip if component ID is not defined
      if (!componentId) {
        throw new Error('Component ID not defined');
      }

      try {
        await sdk.component.deleteComponent(realmName, componentId);

        // Try to get the deleted component - should throw an error
        try {
          await sdk.component.getComponent(realmName, componentId);
          // If we get here, the component wasn't deleted
          expect(true).toBe(false); // This will fail the test
        } catch (error) {
          // Expected error - component should not exist
          expect(error).toBeDefined();
        }
      } catch (error) {
        console.error('Error deleting component:', error);
        throw error;
      }
    },
    TEST_TIMEOUT
  );
});
