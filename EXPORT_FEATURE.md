# Export Feature Guide

This document provides information about the `/export` feature in Wagus.

## Overview

The `/export` page allows users to securely export their wallet's private key after email verification. Links have a limited validity period for security.

## How It Works

1. **Access via Encrypted Email Link**: 
   - Users receive a link with an encrypted email ID: `/export?id=[encrypted-email]`
   - Links are valid for 24 hours from generation
   - If no ID is provided, the ID is invalid, or the link has expired, the user is redirected to the main app

2. **Email Verification Process**:
   - User confirms their email by requesting a verification code
   - After entering the code, the user is authenticated via Privy

3. **Secret Key Export**:
   - After successful verification, the user can export their secret key
   - The export is handled securely through Privy's interface

## Testing the Feature

For development and testing, you can use the `/generate-link` page to create test links:
- Go to `/generate-link` in your browser
- Enter an email address
- Copy the generated link to test the export flow
- The link generator will show when the link was generated and when it expires

## Link Expiration

- Links are valid for **24 hours** after generation
- When a link expires, users are redirected to the main app with an explanation
- The expiration period can be adjusted by modifying the `LINK_VALIDITY_HOURS` constant in `src/lib/utils/crypto.ts`

## Security Considerations

- The implementation uses a secure encryption mechanism compatible with Flutter
- Cross-platform encryption enables secure link generation from mobile app
- Links have a built-in expiration mechanism for security
- Never store or log private keys
- Always verify user identity before allowing key export
- Environment variable `NEXT_PUBLIC_ENCRYPTION_KEY` must be properly set in production

For detailed information on the cross-platform encryption implementation, see [CROSS_PLATFORM_ENCRYPTION.md](./CROSS_PLATFORM_ENCRYPTION.md)

## Implementation Notes

The feature uses:
- Privy's `useLoginWithEmail` hook for verification
- Privy's `useSolanaWallets` hook for wallet export
- URL parameters with encrypted data for security
