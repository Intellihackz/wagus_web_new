import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { userService, UserData } from '@/services/userService';

export function useUserManagement() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { user, authenticated, logout } = usePrivy();

  // Handle user login/registration
  const handleUserLogin = useCallback(async () => {
    if (!authenticated || !user?.wallet?.address) return;

    setLoading(true);
    setError(null);

    try {
      const walletAddress = user.wallet.address;
      
      // Handle user login/registration in Firebase
      const updatedUserData = await userService.handleUserLogin(walletAddress, {
        // You can add additional data here if needed
        // For example, email, username, etc.
      });

      setUserData(updatedUserData);
      console.log('User login handled successfully:', updatedUserData);
    } catch (err) {
      console.error('Error handling user login:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [authenticated, user]);

  // Handle user logout
  const handleUserLogout = useCallback(async () => {
    if (userData?.wallet) {
      try {
        await userService.setUserOffline(userData.wallet);
      } catch (err) {
        console.error('Error setting user offline:', err);
      }
    }
    
    setUserData(null);
    await logout();
  }, [userData, logout]);

  // Get user tier for chat and other features
  const getUserTier = useCallback((): string => {
    return userData?.tier || 'Basic';
  }, [userData]);

  // Update user tier
  const updateTier = useCallback(async (tier: string) => {
    if (!userData?.wallet) return;

    try {
      await userService.updateUserTier(userData.wallet, tier);
      setUserData(prev => prev ? { ...prev, tier } : null);
    } catch (err) {
      console.error('Error updating user tier:', err);
      setError(err as Error);
    }
  }, [userData]);

  // Claim daily reward
  const claimDailyReward = useCallback(async (day: number) => {
    if (!userData?.wallet) return;

    try {
      const updatedUser = await userService.claimDailyReward(userData.wallet, day);
      setUserData(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error claiming daily reward:', err);
      setError(err as Error);
      throw err;
    }
  }, [userData]);

  // Effect to handle login when user authenticates
  useEffect(() => {
    if (authenticated && user?.wallet?.address && !userData) {
      handleUserLogin();
    }
  }, [authenticated, user?.wallet?.address, userData, handleUserLogin]);

  // Cleanup: set user offline when component unmounts or user changes
  useEffect(() => {
    return () => {
      if (userData?.wallet) {
        userService.setUserOffline(userData.wallet).catch(console.error);
      }
    };
  }, [userData?.wallet]);

  return {
    userData,
    loading,
    error,
    handleUserLogin,
    handleUserLogout,
    getUserTier,
    updateTier,
    claimDailyReward,
    // Computed values
    isOnline: userData?.is_online || false,
    walletAddress: userData?.wallet || null,
    tier: userData?.tier || 'Basic',
    claimedDays: userData?.claimed_days || [],
    rentFunded: userData?.rent_funded || false
  };
}
