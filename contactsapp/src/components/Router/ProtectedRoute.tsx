import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { appRoles } from '../../config';
import {useAuth} from '../../hooks/useAuth';

type Props = {
  children: JSX.Element;
  isAdmin?: boolean;
};

const ProtectedRoute = ({ children, isAdmin = false }: Props): JSX.Element => {
  const location = useLocation();
  const { token, user } = useAuth();
  if (isAdmin && appRoles[user.currentRole] === "ADMIN") return children
 
  //const token = 'xx';
  if (!isAdmin && token) return children;

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;