import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const PostForm = ({ edit }) => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    if (edit && id) {
      api.get(`/posts/${id}`).then(r => setForm({ title: r.data.title, content: r.data.content }));
    }
  }, [edit, id]);

  const submit = async (e) => {
    e.preventDefault();
    if (edit) {
      await api.put(`/posts/${id}`, form);
    } else {
      await api.post('/posts', { ...form, author: user.name });
    }
    nav('/posts');
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 800 }}>
      <Card.Body>
        <h3>{edit ? 'Editar Post' : 'Nuevo Post'}</h3>
        <Form onSubmit={submit}>
          <Form.Group className="mb-2">
            <Form.Label>Título</Form.Label>
            <Form.Control name="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Contenido</Form.Label>
            <Form.Control as="textarea" rows={6} name="content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          </Form.Group>
          <Button type="submit">Guardar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostForm;
