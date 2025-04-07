/**
 * Example demonstrating the use of certificate management APIs in Keycloak Admin SDK
 *
 * This example shows how to:
 * 1. Get certificate information for a client
 * 2. Generate a new certificate
 * 3. Upload a certificate
 * 4. Download a keystore
 * 5. Manage client initial access tokens
 */

import KeycloakClient from '../src';
import { KeyStoreConfig } from '../src/types/certificates';
import { loadConfig } from './config';
import fs from 'fs';
import path from 'path';

async function certificatesExample() {
  try {
    // Load configuration from environment or config file
    const config = loadConfig();

    // Initialize the SDK
    const sdk = new KeycloakClient(config);

    console.log('Starting certificate management example...');

    // Create a test client for demonstration
    console.log('Creating test client...');
    const clientId = `test-client-${Date.now()}`;
    const clientUuid = await sdk.clients.create({
      clientId,
      name: 'Test Client for Certificate Management',
      protocol: 'openid-connect',
      publicClient: false,
      serviceAccountsEnabled: true,
      standardFlowEnabled: true
    });

    console.log(`Created client with UUID: ${clientUuid}`);

    try {
      // 1. Get certificate information for the client
      console.log('\nGetting certificate info...');
      const certInfo = await sdk.certificates.clientCertificates.getCertificateInfo(
        clientUuid,
        'jwt.credential'
      );
      console.log('Current certificate info:', certInfo);

      // 2. Generate a new certificate
      console.log('\nGenerating new certificate...');
      const newCert = await sdk.certificates.clientCertificates.generateCertificate(
        clientUuid,
        'jwt.credential'
      );
      console.log('Generated new certificate:', {
        algorithm: newCert.algorithm,
        keyType: newCert.keyType,
        keySize: newCert.keySize,
        notBefore: new Date(newCert.notBefore || 0).toISOString(),
        notAfter: new Date(newCert.notAfter || 0).toISOString()
      });

      // 3. Create a keystore configuration
      const keystoreConfig: KeyStoreConfig = {
        format: 'JKS',
        keyAlias: 'test-key',
        keyPassword: 'password',
        storePassword: 'password',
        keySize: 2048
      };

      // 4. Download the keystore
      console.log('\nDownloading keystore...');
      const keystore = await sdk.certificates.clientCertificates.downloadKeystore(
        clientUuid,
        'jwt.credential',
        keystoreConfig
      );

      // Save the keystore to a file
      const keystorePath = path.join(__dirname, `${clientId}-keystore.jks`);
      fs.writeFileSync(keystorePath, Buffer.from(keystore));
      console.log(`Keystore saved to: ${keystorePath}`);

      // 5. Manage client initial access tokens
      console.log('\nCreating client initial access token...');
      const tokenConfig = {
        expiration: 86400, // 24 hours
        count: 5 // Can be used 5 times
      };

      const accessToken = await sdk.clientInitialAccess.create(tokenConfig);
      console.log('Created initial access token:', {
        id: accessToken.id,
        token: accessToken.token?.substring(0, 10) + '...',
        expiration: accessToken.expiration,
        count: accessToken.count
      });

      // List all initial access tokens
      console.log('\nListing all initial access tokens...');
      const tokens = await sdk.clientInitialAccess.findAll();
      console.log(`Found ${tokens.length} tokens`);

      // Delete the token we just created
      if (accessToken.id) {
        console.log(`\nDeleting token with ID: ${accessToken.id}`);
        await sdk.clientInitialAccess.delete(accessToken.id);
        console.log('Token deleted successfully');
      }

      // 6. Get client registration policy providers
      console.log('\nGetting client registration policy providers...');
      const providers = await sdk.clientRegistrationPolicy.getProviders();
      console.log(`Found ${providers.length} registration policy providers`);
      providers.forEach(provider => {
        console.log(`- ${provider.name}`);
      });
    } finally {
      // Clean up - delete the test client
      console.log('\nCleaning up - deleting test client...');
      await sdk.clients.delete(clientUuid);
      console.log('Test client deleted successfully');

      // Remove the keystore file if it exists
      const keystorePath = path.join(__dirname, `${clientId}-keystore.jks`);
      if (fs.existsSync(keystorePath)) {
        fs.unlinkSync(keystorePath);
        console.log('Keystore file deleted');
      }
    }

    console.log('\nCertificate management example completed successfully');
  } catch (error) {
    // Comprehensive error handling with detailed context
    console.error('Error in certificate management example:');
    if (error instanceof Error) {
      console.error(`- Message: ${error.message}`);
      console.error(`- Stack: ${error.stack}`);
    } else {
      console.error(`- Unknown error: ${String(error)}`);
    }
    process.exit(1);
  }
}

// Run the example
certificatesExample();
