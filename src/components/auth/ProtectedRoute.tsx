
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'patient' | 'doctor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRole 
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the correct role (if a specific role is required)
  if (allowedRole && user?.role !== allowedRole) {
    // Redirect based on actual user role
    const redirectPath = user?.role === 'patient' 
      ? '/patient/screening' 
      : '/doctor/dashboard';
      
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has correct role, render children
  return <>{children}</>;
};

export default ProtectedRoute;
