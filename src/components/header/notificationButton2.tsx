'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, ShoppingBag, AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Notification = {
  id: string;
  type: 'message' | 'order' | 'alert';
  title: string;
  preview: string;
  time: string;
  link: string;
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sample notifications data
   const notifications: Notification[] = [
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      preview: 'Order #ORD-1234 for £89.99',
      time: '2 mins ago',
      link: '/admin/dashboard/orders/ORD-1234'
    },
    {
      id: '2',
      type: 'message',
      title: 'New Product Inquiry',
      preview: 'Customer asked about your premium laundry service',
      time: '15 mins ago',
      link: '/admin/dashboard/messages/123'
    },
    {
      id: '3',
      type: 'order',
      title: 'Order Shipped',
      preview: 'Your order #ORD-1233 has been delivered',
      time: '1 hour ago',
      link: '/admin/dashboard/orders/ORD-1233'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Payment Processed',
      preview: '£245.80 has been deposited to your account',
      time: '3 hours ago',
      link: '/admin/dashboard/payments'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Close when pressing Escape key
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNotificationClick = (link: string) => {
    router.push(link);
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-green-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
            </div>
            
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.link)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.preview}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            )}

            <div className="px-4 py-2 border-t border-gray-100">
              <button
                onClick={() => {
                  router.push('/admin/dashboard/inbox');
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}