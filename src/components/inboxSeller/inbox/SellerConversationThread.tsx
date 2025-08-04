import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Star, Loader2 } from 'lucide-react';
import { Conversation, Message } from '../../inboxBuyer/utils/types';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useHomeContext } from '@/providers/homePageProvider';

interface SellerConversationThreadProps {
  conversation: Conversation;
  onBack: () => void;
  loading?: boolean;
}

const SellerConversationThread: React.FC<SellerConversationThreadProps> = ({ 
  conversation,
  onBack,
  loading = false
}) => {
  const {user} = useHomeContext();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState(conversation.messages);

  // Update messages when conversation changes
  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.messages]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || sending) return;
    
    setSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: conversation.orderId || conversation.id,
          content: newMessage.trim(),
          receiverId: conversation.sellerId // For seller, this is actually the buyer ID
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setMessages(prev => [...prev, data]);
        setNewMessage('');
        toast.success('Message sent successfully');
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-1 mr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <img
            src={conversation.sellerAvatar}
            alt={conversation.sellerName}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">{conversation.sellerName}</h2>
              <div className="flex items-center ml-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{conversation.sellerRating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{conversation.productName}</p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading messages...</span>
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble key={message.id} message={message} currentUserId={user?.id} />
          ))
        )}
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end">
          <div className="flex-1 mr-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to your customer..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === '' || sending}
            className="p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  currentUserId?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUserId }) => {
  const isUser = message.senderId === currentUserId;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
      }`}>
        {!isUser && (
          <p className="text-xs font-medium text-gray-500 mb-1">{message.senderName}</p>
        )}
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 text-right ${
          isUser ? 'text-blue-200' : 'text-gray-500'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};

export default SellerConversationThread;
