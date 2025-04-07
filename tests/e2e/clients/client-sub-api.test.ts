/**
 * End-to-End Tests for Certificate Management APIs
 *
 * Tests the functionality of the Certificate Management APIs against a running Keycloak instance
 */

import {
  cleanupTestEnvironment,
  createTestClient,
  setupTestEnvironment,
  TEST_TIMEOUT,
  TestContext
} from '../utils/test-setup';
import {
  ClientInitialAccessCreatePresentation,
  KeyStoreConfig
} from '../../../src/types/certificates';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Certificate Management APIs E2E Tests', () => {
  let testContext: TestContext;
  let testClientId: string | undefined;
  let testInitialAccessId: string | undefined;
  let keystorePath: string | undefined;

  // Setup test environment before all tests
  beforeAll(async () => {
    try {
      testContext = await setupTestEnvironment();

      // Create test client to ensure we have a valid realm and client for certificate operations
      testContext = await createTestClient(testContext);

      // Verify that client was created successfully
      if (!testContext.clientId) {
        throw new Error('Test client was not created properly');
      }

      testClientId = testContext.clientId;

      // Create a temporary directory for test files if it doesn't exist
      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
    } catch (error) {
      console.error(
        `Error in test setup: ${error instanceof Error ? error.message : String(error)}`
      );
      // We don't throw here to allow tests to run, they will handle missing client ID
    }
  }, TEST_TIMEOUT);

  // Clean up test environment after all tests
  afterAll(async () => {
    try {
      // Clean up test initial access token if it was created
      if (testInitialAccessId) {
        try {
          await testContext.sdk.clients.initialAccess.delete(testInitialAccessId);
        } catch (error) {
          console.error(
            `Error deleting test initial access token: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      // Remove any keystore files created during tests
      if (keystorePath && fs.existsSync(keystorePath)) {
        try {
          fs.unlinkSync(keystorePath);
        } catch (error) {
          console.error(
            `Error deleting keystore file: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      // Clean up test environment
      await cleanupTestEnvironment(testContext);
    } catch (error) {
      console.error(
        `Error in test cleanup: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }, TEST_TIMEOUT);

  /**
   * Test generating a new certificate for a client
   */
  test('should generate a new certificate for a client', async () => {
    // Skip test if no client ID is available
    if (!testClientId) {
      throw new Error('Test client ID is not defined');
    }

    try {
      // Generate a new certificate for the client
      const newCert = await testContext.sdk.clients.certificates.generateCertificate(
        testClientId,
        'jwt.credential'
      );

      // Verify that a new certificate was generated
      expect(newCert).toBeDefined();
      expect(newCert.certificate).toBeDefined();

      // Basic validation of certificate properties
      expect(newCert.certificate).toBeDefined();
      expect(typeof newCert.certificate).toBe('string');
    } catch (error) {
      console.error(
        `Error generating certificate: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test getting certificate info for a client
   */
  test('should get certificate info for a client', async () => {
    // Skip test if no client ID is available
    if (!testClientId) {
      throw new Error('Test client ID is not defined');
    }

    try {
      // Get certificate info for the client
      const certInfo = await testContext.sdk.clients.certificates.getCertificateInfo(
        testClientId,
        'jwt.credential'
      );

      // Verify that certificate info was returned
      expect(certInfo).toBeDefined();
      expect(certInfo.certificate).toBeDefined();

      // Basic validation of certificate properties
      expect(certInfo.certificate).toBeDefined();
      expect(typeof certInfo.certificate).toBe('string');
    } catch (error) {
      console.error(
        `Error getting certificate info: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test downloading a keystore for a client
   */
  test('should download a keystore for a client', async () => {
    // Skip test if no client ID is available
    if (!testClientId) {
      throw new Error('Test client ID is not defined');
    }

    try {
      // Create a keystore configuration
      const keystoreConfig: KeyStoreConfig = {
        format: 'JKS',
        keyAlias: 'test-key',
        keyPassword: 'password',
        storePassword: 'password'
      };

      // Download the keystore
      const keystore = await testContext.sdk.clients.certificates.downloadKeystore(
        testClientId,
        'jwt.credential',
        keystoreConfig
      );

      // Verify that keystore data was returned
      expect(keystore).toBeDefined();

      // Save the keystore to a file for further testing
      keystorePath = path.join(__dirname, 'temp', `test-keystore-${Date.now()}.jks`);
      fs.writeFileSync(keystorePath, Buffer.from(keystore));

      // Verify that the file was created
      expect(fs.existsSync(keystorePath)).toBe(true);

      // Verify that the file has content
      const fileStats = fs.statSync(keystorePath);
      expect(fileStats.size).toBeGreaterThan(0);
    } catch (error) {
      console.error(
        `Error downloading keystore: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test creating and managing client initial access tokens
   */
  test('should create and manage client initial access tokens', async () => {
    try {
      // Create a client initial access token
      const tokenConfig: ClientInitialAccessCreatePresentation = {
        expiration: 86400, // 24 hours
        count: 5 // Can be used 5 times
      };

      const accessToken = await testContext.sdk.clients.initialAccess.create(tokenConfig);

      // Verify that the token was created
      expect(accessToken).toBeDefined();
      expect(accessToken.id).toBeDefined();
      expect(accessToken.token).toBeDefined();
      expect(accessToken.expiration).toBe(86400);
      expect(accessToken.count).toBe(5);

      // Save the token ID for cleanup
      testInitialAccessId = accessToken.id;

      // List all initial access tokens
      const tokens = await testContext.sdk.clients.initialAccess.findAll();

      // Verify that tokens were returned
      expect(tokens).toBeDefined();
      expect(Array.isArray(tokens)).toBe(true);

      // Verify that our token is in the list
      const createdToken = tokens.find(token => token.id === testInitialAccessId);
      expect(createdToken).toBeDefined();

      // Verify that the token in the list doesn't contain the actual token value
      // This is a security feature of Keycloak
      expect(createdToken?.token).toBeUndefined();

      // Delete the token
      await testContext.sdk.clients.initialAccess.delete(testInitialAccessId!);

      // Verify that the token was deleted
      const tokensAfterDelete = await testContext.sdk.clients.initialAccess.findAll();
      const deletedToken = tokensAfterDelete.find(token => token.id === testInitialAccessId);
      expect(deletedToken).toBeUndefined();

      // Reset the test token ID since it's been deleted
      testInitialAccessId = undefined;
    } catch (error) {
      console.error(
        `Error managing initial access tokens: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });

  /**
   * Test getting client registration policy providers
   */
  test('should get client registration policy providers', async () => {
    try {
      // Get client registration policy providers
      const providers = await testContext.sdk.clients.registrationPolicy.getProviders();

      // Verify that providers were returned
      expect(providers).toBeDefined();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);

      // Verify that each provider has required properties
      providers.forEach(provider => {
        expect(provider.id).toBeDefined();
        expect(provider.helpText).toBeDefined();
      });

      // Verify that common providers are present
      const providerIds = providers.map(provider => provider.id);
      expect(providerIds).toContain('trusted-hosts');
      expect(providerIds).toContain('consent-required');
    } catch (error) {
      console.error(
        `Error getting registration policy providers: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  });
});
