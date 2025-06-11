import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  where,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  startAfter,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseRealtimeChatOptions {
  room: string;
  limitCount?: number;
}

export function useRealtimeChat({ room, limitCount = 50 }: UseRealtimeChatOptions) {
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastRoomRef = useRef<string>('');
  const oldestMessageRef = useRef<DocumentData | null>(null);
  // Memoized message update function to prevent unnecessary re-renders
  const updateMessages = useCallback((newMessages: DocumentData[]) => {
    setMessages(prevMessages => {
      // Only update if messages actually changed
      if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {        // Update oldest message reference for pagination
        if (newMessages.length > 0) {
          const sortedMessages = [...newMessages].sort((a: any, b: any) => 
            a.timestamp?.toMillis() - b.timestamp?.toMillis()
          );
          oldestMessageRef.current = sortedMessages[0];
        }
        return newMessages;
      }
      return prevMessages;
    });
  }, []);

  // Function to load more older messages
  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMore || !oldestMessageRef.current) return;

    setLoadingMore(true);
    try {
      const constraints: QueryConstraint[] = [
        where('room', '==', room),
        orderBy('timestamp', 'desc'),
        startAfter(oldestMessageRef.current?.timestamp),
        limit(limitCount)
      ];

      const q = query(collection(db, 'chat'), ...constraints);
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const olderMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));      // Update oldest message reference
      if (olderMessages.length > 0) {
        const sortedOlderMessages = [...olderMessages].sort((a: any, b: any) => 
          a.timestamp?.toMillis() - b.timestamp?.toMillis()
        );
        oldestMessageRef.current = sortedOlderMessages[0];
      }

      // If we got fewer messages than requested, we've reached the end
      if (olderMessages.length < limitCount) {
        setHasMore(false);
      }

      // Prepend older messages to existing messages
      setMessages(prevMessages => [...prevMessages, ...olderMessages]);
    } catch (error) {
      console.error('Error loading more messages:', error);
      setError(error as Error);
    } finally {
      setLoadingMore(false);
    }
  }, [room, limitCount, loadingMore, hasMore]);

  useEffect(() => {
    // Only reconnect if room actually changed
    if (lastRoomRef.current === room && unsubscribeRef.current) {
      return;
    }    lastRoomRef.current = room;
    setLoading(true);
    setError(null);
    setHasMore(true);
    setMessages([]); // Clear messages when changing rooms
    oldestMessageRef.current = null;

    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const q = query(
      collection(db, 'chat'),
      where('room', '==', room),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    // Set up real-time listener
    unsubscribeRef.current = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        updateMessages(newMessages);
        setLoading(false);
      },
      (err) => {
        console.error('Real-time chat error:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [room, limitCount, updateMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return { 
    messages, 
    loading, 
    loadingMore, 
    hasMore, 
    error, 
    loadMoreMessages 
  };
}

// Optimized message sending hook
export function useChatActions() {
  const [sending, setSending] = useState(false);
  const sendMessage = useCallback(async (messageData: {
    sender: string;
    message: string;
    room: string;
    tier: string;
    username?: string;
  }) => {
    setSending(true);
    try {
      // Import here to avoid circular dependencies
      const { chatService } = await import('@/services/chatService');
      await chatService.sendMessage(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  }, []);

  const likeMessage = useCallback(async (messageId: string, userId: string) => {
    try {
      const { chatService } = await import('@/services/chatService');
      await chatService.likeMessage(messageId, userId);
    } catch (error) {
      console.error('Error liking message:', error);
      throw error;
    }
  }, []);

  return { sendMessage, likeMessage, sending };
}
