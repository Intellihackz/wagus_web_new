import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { firestoreService } from '@/hooks/useFirestore';

export interface ChatMessage {
  id?: string;
  sender: string;
  message: string;
  room: string;
  timestamp: any;
  likes: number;
  tier: string;
  username?: string;
  likedBy?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export const chatService = {  // Messages
  async sendMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'likes' | 'likedBy'>) {
    try {
      const message = {
        ...messageData,
        timestamp: serverTimestamp(),
        likes: 0,
        likedBy: []
      };
      
      return await firestoreService.create('chat', message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getRoomMessages(roomName: string, limitCount: number = 50) {
    try {
      return await firestoreService.getMany('chat', [
        where('room', '==', roomName),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      ]);
    } catch (error) {
      console.error('Error getting room messages:', error);
      throw error;
    }
  },
  async likeMessage(messageId: string, userId: string) {
    try {
      const message: any = await firestoreService.getOne('chat', messageId);
      if (!message) throw new Error('Message not found');

      const currentLikes = message.likes || 0;
      const likedBy = message.likedBy || [];
      
      // Check if user already liked this message
      if (likedBy.includes(userId)) {
        // Unlike the message
        const updatedLikedBy = likedBy.filter((id: string) => id !== userId);
        return await firestoreService.update('chat', messageId, {
          likes: Math.max(0, currentLikes - 1),
          likedBy: updatedLikedBy
        });
      } else {
        // Like the message
        const updatedLikedBy = [...likedBy, userId];
        return await firestoreService.update('chat', messageId, {
          likes: currentLikes + 1,
          likedBy: updatedLikedBy
        });
      }
    } catch (error) {
      console.error('Error liking message:', error);
      throw error;
    }
  },

  // User stats (estimated from chat data)
  async getUserStats() {
    try {
      // Get recent messages to estimate stats
      const recentMessages = await firestoreService.getMany('chat', [
        orderBy('timestamp', 'desc'),
        limit(100)
      ]);
      
      const uniqueSenders = new Set(recentMessages.map((msg: any) => msg.sender));
      const holderTiers = ['Premium', 'Gold', 'Diamond'];
      const holders = recentMessages.filter((msg: any) => 
        holderTiers.includes(msg.tier)
      );
      
      return {
        online: Math.min(uniqueSenders.size, 50),
        total: uniqueSenders.size,
        holders: new Set(holders.map((msg: any) => msg.sender)).size
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { online: 0, total: 0, holders: 0 };
    }
  }
};
