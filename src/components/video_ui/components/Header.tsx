import React from 'react';
import { Play } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-20 flex items-center px-4 md:px-6">
      <div className="flex items-center md:ml-64">
        <Play className="h-6 w-6 text-blue-600 mr-2" fill="currentColor" />
        <span className="text-lg font-bold text-slate-800">VideoHub</span>
      </div>
    </header>
  );
};

export default Header;