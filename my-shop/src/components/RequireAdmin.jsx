import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
