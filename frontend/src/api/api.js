import axios from 'axios';

const api = axios.create({
  baseURL: 'https://event-master-forl.onrender.com' // L'URL que tu as copiée de Render
});

// Ajout du token pour les requêtes authentifiées
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;