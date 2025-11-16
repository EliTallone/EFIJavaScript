import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Card } from 'react-bootstrap';
import ReviewForm from './ReviewForm';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => { api.get(`/posts/${id}`).then(r => setPost(r.data)); }, [id]);

  if (!post) return <div>Cargando...</div>;

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{post.author} - {new Date(post.created_at).toLocaleString()}</Card.Subtitle>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
      </Card>

      <h4 className="mt-4">Reviews</h4>
      <ReviewForm postId={id} onAdded={() => api.get(`/posts/${id}`).then(r => setPost(r.data))} />

      <div className="mt-3">
        {post.reviews?.map(r => (
          <Card className="mb-2" key={r.id}><Card.Body>
            <Card.Subtitle className="mb-1 text-muted">{r.author} - {new Date(r.created_at).toLocaleString()}</Card.Subtitle>
            <Card.Text>{r.content}</Card.Text>
          </Card.Body></Card>
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
