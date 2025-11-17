import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarTop from './components/NavbarTop';
import Register from './pages/Register';
import Login from './pages/Login';
import PostsList from './pages/PostsList';
import PostForm from './pages/PostForm';
import PostDetails from './pages/PostDetails';
import ReviewsList from './pages/ReviewsList';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';

import PrivateRoute from "./routes/privateRoutes";   // <--- AGREGADO

export default function App(){
  return (
    <AuthProvider>
      <NavbarTop />
      <div className="container mt-4">
        <Routes>

          <Route path="/" element={<Navigate to="/posts" />} />

          {/* Públicas */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Privadas */}
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <PostsList />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/new"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <PrivateRoute>
                <PostDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute>
                <PostForm edit />
              </PrivateRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <PrivateRoute>
                <ReviewsList />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}
