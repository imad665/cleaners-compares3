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

export function NotificationDropdown({ notificationData }: { notificationData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Sample notifications data
  const notifications: Notification[] = [
    /* your notifications data */
  ].concat(notificationData || []);

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('/beep_notification.mp3'); // Update extension if needed
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play sound on first user interaction if there are notifications
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    
    // Play sound only on first interaction when there are notifications
    if (notifications.length > 0 && !hasPlayedSound && !hasUserInteracted) {
      try {
        if (audioRef.current) {
          audioRef.current.play().catch(error => {
            console.log('Audio play failed:', error);
          });
          setHasPlayedSound(true);
        }
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    }
    
    setHasUserInteracted(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

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
        onClick={handleButtonClick}
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
                        {notification.msgCount && <p className='rounded-full w-5 h-5 text-center text-xs flex items-center justify-center text-white bg-red-500'>
                          {notification.msgCount}
                        </p>}
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
              {/* View all notifications button */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}