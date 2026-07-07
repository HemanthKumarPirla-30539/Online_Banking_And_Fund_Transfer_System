import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (auth.loading) {
    return null;
  }

  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
