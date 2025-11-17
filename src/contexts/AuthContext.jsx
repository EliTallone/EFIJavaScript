import React, { createContext, useState, useEffect } from "react";
import api from "../api.js";
import jwt_decode from "jwt-decode";   // ✅ ÚNICA IMPORTACIÓN CORRECTA

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ---------------------------------------------
  // CARGAR TOKEN DEL LOCALSTORAGE AL INICIAR
  // ---------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      try {
        const decoded = jwt_decode(saved);
        setUser({
          token: saved,
          name: decoded.username,
          email: decoded.sub,
          role: decoded.role,
        });
      } catch (err) {
        console.error("❌ Error decodificando token del localStorage:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ----------------------------------------------------
  // REGISTRO
  // ----------------------------------------------------
  const register = async (formData) => {
    try {
      console.log("📤 Enviando registro:", formData);

      const payload = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const res = await api.post("/register", payload);

      console.log("✅ Registro OK:", res.data);
      return true;

    } catch (err) {
      console.error("❌ Error en registro:", err.response?.data || err.message);

      let msg = "No se pudo registrar.";

      if (err.response?.data?.error) msg = err.response.data.error;
      if (err.response?.data?.details) msg = JSON.stringify(err.response.data.details);

      alert(msg);
      return false;
    }
  };

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/login", { email, password });

      const token = res.data.access_token;
      localStorage.setItem("token", token);

      // Decodificar token al loguear
      const decoded = jwt_decode(token);

      setUser({
        token,
        name: decoded.username,
        email: decoded.sub,
        role: decoded.role,
      });

      return true;

    } catch (err) {
      console.error("❌ Error login:", err.response?.data || err.message);
      alert("Email o contraseña incorrectos");
      return false;
    }
  };

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
