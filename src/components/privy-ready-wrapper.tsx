'use client';

import { usePrivy } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyReadyWrapperProps {
  children: ReactNode;
}

export default function PrivyReadyWrapper({ children }: PrivyReadyWrapperProps) {
  const { ready } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Waiting for Privy to be ready...</p>
        </div>
      </div>
    );
  }

  // Now it's safe to use other Privy hooks and state
  return <>{children}</>;
}
