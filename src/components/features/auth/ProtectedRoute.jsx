import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  // Temporarily disabled authentication
  return children;
  
  // Original authentication logic
  /*
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
  */
};
