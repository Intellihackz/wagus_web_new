'use client';

import { usePrivy } from '@privy-io/react-auth';
import { usePrivyAuth } from '@/lib/hooks/use-privy-auth';

export function AuthButton() {
  const { ready, authenticated, user, login, logout } = usePrivyAuth();

  if (!ready) {
    return <div>Loading Privy...</div>;
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      {authenticated ? (
        <>
          <p>Welcome, {user?.email?.address || 'User'}!</p>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button 
          onClick={login}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
