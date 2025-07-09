# Cross-Platform Encryption Guide (Next.js & Flutter)

This guide explains how to implement compatible encryption between the Next.js web app and Flutter mobile app for the Wagus export feature.

## Overview

The export feature uses encryption to securely encode user email addresses in URLs. This document explains how to implement the same encryption algorithm in both JavaScript (Next.js) and Dart (Flutter) to ensure compatibility.

## Encryption Implementation

### Web App (Next.js/JavaScript)

The web app implements a custom encryption function using XOR with a secret key:

```typescript
function encrypt(data: string): string {
  const key = getEncryptionKey();
  let result = '';
  
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  
  // Convert to base64 and make URL safe
  const base64 = btoa(result)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return base64;
}

function decrypt(encryptedData: string): string {
  // Make base64 URL-safe again
  let base64 = encryptedData
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  
  const data = atob(base64);
  const key = getEncryptionKey();
  let result = '';
  
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  
  return result;
}
```

### Mobile App (Flutter/Dart)

Here is the equivalent implementation for Flutter:

```dart
import 'dart:convert';

// Use the same key as in the web app
const String encryptionKey = 'wagus-secure-encryption-key-2025';

String encrypt(String data) {
  List<int> dataBytes = utf8.encode(data);
  List<int> keyBytes = utf8.encode(encryptionKey);
  List<int> result = [];
  
  for (int i = 0; i < dataBytes.length; i++) {
    int keyByte = keyBytes[i % keyBytes.length];
    result.add(dataBytes[i] ^ keyByte);
  }
  
  // Convert to base64 and make URL safe
  String base64 = base64Encode(result);
  base64 = base64.replaceAll('+', '-');
  base64 = base64.replaceAll('/', '_');
  base64 = base64.replaceAll(RegExp(r'=+$'), '');
  
  return base64;
}

String decrypt(String encryptedData) {
  try {
    // Make base64 URL-safe again
    String base64 = encryptedData.replaceAll('-', '+').replaceAll('_', '/');
    
    // Add padding if needed
    while (base64.length % 4 != 0) {
      base64 += '=';
    }
    
    List<int> dataBytes = base64Decode(base64);
    List<int> keyBytes = utf8.encode(encryptionKey);
    List<int> result = [];
    
    for (int i = 0; i < dataBytes.length; i++) {
      int keyByte = keyBytes[i % keyBytes.length];
      result.add(dataBytes[i] ^ keyByte);
    }
    
    return utf8.decode(result);
  } catch (e) {
    print('Decryption failed: $e');
    return '';
  }
}

// Example of creating an export link in Flutter
Map<String, dynamic> createExportPayload(String email) {
  return {
    'email': email,
    'timestamp': DateTime.now().millisecondsSinceEpoch
  };
}

String generateExportLink(String email) {
  Map<String, dynamic> payload = createExportPayload(email);
  String jsonPayload = jsonEncode(payload);
  String encrypted = encrypt(jsonPayload);
  
  return 'https://wagus-app.com/export?id=$encrypted';
}
```

## Security Considerations

1. **Secret Key Management**:
   - Store the encryption key securely
   - Use environment variables in Next.js
   - Use secure storage in Flutter
   - Consider using different keys for different environments (dev/staging/prod)

2. **Key Rotation**:
   - Plan for key rotation procedures
   - Handle gracefully when keys are updated
   - Consider adding a version identifier to the encrypted payload

3. **Production Enhancement**:
   - For higher security, replace the XOR implementation with a standard encryption library:
     - Use `crypto-js` with AES in Next.js
     - Use the `encrypt` package with AES in Flutter

## Implementation Steps

1. Set up the encryption key in both apps:
   - In Next.js: Add to .env.local as NEXT_PUBLIC_ENCRYPTION_KEY
   - In Flutter: Store securely using Flutter Secure Storage

2. Implement the encryption functions in both apps

3. Test cross-compatibility by:
   - Generating links in Flutter and testing in Next.js
   - Generating links in Next.js and decoding in Flutter

4. Deploy with secure key management according to your infrastructure
