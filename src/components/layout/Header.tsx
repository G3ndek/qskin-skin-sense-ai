
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Package, User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-qskyn-600 to-qskyn-500 bg-clip-text text-transparent">
            QSkyn
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated && user?.role === 'patient' && (
            <nav className="hidden md:flex items-center mr-4">
              <Link 
                to="/patient/dashboard" 
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/patient/dashboard') ? 'text-qskyn-600' : 'text-gray-600 hover:text-qskyn-500'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/patient/screening" 
                className={`px-3 py-2 text-sm font-medium ${
                  isActive('/patient/screening') ? 'text-qskyn-600' : 'text-gray-600 hover:text-qskyn-500'
                }`}
              >
                New Assessment
              </Link>
              <Link 
                to="/patient/orders" 
                className={`px-3 py-2 text-sm font-medium flex items-center ${
                  isActive('/patient/orders') ? 'text-qskyn-600' : 'text-gray-600 hover:text-qskyn-500'
                }`}
              >
                <Package className="w-4 h-4 mr-1" />
                My Orders
              </Link>
            </nav>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span className="font-medium mr-1">{user?.name}</span>
                <span className="text-xs px-2 py-1 bg-qskyn-100 text-qskyn-700 rounded-full">
                  {user?.role}
                </span>
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
