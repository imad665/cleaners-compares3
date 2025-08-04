'use client';

import { Bell } from 'lucide-react';
import React from 'react';

type NotificationBadgeProps = {
  count: number;
  onClick?: () => void;
};

const NotificationBadge2: React.FC<NotificationBadgeProps> = ({ count, onClick }) => {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Bell className="w-4 h-4 text-gray-700 " />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge2;
