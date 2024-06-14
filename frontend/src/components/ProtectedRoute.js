import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  } else if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;
