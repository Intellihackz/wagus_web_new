import { 
  collection, 
  doc, 
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  id?: string;
  wallet: string;
  tier: string;
  username?: string;
  is_online: boolean;
  last_active: any;
  last_login: any;
  last_claimed?: any;
  claimed_days?: number[];
  rent_funded?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export const userService = {
  // Get user by wallet address
  async getUserByWallet(walletAddress: string): Promise<UserData | null> {
    try {
      const q = query(
        collection(db, 'users'),
        where('wallet', '==', walletAddress)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as UserData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by wallet:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserData> {
    try {
      const newUser = {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        last_login: serverTimestamp(),
        last_active: serverTimestamp(),
        is_online: true,
        // Set default values for new users
        claimed_days: userData.claimed_days || [],
        rent_funded: userData.rent_funded || false,
        tier: userData.tier || 'Basic'
      };

      // Use wallet address as document ID for easy lookup
      const userRef = doc(db, 'users', userData.wallet);
      await setDoc(userRef, newUser);

      return {
        id: userData.wallet,
        ...newUser
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update existing user on login
  async updateUserOnLogin(walletAddress: string, updates: Partial<UserData> = {}): Promise<UserData> {
    try {
      const userRef = doc(db, 'users', walletAddress);
      
      const updateData = {
        ...updates,
        last_login: serverTimestamp(),
        last_active: serverTimestamp(),
        is_online: true,
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, updateData);

      // Get updated user data
      const updatedDoc = await getDoc(userRef);
      
      if (updatedDoc.exists()) {
        return {
          id: updatedDoc.id,
          ...updatedDoc.data()
        } as UserData;
      }
      
      throw new Error('User not found after update');
    } catch (error) {
      console.error('Error updating user on login:', error);
      throw error;
    }
  },

  // Set user offline status
  async setUserOffline(walletAddress: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', walletAddress);
      
      await updateDoc(userRef, {
        is_online: false,
        last_active: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error setting user offline:', error);
      throw error;
    }
  },

  // Handle user login/registration
  async handleUserLogin(walletAddress: string, additionalData: Partial<UserData> = {}): Promise<UserData> {
    try {
      // First, try to get existing user
      const existingUser = await this.getUserByWallet(walletAddress);
      
      if (existingUser) {
        // User exists, update login data
        console.log('Updating existing user login:', walletAddress);
        return await this.updateUserOnLogin(walletAddress, additionalData);
      } else {
        // New user, create account
        console.log('Creating new user:', walletAddress);
        const newUserData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'> = {
          wallet: walletAddress,
          tier: additionalData.tier || 'Basic',
          is_online: true,
          last_active: serverTimestamp(),
          last_login: serverTimestamp(),
          claimed_days: [],
          rent_funded: false,
          ...additionalData
        };
        
        return await this.createUser(newUserData);
      }
    } catch (error) {
      console.error('Error handling user login:', error);
      throw error;
    }
  },

  // Get user tier (useful for chat and other features)
  async getUserTier(walletAddress: string): Promise<string> {
    try {
      const user = await this.getUserByWallet(walletAddress);
      return user?.tier || 'Basic';
    } catch (error) {
      console.error('Error getting user tier:', error);
      return 'Basic';
    }
  },

  // Update user tier
  async updateUserTier(walletAddress: string, tier: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', walletAddress);
      
      await updateDoc(userRef, {
        tier,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user tier:', error);
      throw error;
    }
  },

  // Claim daily reward
  async claimDailyReward(walletAddress: string, day: number): Promise<UserData> {
    try {
      const user = await this.getUserByWallet(walletAddress);
      
      if (!user) {
        throw new Error('User not found');
      }

      const claimedDays = user.claimed_days || [];
      
      if (claimedDays.includes(day)) {
        throw new Error('Day already claimed');
      }

      const userRef = doc(db, 'users', walletAddress);
      const updatedClaimedDays = [...claimedDays, day];
      
      await updateDoc(userRef, {
        claimed_days: updatedClaimedDays,
        last_claimed: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Return updated user data
      const updatedDoc = await getDoc(userRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as UserData;
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      throw error;
    }
  }
};
