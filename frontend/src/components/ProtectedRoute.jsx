import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const decoded = jwtDecode(token);

  if (role && decoded.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}