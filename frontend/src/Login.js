import React, { useState } from 'react';
import api from './api/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      // On enregistre le token et l'utilisateur dans le navigateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLoginSuccess(response.data.user);
    } catch (err) {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div style={{ border: '1px solid #000', padding: '20px', maxWidth: '300px', margin: '20px 0' }}>
      <h3>Connexion</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', marginBottom: '10px' }} required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;