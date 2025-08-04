import { Order, Conversation } from '../types';

export const orders: Order[] = [
  {
    id: 'ord-001',
    productName: 'Eco-Friendly All-Purpose Cleaner',
    productImage: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg',
    sellerName: 'GreenClean Co.',
    sellerAvatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    sellerRating: 4.8,
    orderDate: '2025-03-15',
    status: 'Delivered',
    price: 12.99,
    description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem rem ullam obcaecati ad ipsum amet distinctio cumque odio voluptatem quo, enim voluptates minima! Voluptatem porro neque eveniet et officia rerum!',
    hasConversation: true
  },
  {
    id: 'ord-002',
    productName: 'Premium Glass Cleaner',
    productImage: 'https://images.pexels.com/photos/4239016/pexels-photo-4239016.jpeg',
    sellerName: 'SparkleShine Inc.',
    sellerAvatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg',
    sellerRating: 4.9,
    orderDate: '2025-03-10',
    status: 'Shipped',
    price: 9.99,
    description:'Lorem, ipsum dolor sit amet consectetur ',
    hasConversation: true
  },
  {
    id: 'ord-003',
    productName: 'Heavy-Duty Kitchen Degreaser',
    productImage: 'https://images.pexels.com/photos/4239028/pexels-photo-4239028.jpeg',
    sellerName: 'CleanPro Solutions',
    sellerAvatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    sellerRating: 4.7,
    orderDate: '2025-03-05',
    status: 'Processing',
    price: 15.49,
    description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem rem ullam obcaecati ad ipsum amet distinctio cumque odio voluptatem quo, enim voluptates ',
    hasConversation: false
  },
  {
    id: 'ord-004',
    productName: 'Bathroom Tile Cleaner',
    productImage: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
    sellerName: 'BathBright Ltd.',
    sellerAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    sellerRating: 4.6,
    orderDate: '2025-02-28',
    status: 'Delivered',
    price: 11.29,
    description:'Lorem, ipsum ',
    hasConversation: true
  },
  {
    id: 'ord-005',
    productName: 'Natural Wood Polish',
    productImage: 'https://images.pexels.com/photos/4239111/pexels-photo-4239111.jpeg',
    sellerName: 'EcoHome Essentials',
    sellerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    sellerRating: 4.9,
    orderDate: '2025-02-20',
    status: 'Delivered',
    price: 18.99,
    description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit.  ',
    hasConversation: false
  }
];

export const conversations: Conversation[] = [
  {
    id: 'conv-001',
    productId: 'prod-001',
    productName: 'Eco-Friendly All-Purpose Cleaner',
    productCategory: 'Cleaners',
    sellerId: 'seller-001',
    sellerName: 'GreenClean Co.',
    sellerAvatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg',
    sellerRating: 4.8,
    lastUpdated: '2025-03-16T14:30:00',
    unreadCount: 2,
    messages: [
      {
        id: 'msg-001',
        senderId: 'seller-001',
        senderName: 'GreenClean Co.',
        content: 'Thank you for your order! Let me know if you have any questions about the product.',
        timestamp: '2025-03-15T10:15:00',
        isRead: true
      },
      {
        id: 'msg-002',
        senderId: 'user',
        senderName: 'You',
        content: 'I was wondering if this cleaner is safe to use on wood surfaces?',
        timestamp: '2025-03-15T11:20:00',
        isRead: true
      },
      {
        id: 'msg-003',
        senderId: 'seller-001',
        senderName: 'GreenClean Co.',
        content: 'Yes, it\'s safe for sealed wood surfaces! Just avoid using it on raw or unsealed wood.',
        timestamp: '2025-03-16T09:45:00',
        isRead: false
      },
      {
        id: 'msg-004',
        senderId: 'seller-001',
        senderName: 'GreenClean Co.',
        content: 'I\'ve also included a small guide on different surfaces in your package.',
        timestamp: '2025-03-16T14:30:00',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-002',
    productId: 'prod-002',
    productName: 'Premium Glass Cleaner',
    productCategory: 'Cleaners',
    sellerId: 'seller-002',
    sellerName: 'SparkleShine Inc.',
    sellerAvatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg',
    sellerRating: 4.9,
    lastUpdated: '2025-03-14T16:20:00',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-005',
        senderId: 'user',
        senderName: 'You',
        content: 'Hi, does this cleaner leave streaks on large windows?',
        timestamp: '2025-03-12T13:40:00',
        isRead: true
      },
      {
        id: 'msg-006',
        senderId: 'seller-002',
        senderName: 'SparkleShine Inc.',
        content: 'Our formula is specifically designed to be streak-free on all glass surfaces! It works great on large windows.',
        timestamp: '2025-03-12T15:10:00',
        isRead: true
      },
      {
        id: 'msg-007',
        senderId: 'user',
        senderName: 'You',
        content: 'Great, thanks! Looking forward to receiving my order.',
        timestamp: '2025-03-12T15:30:00',
        isRead: true
      },
      {
        id: 'msg-008',
        senderId: 'seller-002',
        senderName: 'SparkleShine Inc.',
        content: 'Your order has been shipped! You should receive it in 2-3 business days.',
        timestamp: '2025-03-14T16:20:00',
        isRead: true
      }
    ]
  },
  {
    id: 'conv-003',
    productId: 'prod-004',
    productName: 'Bathroom Tile Cleaner',
    productCategory: 'Cleaners',
    sellerId: 'seller-004',
    sellerName: 'BathBright Ltd.',
    sellerAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    sellerRating: 4.6,
    lastUpdated: '2025-03-05T11:45:00',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-009',
        senderId: 'seller-004',
        senderName: 'BathBright Ltd.',
        content: 'Your Bathroom Tile Cleaner has been delivered! How do you like it so far?',
        timestamp: '2025-03-01T09:20:00',
        isRead: true
      },
      {
        id: 'msg-010',
        senderId: 'user',
        senderName: 'You',
        content: 'It works great on my ceramic tiles, but I\'m having trouble with the grout. Any tips?',
        timestamp: '2025-03-02T14:30:00',
        isRead: true
      },
      {
        id: 'msg-011',
        senderId: 'seller-004',
        senderName: 'BathBright Ltd.',
        content: 'For tough grout stains, try applying the cleaner and letting it sit for 5-10 minutes before scrubbing. A soft brush works best!',
        timestamp: '2025-03-05T11:45:00',
        isRead: false
      }
    ]
  }
];