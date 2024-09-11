import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import { logged } from '../pages/LoginSignupPage/LoginSignupPage';

const ProtectedRoutes = () => {
  return logged ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
