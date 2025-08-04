export interface Order {
  id: string;
  productName: string;
  productImage: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  orderDate: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  price: number;
  description:string
  hasConversation: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  productImage?: string;
  productCategory: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  lastUpdated: string;
  messages: Message[];
  unreadCount: number;
}
