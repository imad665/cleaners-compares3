import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Folders, 
  FolderKanban, 
  ShoppingCart, 
  FilePlus, 
  Users, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/categories', 
      name: 'Manage Categories', 
      icon: <Folders size={20} /> 
    },
    { 
      path: '/subcategories', 
      name: 'Manage Subcategories', 
      icon: <FolderKanban size={20} /> 
    },
    { 
      path: '/products', 
      name: 'All Products', 
      icon: <ShoppingCart size={20} /> 
    },
    { 
      path: '/add-product', 
      name: 'Add New Product', 
      icon: <FilePlus size={20} /> 
    },
    { 
      path: '/users', 
      name: 'User Management', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/messages', 
      name: 'Messages', 
      icon: <MessageSquare size={20} /> 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      icon: <Settings size={20} /> 
    },
  ];

  return (
    <aside 
      className={`fixed left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className={`flex items-center ${!isOpen && 'justify-center w-full'}`}>
          {isOpen ? (
            <Link to="/" className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">Cleaners Compare</span>
            </Link>
          ) : (
            <Link to="/" className="flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </Link>
          )}
        </div>
        <button 
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 md:flex hidden"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600'
                } ${
                  !isOpen && 'justify-center'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3 transition-opacity duration-200">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;