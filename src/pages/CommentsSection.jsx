import React, { useState, useEffect, useContext } from 'react';
// Asumo que tienes un contexto o hook useAuth para el estado de autenticación y el rol
// y un hook useAPI para las llamadas fetch encapsuladas.
// Asegúrate de reemplazar estos imports con tus implementaciones reales.
import { useAuth } from '../context/AuthContext'; // Asumiendo este path
import { useAPI } from '../hooks/useAPI'; // Asumiendo este path
import { AlertTriangle, Edit3, Trash2, Send } from 'lucide-react';

// Componente para mostrar un solo comentario
const CommentCard = ({ comment, userId, userRole, onDelete, onEdit }) => {
    const isOwner = comment.autor.id === userId;
    const canModerate = userRole === 'admin' || userRole === 'moderator';
    const canEditOrDelete = isOwner || canModerate;
    
    // Formatear la fecha
    const formattedDate = new Date(comment.created_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="border-b border-gray-100 p-4 mb-2 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-gray-800">
                    {comment.autor.username} 
                    {isOwner && <span className="ml-2 text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Tú</span>}
                </p>
                <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-3 break-words whitespace-pre-wrap">
                {comment.contenido}
            </p>

            {canEditOrDelete && (
                <div className="flex space-x-2 justify-end">
                    <button 
                        onClick={() => onEdit(comment)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition duration-150 p-1 rounded-md hover:bg-blue-50"
                        title="Editar comentario"
                    >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Editar
                    </button>
                    <button 
                        onClick={() => onDelete(comment.id)}
                        className="flex items-center text-sm text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-md hover:bg-red-50"
                        title="Eliminar (Ocultar) comentario"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

// Componente para el formulario de creación/edición
const CommentForm = ({ post_id, commentToEdit, onCommentSubmitted, isEditing, setIsEditing }) => {
    const { token } = useAuth();
    const { apiRequest } = useAPI();
    const [content, setContent] = useState(commentToEdit ? commentToEdit.contenido : '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (commentToEdit) {
            setContent(commentToEdit.contenido);
        } else {
            setContent('');
        }
    }, [commentToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (content.trim().length < 2) {
            setError("El comentario debe tener al menos 2 caracteres.");
            setLoading(false);
            return;
        }

        try {
            let response;
            let method = isEditing ? 'PUT' : 'POST';
            let url = isEditing 
                ? `/comments/${commentToEdit.id}` 
                : `/posts/${post_id}/comments`;
            
            response = await apiRequest(url, method, { contenido: content }, token);
            
            if (response.status === 'success') {
                // Notificar al padre y limpiar/resetear
                onCommentSubmitted(response.data); 
                setContent('');
                if (isEditing) {
                    setIsEditing(false); // Salir del modo edición
                }
            } else {
                setError(response.message || "Error desconocido al procesar el comentario.");
            }
        } catch (err) {
            setError(err.message || "Error de conexión con la API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-xl shadow-inner mb-6">
            <h3 className="text-xl font-bold text-gray-700 mb-3">
                {isEditing ? 'Editar Comentario' : 'Deja un Comentario'}
            </h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-y min-h-[100px]"
                    placeholder="Escribe tu comentario aquí..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                />
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-2" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-3">
                    {isEditing && (
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : (
                            isEditing ? 'Guardar Cambios' : 'Publicar Comentario'
                        )}
                        <Send className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </form>
        </div>
    );
};


// Componente principal de la sección de comentarios
export default function CommentsSection({ post_id }) {
    const { isAuthenticated, user, token } = useAuth();
    const { apiRequest } = useAPI();
    
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    
    const [commentToEdit, setCommentToEdit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // 1. Cargar comentarios
    const fetchComments = async () => {
        setLoading(true);
        setGlobalError(null);
        try {
            const response = await apiRequest(`/posts/${post_id}/comments`, 'GET');
            
            if (response.status === 'success' && Array.isArray(response.data)) {
                // Ordenar por fecha de creación descendente si el backend no lo hizo
                const sortedComments = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setComments(sortedComments);
            } else {
                setGlobalError(response.message || "No se pudieron cargar los comentarios.");
                setComments([]);
            }
        } catch (err) {
            setGlobalError(err.message || "Error al conectar con la API para cargar comentarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post_id]);


    // 2. Manejar la creación/actualización
    const handleCommentSubmitted = (newComment) => {
        if (isEditing) {
            // Actualizar la lista con el comentario editado
            setComments(comments.map(c => c.id === newComment.id ? newComment : c));
            setCommentToEdit(null);
            setIsEditing(false);
        } else {
            // Agregar el nuevo comentario al final de la lista
            setComments([...comments, newComment]);
        }
    };

    // 3. Iniciar edición
    const startEdit = (comment) => {
        setCommentToEdit(comment);
        setIsEditing(true);
    };

    // 4. Manejar la eliminación (lógica: is_visible = False)
    const handleDelete = async (commentId) => {
        if (!window.confirm("¿Estás seguro de que quieres ocultar este comentario?")) {
            return;
        }

        try {
            // DELETE endpoint oculta el comentario (HTTP 204 No Content)
            const response = await apiRequest(`/comments/${commentId}`, 'DELETE', null, token);
            
            if (response.status === 'success' || response.status === 204) {
                // Si la eliminación fue lógica, recargamos la lista o filtramos
                alert("Comentario ocultado exitosamente.");
                // Filtramos el comentario de la lista localmente
                setComments(comments.filter(c => c.id !== commentId));
            } else {
                alert(response.message || "Error al intentar ocultar el comentario.");
            }
        } catch (err) {
            alert(err.message || "Error de conexión al intentar ocultar el comentario.");
        }
    };


    if (loading) {
        return <div className="p-4 text-center text-gray-500">Cargando comentarios...</div>;
    }
    
    return (
        <div className="max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                Comentarios ({comments.length})
            </h2>

            {/* Formulario de Creación/Edición */}
            {isAuthenticated ? (
                <CommentForm 
                    post_id={post_id} 
                    commentToEdit={commentToEdit}
                    onCommentSubmitted={handleCommentSubmitted}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
            ) : (
                <div className="p-4 mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <p className="text-sm">
                        Debes <span className="font-bold">iniciar sesión</span> para dejar un comentario.
                    </p>
                </div>
            )}

            {/* Lista de Comentarios */}
            <div className="space-y-4">
                {globalError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <p>{globalError}</p>
                    </div>
                )}
                
                {comments.length === 0 ? (
                    <p className="text-gray-500 p-4 text-center border border-dashed rounded-lg">
                        Sé el primero en comentar.
                    </p>
                ) : (
                    comments.map(comment => (
                        <CommentCard 
                            key={comment.id}
                            comment={comment}
                            userId={user?.id}
                            userRole={user?.role}
                            onDelete={handleDelete}
                            onEdit={startEdit}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// Nota: Asegúrate de que `post_id` se pase como prop al montar este componente.
// Ejemplo: <CommentsSection post_id={post.id} />