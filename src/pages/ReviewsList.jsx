import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Card, Button } from 'react-bootstrap';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => { api.get('/reviews').then(r => setReviews(r.data)); }, []);

  const remove = async (id) => {
    if (!window.confirm('Eliminar review?')) return;
    await api.delete(`/reviews/${id}`);
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map(r => (
        <Card className="mb-2" key={r.id}><Card.Body>
          <Card.Subtitle className="mb-1 text-muted">{r.author} - {new Date(r.created_at).toLocaleString()}</Card.Subtitle>
          <Card.Text>{r.content}</Card.Text>
          {(user?.role === 'admin' || user?.email === r.author_email) && (
            <Button variant="danger" onClick={() => remove(r.id)}>Eliminar</Button>
          )}
        </Card.Body></Card>
      ))}
    </div>
  );
};

export default ReviewsList;
