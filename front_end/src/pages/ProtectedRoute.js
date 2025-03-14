import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userService } from './apiService';

const ProtectedRoute = ({ allowedRoles }) => {
  const currentUser = userService.getCurrentUser();
  const isAuthenticated = userService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // User doesn't have required role to access this route
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;