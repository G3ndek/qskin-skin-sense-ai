
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-qskyn-600 to-qskyn-500 bg-clip-text text-transparent">
            QSkyn
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user?.name}</span>
                <span className="ml-2 text-xs px-2 py-1 bg-qskyn-100 text-qskyn-700 rounded-full">
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
