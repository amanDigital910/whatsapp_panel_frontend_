// PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { getSecureItem } from '../pages/utils/SecureLocalStorage';

export const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};


export const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

const isAuthenticated = () => {
  return !!getSecureItem('userToken');
};
