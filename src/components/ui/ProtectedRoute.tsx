import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebaseConfig'; // Fixed import path

// This component checks if a user is logged in.
// If they are, it renders the page they requested.
// If not, it redirects them to the login page.

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, loading] = useAuthState(auth);

  // Show a loading screen while Firebase checks authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If there's no user, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a user is logged in, show the component
  return children;
};

export default ProtectedRoute;