'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import PrivyReadyWrapper from './privy-ready-wrapper';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId="cmb6z7qe901qdjp0my6sr7btk"
      clientId="client-WY6LzUnNtptctmc7jCaVbdtTSDy5vSG3oRt3DFEuiv5i4"
      config={{
        // Appearance
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets'
          }
        },
        // Supported authentication methods
        loginMethods: ['email'],
        // Enable email domain allowlist (optional)
        // emailDomainAllowlist: ['gmail.com', 'outlook.com'], 
      }}
    >
      <PrivyReadyWrapper>
        {children}
      </PrivyReadyWrapper>
    </PrivyProvider>
  );
}