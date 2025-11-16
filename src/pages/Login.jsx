import React, { useState, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login({ email: form.email, password: form.password });
    if (ok) nav('/posts');
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 540 }}>
      <Card.Body>
        <h3>Login</h3>
        <Form onSubmit={submit}>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handle} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handle} required />
          </Form.Group>
          <Button type="submit">Ingresar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;
