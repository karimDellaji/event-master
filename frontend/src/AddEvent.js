import React, { useState, useEffect } from 'react';
import api from './api/api';

function AddEvent({ onEventAdded, editingEvent, setEditingEvent }) {
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });

  // Cette fonction remplit le formulaire quand on clique sur modifier
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        // Formatage de la date pour l'input type="date" (YYYY-MM-DD)
        date: editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : '',
        location: editingEvent.location || ''
      });
    } else {
      // Si on n'est plus en mode édition, on vide le formulaire
      setFormData({ title: '', description: '', date: '', location: '' });
    }
  }, [editingEvent]); // Se déclenche à chaque fois que editingEvent change

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, formData);
        alert("Succès : Événement mis à jour !");
        setEditingEvent(null); // On repasse en mode "Création"
      } else {
        await api.post('/events', formData);
        alert("Succès : Événement créé !");
      }
      setFormData({ title: '', description: '', date: '', location: '' });
      onEventAdded();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div id="event-form" style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: editingEvent ? '3px solid #F5A623' : '1px solid #ddd' }}>
      <h3 style={{ color: editingEvent ? '#F5A623' : '#333' }}>
        {editingEvent ? "✏️ Mode Modification" : "✨ Créer un événement"}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
        <input type="text" placeholder="Titre" value={formData.title} required onChange={e => setFormData({...formData, title: e.target.value})} />
        <textarea placeholder="Description" value={formData.description} required onChange={e => setFormData({...formData, description: e.target.value})} />
        <input type="date" value={formData.date} required onChange={e => setFormData({...formData, date: e.target.value})} />
        <input type="text" placeholder="Lieu" value={formData.location} required onChange={e => setFormData({...formData, location: e.target.value})} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 2, background: editingEvent ? '#F5A623' : '#4A90E2', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingEvent ? "Enregistrer les modifications" : "Publier l'événement"}
          </button>
          {editingEvent && (
            <button type="button" onClick={() => setEditingEvent(null)} style={{ flex: 1, background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddEvent;