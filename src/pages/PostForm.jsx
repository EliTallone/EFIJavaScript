import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const PostForm = ({ edit }) => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  // Los valores deben coincidir con el backend
  const [form, setForm] = useState({ titulo: '', contenido: '' });

  useEffect(() => {
    if (edit && id) {
      api.get(`/posts/${id}`).then(r => {
        setForm({
          titulo: r.data.titulo,
          contenido: r.data.contenido
        });
      });
    }
  }, [edit, id]);

  const submit = async (e) => {
    e.preventDefault();

    if (edit) {
      await api.put(`/posts/${id}`, {
        titulo: form.titulo,
        contenido: form.contenido
      });
    } else {
      await api.post('/posts', {
        titulo: form.titulo,
        contenido: form.contenido
      });
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
            <Form.Control
              name="titulo"
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              name="contenido"
              value={form.contenido}
              onChange={e => setForm({ ...form, contenido: e.target.value })}
              required
            />
          </Form.Group>

          <Button type="submit">Guardar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostForm;
