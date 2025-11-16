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

export default function App(){
  return (
    <AuthProvider>
      <NavbarTop />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/posts" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/:id/edit" element={<PostForm edit />} />
          <Route path="/reviews" element={<ReviewsList />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}
