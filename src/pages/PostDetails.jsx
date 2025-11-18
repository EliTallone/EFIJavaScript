import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spinner, Alert, Container, Button } from 'react-bootstrap';
import api from '../api';
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

const PostDetails = () => {
  const { id } = useParams();
  const postId = parseInt(id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadReviews, setReloadReviews] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error("Error cargando post:", err);
        setError("No se pudo cargar el post.");
      }

      setLoading(false);
    };

    if (!isNaN(postId)) {
      fetchPost();
    }
  }, [postId]);

  const handleReviewAdded = () => {
    setReloadReviews(prev => prev + 1);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando post...</p>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || "Post no encontrado"}</Alert>
        <Button variant="link" onClick={() => window.history.back()}>Volver</Button>
      </Container>
    );
  }

  // ---------------------------
  //   CAMPOS SEGÚN TU BACKEND
  // ---------------------------
  const postTitle = post.titulo || "Sin título";
  const postContent = post.contenido || "Sin contenido";

  // Autor (tu backend solo envía autor_id)
  const postAuthor = post.autor_id
    ? `Usuario #${post.autor_id}`
    : "Autor desconocido";

  // Fecha (tu backend actualmente NO envía created_at)
  const postDate = post.created_at || "No disponible";

  return (
    <Container className="my-4">
      <Card className="shadow-lg border-0 mb-4">
        <Card.Body>
          <Card.Title as="h1">{postTitle}</Card.Title>

          <Card.Subtitle className="mb-3 text-muted small">
            Por: <strong>{postAuthor}</strong> — Publicado el: <strong>{postDate}</strong>
          </Card.Subtitle>

          <hr />

          <Card.Text style={{ whiteSpace: "pre-wrap" }}>
            {postContent}
          </Card.Text>
        </Card.Body>
      </Card>

      <h2 className="mt-5 mb-3">Comentarios</h2>

      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <h4>Añadir comentario</h4>
          <ReviewForm postId={postId} onAdded={handleReviewAdded} />
        </Card.Body>
      </Card>

      <ReviewsList postId={postId} onReviewsUpdated={reloadReviews} />
    </Container>
  );
};

export default PostDetails;
