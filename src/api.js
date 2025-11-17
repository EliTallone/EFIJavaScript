import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Token enviado:", token);
  } else {
    console.log("❌ No hay token en localStorage");
  }

  console.log("👉 URL FINAL:", config.baseURL + config.url);
  return config;
});

export default api;
