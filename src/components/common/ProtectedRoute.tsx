import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingState } from './LoadingState';
import { ROUTES } from '../../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAuth?: boolean;
  allowIncompleteProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowIncompleteProfile = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Authenticating session..." rows={5} />;
  }

  // Not logged in but route requires auth
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Logged in on a public-only route (like /login)
  if (!requireAuth && isAuthenticated) {
    if (user && user.isProfileComplete === false) {
      return <Navigate to={ROUTES.SETUP_PROFILE} replace />;
    }
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Logged in on the Setup Profile route
  if (allowIncompleteProfile) {
    if (user && user.isProfileComplete === true) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
    return children;
  }

  // Logged in on a protected app route, but profile setup is not yet complete
  if (requireAuth && user && user.isProfileComplete === false) {
    return <Navigate to={ROUTES.SETUP_PROFILE} replace />;
  }

  return children;
};
