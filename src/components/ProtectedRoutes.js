// PrivateRoute.js
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSecureItem } from '../pages/utils/SecureLocalStorage';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  RESELLER: 'reseller',
  USER: 'user',
};

export const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const token = getSecureItem('userToken');
  const userData = getSecureItem('userData');
  const user = JSON.parse(userData);


  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user.role || !allowedRoles.includes(user?.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

const isAuthenticated = () => {
  return !!getSecureItem('userToken');
};
