import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/useContext'

const PrivateRoute = ({allowedRoles}) => {
  const { user, loading } = useContext(UserContext);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is specified and user's role is not in allowedRoles, redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} />;
  }

  // If everything is fine, render the requested route
  return <Outlet />;
}

export default PrivateRoute