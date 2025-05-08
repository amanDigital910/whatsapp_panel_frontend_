// PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './Cookies';

export const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};


export const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : <Outlet />;
};

// eslint-disable-next-line no-use-before-define

// const isAuthenticated = () => {
//   return !!Cookies.get('userToken');
// };
console.log("ISredux-persist and redux-toolbar which is more better ",isAuthenticated());
