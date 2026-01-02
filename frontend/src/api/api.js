import axios from 'axios';

const api = axios.create({
  baseURL: 'https://event-master-forl.onrender.com'
});

// C'est ce bloc qui ajoute le token à CHAQUE requête (POST, PUT, DELETE)
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;