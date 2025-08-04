import React from 'react';
import { ShoppingBag, MessageSquare } from 'lucide-react';
import { TabType } from '../hooks/useTab';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-8">
        <TabButton 
          isActive={activeTab === 'orders'} 
          onClick={() => onTabChange('orders')}
          icon={<ShoppingBag size={18} />}
          label="Orders"
        />
        <TabButton 
          isActive={activeTab === 'inbox'} 
          onClick={() => onTabChange('inbox')}
          icon={<MessageSquare size={18} />}
          label="Inbox"
        />
      </div>
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 ${
        isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } transition-colors duration-200`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

export default TabNavigation;