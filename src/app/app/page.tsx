"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Sidebar from "@/components/sidebar";
import MessageItem from "@/components/MessageItem";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useAccountTier } from "@/context/account-tier-context";
import { useRealtimeChat, useChatActions } from "@/hooks/useRealtimeChat";
import { useUserManagement } from "@/hooks/useUserManagement";
import { chatService, ChatMessage } from "@/services/chatService";

export default function AppPage() {
  const [currentChannel, setCurrentChannel] = useState("General");
  const [newMessage, setNewMessage] = useState("");
  const [userStats, setUserStats] = useState({
    online: 0,
    total: 0,
    holders: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { getThemeColors } = useAccountTier();
  const themeColors = getThemeColors();

  // User management hook
  const {
    userData,
    loading: userLoading,
    getUserTier,
    walletAddress,
    tier,
  } = useUserManagement();

  // Privy hooks
  const { logout, authenticated, user } = usePrivy();
  // Use optimized real-time chat hooks
  const { 
    messages, 
    loading: messagesLoading, 
    loadingMore, 
    hasMore, 
    loadMoreMessages 
  } = useRealtimeChat({
    room: currentChannel,
    limitCount: 50,
  });

  const { sendMessage, likeMessage, sending } = useChatActions(); // Memoized reversed messages to prevent unnecessary re-renders
  const reversedMessages = useMemo(() => {
    return messages ? ([...messages].reverse() as ChatMessage[]) : [];
  }, [messages]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Get user stats on component mount and when channel changes
  useEffect(() => {
    chatService.getUserStats().then(setUserStats);
  }, [currentChannel]);
  // Auto-scroll to bottom when new messages arrive (but not when loading older messages)
  const previousMessageCountRef = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Only auto-scroll if we're not loading more messages and new messages were added to the end
    if (!isLoadingMoreRef.current && reversedMessages.length > previousMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    previousMessageCountRef.current = reversedMessages.length;
  }, [reversedMessages.length]);// Memoized message sending function
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user || sending || !userData) return;

    try {
      // Use the wallet address from user management system
      const sender =
        userData.wallet || user?.wallet?.address || user?.id || "anonymous";

      await sendMessage({
        sender,
        message: newMessage.trim(),
        room: currentChannel,
        tier: userData.tier || "Basic", // Use actual user tier from Firebase
        username: userData.username, // Include username if available
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [newMessage, user, currentChannel, sending, sendMessage, userData]);
  // Memoized like handler
  const handleLikeMessage = useCallback(
    async (messageId: string) => {
      if (!user || !messageId || !userData?.wallet) return;

      try {
        await likeMessage(messageId, userData.wallet);
      } catch (error) {
        console.error("Error liking message:", error);
      }
    },
    [user, likeMessage, userData?.wallet]
  );
  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );
  // Memoized channel change handler
  const handleChannelChange = useCallback(
    (channel: string) => {
      if (channel !== currentChannel) {
        setCurrentChannel(channel);
        // Reset loading flag when changing channels
        isLoadingMoreRef.current = false;
        previousMessageCountRef.current = 0;
      }
    },
    [currentChannel]
  );
  // Infinite scroll: load more messages when scrolled to top
  const chatAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;
    
    const handleScroll = () => {
      if (chatArea.scrollTop === 0 && hasMore && !loadingMore) {
        // Store current scroll height before loading more messages
        const previousScrollHeight = chatArea.scrollHeight;
        isLoadingMoreRef.current = true;
        
        loadMoreMessages().then(() => {
          // After loading, restore scroll position to maintain user's view
          setTimeout(() => {
            const newScrollHeight = chatArea.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeight;
            chatArea.scrollTop = heightDifference;
            isLoadingMoreRef.current = false;
          }, 100);
        }).catch(() => {
          isLoadingMoreRef.current = false;
        });
      }
    };
    
    chatArea.addEventListener('scroll', handleScroll);
    return () => chatArea.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loadMoreMessages]);

  // Show loading while checking authentication
  if (!authenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeColors.accent.replace(
              "text-",
              "border-"
            )} mx-auto mb-4`}
          ></div>
          <p className="text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center justify-between">
            {" "}
            {/* Floating Chips */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              {[
                "General",
                "Support",
                "Games",
                "Ideas",
                "Tier Lounge",
                "Hypervane",
                "Samu",
              ].map((channel) => (
                <div
                  key={channel}
                  onClick={() => handleChannelChange(channel)}
                  className={`px-3 py-1.5 rounded-sm text-sm cursor-pointer transition-colors whitespace-nowrap ${
                    currentChannel === channel
                      ? `${themeColors.primary} text-white`
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  #{channel}
                </div>
              ))}
            </div>{" "}
            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">
                  {userStats.online} online
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div
                  className={`w-2 h-2 ${themeColors.primary} rounded-full`}
                ></div>
                <span className="text-sm text-gray-400">
                  {userStats.holders} holders
                </span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Chat Messages Area */}
        <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 min-h-full flex flex-col">
            {loadingMore && (
              <div className="text-center text-xs text-gray-500 py-2">Loading more messages...</div>
            )}
            {messagesLoading ? (
              <div className="text-center py-8 flex-1 flex items-center justify-center">
                <div>
                  <div
                    className={`animate-spin rounded-full h-8 w-8 border-b-2 ${themeColors.accent.replace(
                      "text-",
                      "border-"
                    )} mx-auto mb-4`}
                  ></div>
                  <p className="text-gray-400">Loading messages...</p>
                </div>
              </div>
            ) : reversedMessages.length === 0 ? (
              <div className="text-center py-8 flex-1 flex items-center justify-center">
                <div>
                  <p className="text-gray-400">
                    No messages in #{currentChannel} yet.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Be the first to start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1"></div>{" "}
                {reversedMessages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onLike={handleLikeMessage}
                    currentUserId={userData?.wallet}
                  />
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Chat Input - Fixed at bottom */}
        <div className="border-t border-gray-800 p-6 bg-black">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                {" "}
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    userLoading
                      ? "Loading user data..."
                      : "Type your message..."
                  }
                  disabled={sending || userLoading || !userData}
                  className={`w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none ${themeColors.accent.replace(
                    "text-",
                    "focus:border-"
                  )} focus:ring-1 ${themeColors.accent.replace(
                    "text-",
                    "focus:ring-"
                  )} transition-colors disabled:opacity-50`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>{" "}
            <button
              onClick={handleSendMessage}
              disabled={
                !newMessage.trim() || sending || userLoading || !userData
              }
              className={`${themeColors.primary} ${themeColors.primaryHover} text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {sending ? "Sending..." : userLoading ? "Loading..." : "Send"}
            </button>
          </div>{" "}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span>
              Connected as{" "}
              {userLoading
                ? "[loading...]"
                : userData?.wallet
                ? `[${userData.wallet.slice(0, 6)}...${userData.wallet.slice(
                    -4
                  )}]`
                : user?.email?.address
                ? `[${user.email.address.split("@")[0]}]`
                : "[user]"}
              {userData?.tier && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    userData.tier === "Adventurer"
                      ? "bg-purple-900 text-purple-300"
                      : userData.tier === "Basic"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-green-900 text-green-300"
                  }`}
                >
                  {userData.tier}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
