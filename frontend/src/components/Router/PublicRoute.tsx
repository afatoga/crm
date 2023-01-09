import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  children: JSX.Element;
};

const PublicRoute = ({ children }: Props): JSX.Element => {
  const { token } = useAuth();
  if (token) return <Navigate to="/people" />;

  return children;
};

export default PublicRoute;
