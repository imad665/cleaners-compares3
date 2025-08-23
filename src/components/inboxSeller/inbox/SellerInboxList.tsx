import React, { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import SellerConversationItem from './SellerConversationItem';
import SellerConversationThread from './SellerConversationThread';
import { Conversation } from '../../inboxBuyer/utils/types';

interface SellerInboxListProps {
  conversations?: any[];
  activeConversationId?: string | null;
  setActiveConversationId?: (id: string | null) => void;
}

const SellerInboxList: React.FC<SellerInboxListProps> = ({ 
  conversations: propConversations = [],
  activeConversationId: propActiveConversationId,
  setActiveConversationId: propSetActiveConversationId
}) => {
  const [localActiveConversationId, setLocalActiveConversationId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isContact,setIsContact] = useState<boolean>(propConversations.some((c) => c.isContact))

  // Use props if provided, otherwise use local state
  const activeConversationId = propActiveConversationId !== undefined ? propActiveConversationId : localActiveConversationId;
  const setActiveConversationId = propSetActiveConversationId || setLocalActiveConversationId;

  // Transform order conversations to match the expected format for seller view
  //console.log(propConversations,'xxxxxxxxxxxxxxxxxxxxx');
  
  const transformedConversations = useMemo(() => {
    return propConversations.map(conv => ({
      id: conv.id,
      productId: conv.productId || '',
      productName: conv.subject || 'Order Inquiry',
      productCategory: 'Cleaners',
      sellerId: conv.buyerId, // For seller view, the "seller" is actually the buyer
      sellerName: conv.buyer?.name || 'Unknown Buyer',
      sellerAvatar: conv.buyer?.image || '/logo-1.png',
      sellerRating: 4.5, // Default rating
      lastUpdated: conv.createdAt,
      messages: [], // Will be loaded when conversation is opened
      unreadCount: conv.sellerRead ? 0 : 1,
      unreadMessageCount:conv.unreadMessageCount,
      isContact:conv.isContact,
    }));
  }, [propConversations]);

  // Fetch conversation details when a conversation is selected
  useEffect(() => {
    if (activeConversationId) {
      const fetchConversationDetails = async () => {
        setLoading(!activeConversation);
        try {
          // Parse orderId and buyerId from the activeConversationId
          const [orderId, queryString] = activeConversationId.split('?');
          const urlParams = new URLSearchParams(queryString || '');
          const buyerId = urlParams.get('buyerId');
          
          // Build the API URL with both orderId and buyerId
          let apiUrl = `/api/messages?orderId=${orderId}`;
          if (buyerId) {
            apiUrl += `&buyerId=${buyerId}`;
          }
          
          const response = await fetch(apiUrl);
          if (response.ok) {
            const { data } = await response.json();
            setActiveConversation(data);
          } else {
            console.error('Failed to fetch conversation details');
            // Fallback to basic conversation data or create new conversation
            const basicConv = transformedConversations.find(c => c.id === orderId);
            if (basicConv) {
              setActiveConversation({
                ...basicConv,
                orderId: orderId,
                sellerId: buyerId || basicConv.sellerId,
                messages: [{
                  id: 'placeholder',
                  senderId: buyerId || basicConv.sellerId,
                  senderName: basicConv.sellerName,
                  content: 'Start a conversation about this order...',
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
                sellerId: buyerId || '',
                sellerName: 'Buyer',
                sellerAvatar: '/logo-1.png',
                sellerRating: 4.5,
                lastUpdated: new Date().toISOString(),
                messages: [{
                  id: 'welcome',
                  senderId: 'system',
                  senderName: 'System',
                  content: 'Start a conversation about this order...',
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

      if(!transformedConversations)fetchConversationDetails();

      const intervalId = setInterval(fetchConversationDetails, 8000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
    } else {
      setActiveConversation(null);
    }
  }, [activeConversationId, transformedConversations]);

  const handleConversationClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
    
  };

  const handleBackClick = () => {
    setActiveConversationId(null);
    setIsContact(false)
  };

  if (activeConversation) {
    return (
      <SellerConversationThread 
        conversation={activeConversation} 
        onBack={handleBackClick}
        loading={loading}
        
      />
    );
  }

  return (
    <div className="py-4 px-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-medium text-gray-900">Customer Messages</h2>
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
            <p className="text-gray-500">No customer messages found</p>
            <p className="text-sm text-gray-400 mt-2">
              Customer messages will appear here when they contact you about their orders
            </p>
          </div>
        ) : (
          
          transformedConversations.map(conversation => (
            <SellerConversationItem
              key={conversation.id}
              conversation={conversation}
              onClick={handleConversationClick}
              isContact={isContact}
            />
          ))

        )}
      </div>
    </div>
  );
};

export default SellerInboxList;
