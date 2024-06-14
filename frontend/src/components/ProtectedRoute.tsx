import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  } else if (currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  // If User has the required role, render the children components
  return children;
}

export default ProtectedRoute;
