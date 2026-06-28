import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />; // redirect if no token
  }

  return children; // allow if token exists
}

export default ProtectedRoute;
