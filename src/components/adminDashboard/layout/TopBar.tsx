import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm h-16 flex items-center px-4 md:px-6">
      <button 
        aria-label="Toggle sidebar" 
        className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </button>
      
      <div className="relative max-w-lg w-full mr-auto hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text"
          placeholder="Search products, categories, users..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        
        <div className="relative">
          <button 
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" 
              alt="Admin avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User size={16} className="mr-2" />
                Profile
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings size={16} className="mr-2" />
                Account Settings
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut size={16} className="mr-2" />
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;