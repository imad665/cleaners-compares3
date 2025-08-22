import React from 'react';
import { Star } from 'lucide-react';
import { Conversation } from '../../inboxBuyer/utils/types';

interface SellerConversationItemProps {
  conversation: Conversation;
  onClick: (conversationId: string) => void;
}

const SellerConversationItem: React.FC<SellerConversationItemProps> = ({
  conversation,
  onClick
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Same day format as time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Within last 7 days as day name
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    }

    // Otherwise as date
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get last message for preview
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  //console.log(conversation,'ooooooooooooooooooooo');

  return (
    <button
      onClick={() => onClick(conversation.id)}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 rounded-lg
        ${conversation.unreadCount > 0 ? 'bg-blue-50' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start cursor-pointer">
        <div className="flex items-start flex-1 min-w-0">
          <img
            src={conversation.sellerAvatar}
            alt={conversation.sellerName}
            className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className={`font-medium truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                }`}>
                {conversation.sellerName}
              </h3>
              <div className="flex items-center ml-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-xs text-gray-600">{conversation.sellerRating}</span>
              </div>
              <p className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                {formatDate(conversation.lastUpdated)}
              </p>
            </div>
            <div className='flex gap-2 items-center'>
              <p className="text-sm text-gray-500 truncate mt-1">
                {conversation.productName}
              </p>
             { conversation.unreadMessageCount>0&&<p className=' bg-red-600 rounded-full text-white w-5 h-5 flex items-center justify-center'>
                {conversation.unreadMessageCount}
              </p>}
            </div>

            {lastMessage && (
              <p className="text-sm text-gray-600 truncate mt-1">
                {lastMessage.content}
              </p>
            )}

          </div>
        </div>

        {conversation.unreadCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-medium text-white bg-blue-500 rounded-full">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default SellerConversationItem;
