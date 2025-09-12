'use client'
import { Header } from '@/components/header/header';
import InboxList from '@/components/inboxBuyer/inbox/InboxList';
import OrdersList from '@/components/inboxBuyer/orders/OrdersList';
import TabNavigation from '@/components/inboxBuyer/TabNavigation';
import { useTab } from '@/components/inboxBuyer/utils/hooks/useTab';
import { useHomeContext } from '@/providers/homePageProvider';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';



function App() {
  const { activeTab, switchTab } = useTab();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [allConversations, setAllConversations] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const {user} = useHomeContext()
  if(!user){
    window.location.replace("/")
  }
  useEffect(()=>{
    const fetchPurshase = async ()=>{
      setLoading(true)
      const res = await fetch('/api/orders/buyer');
      if(!res.ok){
        toast.error('somthing went wrong')
      }

      const {data} = await res.json();
      setOrders(data || []);
     //console.log(data,';;-----------------+++++++++')
      
      // Flatten all conversations from all sellers into a single array
      const conversations = (data || []).flatMap((group: any) =>
        (group.conversations || []).map((conv: any) => ({
          ...conv,
          sellerId: group.seller.id,
          seller: group.seller
        }))
      );
      setAllConversations(conversations);
      //console.log(conversations,'MMMMMMMMMM???????????????');
      
      setLoading(false);
    }
    fetchPurshase()
  },[])

  // Find conversation by sellerId or orderId
  const findConversationBySeller = (sellerId: string) => {
    return allConversations.find(conv => conv.sellerId === sellerId);
  };

  const findOrderBySeller = (sellerId: string) => {
    for (const group of orders) {
      if (group.seller.id === sellerId) {
        return group.items[0]?.orderId; // Get the first order ID for this seller
      }
    }
    return null;
  };

  const handleContactSeller = (sellerId: string) => {
    // Find existing conversation or use order ID to start new conversation
    const conversation = findConversationBySeller(sellerId);
    if (conversation) {
      setActiveConversationId(`${conversation.id}?sellerId=${sellerId}`);
    } else {
      // If no conversation exists, use the order ID to start a new one
      const orderId = findOrderBySeller(sellerId);
      if (orderId) {
        setActiveConversationId(`${orderId}?sellerId=${sellerId}`);
      }
    }
    switchTab('inbox');
  };

  const handleViewConversation = (sellerId: string) => {
    const conversation = findConversationBySeller(sellerId);
    if (conversation) {
      setActiveConversationId(`${conversation.id}?sellerId=${sellerId}`);
      switchTab('inbox');
    } else {
      // If no conversation exists, use the order ID
      const orderId = findOrderBySeller(sellerId);
      if (orderId) {
        setActiveConversationId(`${orderId}?sellerId=${sellerId}`);
      }
    }
    switchTab('inbox');
  };
    
  return (
    <div className="min-h-screen bg-gray-100">
       <Header  />
      
      <main className="max-w-8xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden my-2">
          <TabNavigation activeTab={activeTab} onTabChange={switchTab} />
          
          <div className="min-h-[500px]">
            {activeTab === 'orders' ? (
              <OrdersList
                onContactSeller={handleContactSeller}
                onViewConversation={handleViewConversation}
                orders={orders}
                isContactSeller
                loading={loading}
              />
            ) : (
              <InboxList
                conversations={allConversations}
                activeConversationId={activeConversationId}
                setActiveConversationId={setActiveConversationId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
 
export default App;
