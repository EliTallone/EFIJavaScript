import React, { useEffect, useState, useContext } from 'react';
// La ruta '../api.js' asume que 'api.js' está en 'src/api.js' si PostsList.jsx está en 'src/pages/'
import api from '../api.js'; 
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// La ruta '../contexts/AuthContext.jsx' asume que el contexto está en 'src/contexts/'
import { AuthContext } from '../contexts/AuthContext.jsx'; 

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
        const res = await api.get('/posts');
        // CORRECCIÓN CLAVE: La API devuelve la lista de posts en la propiedad 'items'
        setPosts(res.data.items || []); 
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const remove = async (id) => {
    // Usamos una notificación de confirmación en lugar de window.confirm()
    const isConfirmed = prompt('Escribe "ELIMINAR" para confirmar la eliminación del post:');
    if (isConfirmed !== 'ELIMINAR') return;
    
    try {
        await api.delete(`/posts/${id}`);
        setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
        // En caso de error (ej: 403 Forbidden), usamos console.error en lugar de alert
        console.error("Error al eliminar el post. Puede que no tengas permisos de administrador.", error);
    }
  }; // CIERRE DE LA FUNCIÓN REMOVE

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Posts</h3>
        {user && <Button as={Link} to="/posts/new">Nuevo Post</Button>}
      </div>
      {posts.length === 0 ? (
        <p className="text-center text-muted">No hay posts publicados.</p>
      ) : (
        posts.map(p => {
            
            // Extracción segura de datos
            const autorUsername = p.autor?.username || 'Desconocido';
            
            // Intenta parsear la fecha. El backend usa format='iso' para 'timestamp'
            let fechaPublicacion = 'Fecha inválida';
            try {
                const date = new Date(p.timestamp);
                if (!isNaN(date.getTime())) { // Usamos .getTime() para validar la fecha
                    fechaPublicacion = date.toLocaleString();
                } else {
                    fechaPublicacion = 'Invalid Date';
                }
            } catch (e) {
                console.error("Error parsing date:", e);
            }
            
            // Lógica de permisos para editar/eliminar
            const isOwner = user && user.id === p.autor?.id; 
            const isAdminOrModerator = user && (user.role === 'admin' || user.role === 'moderator');
            const canEditOrDelete = isAdminOrModerator || isOwner;
            
            return (
              <Card className="mb-2 shadow-sm" key={p.id}>
                <Card.Body>
                  {/* Campo de título corregido: 'titulo' en lugar de 'title' */}
                  <Card.Title>{p.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {/* Campos de autor y fecha corregidos */}
                    {autorUsername} - {fechaPublicacion}
                  </Card.Subtitle>
                  {/* Campo de contenido corregido: 'contenido' en lugar de 'content' */}
                  <Card.Text>{p.contenido?.slice(0, 200)}...</Card.Text>
                  <Button as={Link} to={`/posts/${p.id}`}>Ver</Button>{' '}
                  
                  {/* Lógica de edición/eliminación */}
                  {user && canEditOrDelete && (
                    <>
                      <Button variant="warning" as={Link} to={`/posts/${p.id}/edit`}>Editar</Button>{' '}
                      <Button variant="danger" onClick={() => remove(p.id)}>Eliminar</Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            );
        })
      )}
    </div>
  );
};

export default PostsList;