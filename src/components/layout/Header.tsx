
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault();
      const dashboardPath = user?.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard';
      navigate(dashboardPath);
    }
    // If not authenticated, default Link behavior will navigate to home
  }
  
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm border-b border-pink-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center" 
          onClick={handleLogoClick}
        >
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/9842102e-1296-4115-b5d9-3585f4def066.png" 
              alt="QSkyn Logo" 
              className="h-8 w-8 mr-2" 
            />
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
              QSkyn
            </div>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span className="font-medium">{user?.name}</span>
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
