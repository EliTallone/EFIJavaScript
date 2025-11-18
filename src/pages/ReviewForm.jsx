import React, { useContext, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ReviewForm = ({ postId, onAdded }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
        setError('Debes iniciar sesión para comentar.');
        return;
    }

    setLoading(true);
    setError(null);
    try {
      // 🚨 CORRECCIÓN CRÍTICA: Cambiamos la URL a la ruta de comentarios correcta en Flask.
      // Flask usa el endpoint: /api/posts/<post_id>/comments
      const url = `/posts/${postId}/comments`;
      
      // Enviamos solo el contenido. El backend debe obtener el user_id (autor)
      // del token JWT por seguridad.
      const reviewData = { 
        content: content, 
      };

      await api.post(url, reviewData);
      
      setContent('');
      if (onAdded) onAdded();
      
    } catch (e) {
      console.error("Error al enviar review:", e.response?.data || e.message);
      // Intentamos mostrar un mensaje de error más específico si viene del servidor
      const errorMessage = e.response?.data?.msg || 'Error al enviar el comentario. Inténtalo de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={submit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-2">
        <Form.Control 
          as="textarea" 
          rows={3} 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          placeholder={user ? "Escribe tu comentario aquí..." : "Inicia sesión para poder comentar."}
          required 
          disabled={!user || loading}
        />
      </Form.Group>
      <div className="d-flex justify-content-between align-items-center">
        <p className="small text-muted mb-0">Comentando como: **{user ? user.name || user.email : 'Invitado'}**</p>
        <Button 
          type="submit" 
          disabled={!user || loading || content.trim() === ''}
          className="btn-primary"
        >
          {loading ? 'Enviando...' : 'Enviar Comentario'}
        </Button>
      </div>
    </Form>
  );
};

export default ReviewForm;