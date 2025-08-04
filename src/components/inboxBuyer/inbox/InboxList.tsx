import React, { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import ConversationItem from './ConversationItem';
import ConversationThread from './ConversationThread';
import { Conversation } from '../utils/types';

interface InboxListProps {
  conversations?: any[];
  activeConversationId?: string | null;
  setActiveConversationId?: (id: string | null) => void;
}

import InboxListSkeleton from "./InboxListSkeleton";

const InboxList: React.FC<InboxListProps> = ({
  conversations: propConversations = [],
  activeConversationId: propActiveConversationId,
  setActiveConversationId: propSetActiveConversationId
}) => {
  const [localActiveConversationId, setLocalActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  // Use props if provided, otherwise use local state
  const activeConversationId = propActiveConversationId !== undefined ? propActiveConversationId : localActiveConversationId;
  const setActiveConversationId = propSetActiveConversationId || setLocalActiveConversationId;

  // Transform order conversations to match the expected format
  const transformedConversations = useMemo(() => {
    return propConversations.map(conv => ({
      id: conv.id,
      productId: conv.productId || '',
      productName: conv.subject || 'Order Inquiry',
      productCategory: 'Cleaners',
      sellerId: conv.sellerId,
      sellerName: conv.seller?.sellerProfile?.businessName || conv.seller?.name || 'Unknown Seller',
      sellerAvatar: conv.seller?.image || '/logo-1.png',
      sellerRating: 4.5, // Default rating
      lastUpdated: conv.createdAt,
      messages: [], // Will be loaded when conversation is opened
      unreadCount: conv.buyerRead ? 0 : 1
    }));
  }, [propConversations]);

  // Fetch conversation details when a conversation is selected
  useEffect(() => {
    if (activeConversationId) {
      const fetchConversationDetails = async () => {
        setLoading(true);
        try {
          // Parse orderId and sellerId from the activeConversationId
          const [orderId, queryString] = activeConversationId.split('?');
          const urlParams = new URLSearchParams(queryString || '');
          const sellerId = urlParams.get('sellerId');
          
          // Build the API URL with both orderId and sellerId
          let apiUrl = `/api/messages?orderId=${orderId}`;
          if (sellerId) {
            apiUrl += `&sellerId=${sellerId}`;
          }
          
          const response = await fetch(apiUrl);
          if (response.ok) {
            const { data } = await response.json();
            console.log(data,';;;;;;;;;;;;;;;;;');
            
            setActiveConversation(data);
          } else {
            console.error('Failed to fetch conversation details');
            // Fallback to basic conversation data or create new conversation
            const basicConv = transformedConversations.find(c => c.id === orderId);
            if (basicConv) {
              setActiveConversation({
                ...basicConv,
                orderId: orderId,
                sellerId: sellerId || basicConv.sellerId,
                messages: [{
                  id: 'placeholder',
                  senderId: sellerId || basicConv.sellerId,
                  senderName: basicConv.sellerName,
                  content: 'Start a conversation about your order...',
                  timestamp: new Date().toISOString(),
                  isRead: true
                }]
              });
            } else {
              // Create a new conversation for this order
              setActiveConversation({
                id: orderId,
                orderId: orderId,
                productId: '',
                productName: 'Order Conversation',
                productCategory: 'Cleaners',
                sellerId: sellerId || '',
                sellerName: 'Seller',
                sellerAvatar: '/logo-1.png',
                sellerRating: 4.5,
                lastUpdated: new Date().toISOString(),
                messages: [{
                  id: 'welcome',
                  senderId: 'system',
                  senderName: 'System',
                  content: 'Start a conversation about your order...',
                  timestamp: new Date().toISOString(),
                  isRead: true
                }],
                unreadCount: 0
              });
            }
          }
        } catch (error) {
          console.error('Error fetching conversation:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchConversationDetails();
    } else {
      setActiveConversation(null);
    }
  }, [activeConversationId, transformedConversations]);

  const handleConversationClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleBackClick = () => {
    setActiveConversationId(null);
  };

  if (activeConversation) {
    return (
      <ConversationThread 
        conversation={activeConversation} 
        onBack={handleBackClick}
        loading={loading}
      />
    );
  }

  if (loading && !activeConversation) {
    return <InboxListSkeleton />;
  }

  return (
    <div className="py-4 px-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900">Messages</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-blue-600 font-medium">
            Category: Cleaners
          </span>
          <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        {transformedConversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages found</p>
            <p className="text-sm text-gray-400 mt-2">
              Start a conversation by contacting a seller from your orders
            </p>
          </div>
        ) : (
          transformedConversations.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={handleConversationClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default InboxList;
