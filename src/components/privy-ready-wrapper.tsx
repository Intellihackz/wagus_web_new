'use client';

import { usePrivy } from '@privy-io/react-auth';
import { ReactNode, useEffect, useState } from 'react';

interface PrivyReadyWrapperProps {
  children: ReactNode;
}

export default function PrivyReadyWrapper({ children }: PrivyReadyWrapperProps) {
  const { ready } = usePrivy();
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ready) {
      setShowContent(true);
    }
  }, [mounted, ready]);

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return null;
  }

  // Show loading state only if we're mounted but Privy is not ready
  if (!showContent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Initializing Wagus...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
