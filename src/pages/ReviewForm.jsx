import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ReviewForm = ({ postId, onAdded }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/reviews', { post_id: postId, content, author: user.name });
    setContent('');
    if (onAdded) onAdded();
  };

  return (
    <Form onSubmit={submit}>
      <Form.Group>
        <Form.Control as="textarea" rows={3} value={content} onChange={e => setContent(e.target.value)} required />
      </Form.Group>
      <Button type="submit" className="mt-2">Enviar Review</Button>
    </Form>
  );
};

export default ReviewForm;
