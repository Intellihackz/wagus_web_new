import React, { memo } from 'react';
import { ChatMessage } from '@/services/chatService';

interface MessageItemProps {
  message: ChatMessage;
  onLike: (messageId: string) => void;
  currentUserId?: string; // Add current user ID to check if they liked the message
}

const MessageItem = memo(({ message, onLike, currentUserId }: MessageItemProps) => {
  const messageTime = message.timestamp?.toDate?.() ? 
    message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Format sender display - prioritize username over wallet address
  const displaySender = message.username 
    ? `[ ${message.username} ]`
    : message.sender.length > 20 
      ? `[ ${message.sender.slice(0, 4)}...${message.sender.slice(-4)} ]`
      : `[ ${message.sender} ]`;
      
  // Check if current user has liked this message
  const hasUserLiked = currentUserId && message.likedBy?.includes(currentUserId);
    // Color based on tier
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'adventurer': return 'text-purple-400';
      case 'basic': return 'text-blue-400';
      case 'system': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const userColor = getTierColor(message.tier);

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2 mb-1">
        <span className={`${userColor} font-medium`}>
          {displaySender}
        </span>
        <span className="text-xs text-gray-500">{messageTime}</span>
        {message.likes > 0 && (
          <span className="text-xs text-red-400 flex items-center space-x-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{message.likes}</span>
          </span>
        )}
      </div>
      <div className="flex items-start justify-between">
        <p className="text-gray-300 flex-1 pr-3">
          {message.message}
        </p>        <button 
          onClick={() => onLike(message.id!)}
          className={`transition-colors shrink-0 ${
            hasUserLiked 
              ? 'text-red-500 hover:text-red-400' 
              : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={hasUserLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.likes === nextProps.message.likes &&
    prevProps.message.message === nextProps.message.message &&
    prevProps.message.sender === nextProps.message.sender &&
    prevProps.message.username === nextProps.message.username &&
    prevProps.currentUserId === nextProps.currentUserId &&
    JSON.stringify(prevProps.message.likedBy) === JSON.stringify(nextProps.message.likedBy)
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
