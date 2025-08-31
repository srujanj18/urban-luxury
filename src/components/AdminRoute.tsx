import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // Redirect to admin login if no token is found
    return <Navigate to="/admin-login" replace />;
  }

  // You could add additional token validation here if needed
  // For example, checking token expiration or making an API call to validate
  
  return <>{children}</>;
};

export default AdminRoute;
