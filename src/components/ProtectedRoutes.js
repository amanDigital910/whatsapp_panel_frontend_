// PrivateRoute.js
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getSecureItem } from '../pages/utils/SecureLocalStorage';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  RESELLER: 'reseller',
  USER: 'user',
};

const userRolePermission = {
  permissions: {
    virtual: true,
    personal: true,
    internationalVirtual: true,
    internationalPersonal: true,
    whatsappOfficial: true,
    developerAPI: true
  }
}

export const PrivateRoute = ({ allowedRoles, requiredPermissions }) => {
  const location = useLocation();
  const token = getSecureItem('userToken');
  const userData = getSecureItem('userData');
  const user = JSON.parse(userData);
  const userPermissions = userRolePermission?.permissions || {};

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (Array.isArray(requiredPermissions) && requiredPermissions.length > 0) {
    const hasAnyPermission = requiredPermissions.some(
      (key) => userPermissions[key]
    );

    if (!hasAnyPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

const isAuthenticated = () => {
  return !!getSecureItem('userToken');
};
