'use client';

import { usePrivy } from '@privy-io/react-auth';

export function usePrivyAuth() {
  const privy = usePrivy();
  
  return {
    ...privy,
    isReady: privy.ready
  };
}
