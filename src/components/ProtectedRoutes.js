// PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './Cookies';
import { getSecureItem } from '../pages/utils/SecureLocalStorage';

export const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};


export const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

const isAuthenticated = () => {
  return !!getSecureItem('userToken');
};
