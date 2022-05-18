import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {useAuth} from '../../hooks/useAuth';

type Props = {
  children: JSX.Element;
};

const PublicRoute = ({ children }: Props): JSX.Element => {
  //const location = useLocation();
  const { token } = useAuth();

 
  if (token) return <Navigate to="/dashboard" />;

  return children;
};

export default PublicRoute;