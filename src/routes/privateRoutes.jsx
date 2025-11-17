import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import jwtDecode from "jwt-decode";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user?.token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(user.token);

    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      return <Navigate to="/login" />;
    }
  } catch (err) {
    console.error("❌ Token inválido:", err);
    return <Navigate to="/login" />;
  }

  return children;
}
