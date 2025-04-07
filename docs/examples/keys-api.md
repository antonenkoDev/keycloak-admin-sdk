# Keys API Examples

The Keys API provides methods for retrieving cryptographic keys from Keycloak. These keys are used for signing tokens and other cryptographic operations.

## Getting Keys Metadata

You can retrieve all keys metadata from a realm using the `getKeys()` method:

```typescript
import KeycloakClient from 'keycloak-admin-sdk';
import { KeysMetadataRepresentation } from 'keycloak-admin-sdk/types/keys';

// Initialize the SDK
const sdk = new KeycloakClient({
  baseUrl: 'https://your-keycloak-instance.com',
  realm: 'your-realm',
  credentials: {
    grantType: 'password',
    clientId: 'admin-cli',
    username: 'admin',
    password: 'password'
  }
});

// Get keys metadata
async function getKeysMetadata() {
  try {
    const keysMetadata: KeysMetadataRepresentation = await sdk.keys.getKeys();
    
    // Access active keys
    
    
    // Access all keys
    keysMetadata.keys?.forEach(key => {
      
      
      
      
      
      
    });
    
    return keysMetadata;
  } catch (error) {
    console.error('Failed to get keys metadata:', error);
    throw error;
  }
}
```

## Working with Key Information

The keys metadata contains information about all keys in the realm, including:

- Active keys by algorithm
- Key IDs (kid)
- Algorithms
- Key types (RSA, EC, etc.)
- Usage (signing, encryption)
- Public keys and certificates

### Example: Finding a Specific Key

```typescript
async function findKeyById(keyId: string) {
  const keysMetadata = await sdk.keys.getKeys();
  const key = keysMetadata.keys?.find(k => k.kid === keyId);
  
  if (key) {
    
    return key;
  } else {
    
    return null;
  }
}
```

### Example: Getting the Active Signing Key

```typescript
async function getActiveSigningKey() {
  const keysMetadata = await sdk.keys.getKeys();
  
  // Get the active RS256 key ID
  const activeRsaKeyId = keysMetadata.active?.['RS256'];
  
  if (activeRsaKeyId) {
    // Find the full key details
    const activeKey = keysMetadata.keys?.find(k => k.kid === activeRsaKeyId);
    
    return activeKey;
  } else {
    
    return null;
  }
}
```

## Error Handling

The Keys API includes robust error handling to provide meaningful error messages:

```typescript
async function safeGetKeys() {
  try {
    return await sdk.keys.getKeys();
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('401')) {
        console.error('Authentication failed. Check your credentials.');
      } else if (error.message.includes('403')) {
        console.error('Permission denied. Ensure your user has the required permissions.');
      } else {
        console.error('Failed to get keys:', error.message);
      }
    } else {
      console.error('Unknown error occurred:', error);
    }
    return null;
  }
}
```
