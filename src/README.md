README — Frontend EFI JavaScript
Proyecto: Aplicación Web con React — Práctica Profesionalizante I (JavaScript)

Este repositorio contiene el frontend desarrollado en React, que consume la API Flask hecha por el equipo para la Evaluación Final Integradora.

El sistema incluye autenticación con JWT, CRUD de posts y reviews, rutas protegidas y manejo de roles.

Integrantes del equipo

Eliana Magalí Tallone 
Lucila Giordano 

Repositorio del Backend (API Flask)

Backend disponible en:
https://github.com/EliTallone/backend




Tecnologías utilizadas

React con Vite

React Router

React Bootstrap

Axios

JWT Decode

Context API

LocalStorage

Hooks de React (useState, useEffect, useContext)

Requisitos previos

Necesitás tener instalado:

Node.js 16 o superior

npm




Backend corriendo en: http://127.0.0.1:5000/api

Instalación y ejecución

Clonar el repositorio:

git clone https://github.com/EliTallone/EFIJavaScript.git
cd EFIJavaScript

Instalar dependencias:
npm install

Ejecutar el servidor de desarrollo:
npm run dev



La app queda disponible en:

http://localhost:5173/




Autenticación

Incluye:

Registro de usuarios

Login con JWT

Guardado del token en localStorage

Decodificación del token

Contexto global de usuario

Logout

Rutas protegidas según rol (admin y user)

Funcionalidades implementadas
Posts

Crear

Listar

Editar

Eliminar

Reviews

Crear

Listar

Editar

Eliminar

Seguridad y roles

Admin: más permisos

User: permisos limitados






Ejecución del backend

En una terminal aparte:
cd backend
source venv/bin/activate
flask run


API base:
http://127.0.0.1:5000/api



