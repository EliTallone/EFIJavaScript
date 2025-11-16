import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    const res = await api.get('/posts');
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Eliminar post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Posts</h3>
        {user && <Button as={Link} to="/posts/new">Nuevo Post</Button>}
      </div>
      {posts.map(p => (
        <Card className="mb-2" key={p.id}>
          <Card.Body>
            <Card.Title>{p.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{p.author} - {new Date(p.created_at).toLocaleString()}</Card.Subtitle>
            <Card.Text>{p.content?.slice(0, 200)}...</Card.Text>
            <Button as={Link} to={`/posts/${p.id}`}>Ver</Button>{' '}
            {user && (user.role === 'admin' || user.email === p.author_email) && (
              <>
                <Button variant="warning" as={Link} to={`/posts/${p.id}/edit`}>Editar</Button>{' '}
                <Button variant="danger" onClick={() => remove(p.id)}>Eliminar</Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default PostsList;
