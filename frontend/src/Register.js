import React, { useState } from 'react';
import api from './api/api';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Compte créé avec succès ! Connectez-vous maintenant.");
      onSwitchToLogin(); // Redirige vers le login
    } catch (err) {
      setError("Cet email est déjà utilisé.");
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', borderRadius: '10px' }}>
      <h3>Créer un compte</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Nom complet" required onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Mot de passe" required onChange={e => setFormData({...formData, password: e.target.value})} />
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>S'inscrire</button>
        <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>Déjà un compte ? Se connecter</button>
      </form>
    </div>
  );
}

export default Register;