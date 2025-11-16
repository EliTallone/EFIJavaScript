# EFI Frontend (React + React Bootstrap)

## Qué incluye
- Registro/Login con JWT (se guarda en localStorage)
- AuthContext que decodifica el token con jwt-decode
- CRUD básico para posts y reviews
- React Router para navegación
- React Bootstrap para componentes y diseño
- Axios para llamadas a la API

## Cómo usar
1. Instalar dependencias:
   npm install

2. Crear un archivo .env en la raíz con:
   VITE_API_BASE_URL=http://localhost:5000/api

3. Ejecutar:
   npm run dev

## Notas
Asegurate de que el backend Flask entregue los endpoints esperados:
- POST /auth/register
- POST /auth/login  -> devuelve { access_token: '...' } o { token: '...' }
- GET /posts
- GET /posts/:id
- POST /posts
- PUT /posts/:id
- DELETE /posts/:id
- GET /reviews
- POST /reviews
- DELETE /reviews/:id

Si la API tiene nombres diferentes, adaptá src/api.js y los componentes.
