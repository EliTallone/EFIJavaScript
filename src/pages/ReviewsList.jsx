import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Card, Button, Alert } from 'react-bootstrap';

const ReviewsList = ({ postId, onReviewsUpdated }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Ruta correcta del BACKEND
      const response = await api.get(`/posts/${postId}/comments`);

      // Tu backend devuelve { status, data: [comentarios] }
      setReviews(response.data.data || []);
    } catch (e) {
      console.error("Error al cargar reviews:", e);
      setError("No se pudieron cargar los comentarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchReviews();
    }
  }, [postId, onReviewsUpdated]);

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar review?')) return;

    try {
      // ✅ Ruta correcta de DELETE en tu backend
      await api.delete(`/comments/${id}`);

      // recargar lista
      fetchReviews();
    } catch (e) {
      console.error("Error al eliminar review:", e);
      alert("Error al eliminar el comentario.");
    }
  };

  if (loading) return <p>Cargando comentarios...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h3>Reviews ({reviews.length})</h3>

      {reviews.length === 0 ? (
        <p className="text-muted">Sé el primero en comentar.</p>
      ) : (
        reviews.map(r => (
          <Card className="mb-3 shadow-sm border-light" key={r.id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">

                <Card.Subtitle className="mb-1 text-muted small">
                  {/* Tu backend devuelve esto: autor: { id, username } */}
                  {r.autor?.username || "Usuario"} —{" "}
                  {new Date(r.created_at).toLocaleString()}
                </Card.Subtitle>

                {(user?.role === 'admin' || user?.id === r.usuario_id) && (
                  <Button variant="outline-danger" size="sm" onClick={() => remove(r.id)}>
                    Eliminar
                  </Button>
                )}
              </div>

              {/* Tu backend devuelve "contenido", NO "content" */}
              <Card.Text className="mt-2">{r.contenido}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
