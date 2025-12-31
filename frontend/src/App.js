import React, { useEffect, useState } from 'react';
import api from './api/api';
import Login from './Login';
import Register from './Register';
import AddEvent from './AddEvent';
import EventCalendar from './EventCalendar';
import StatsDashboard from './StatsDashboard';

function App() {
  // --- ÉTATS (STATES) ---
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showAuth, setShowAuth] = useState(null); // 'login', 'register' ou null
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' ou 'my-registrations'

  // --- ACTIONS ---
  const fetchEvents = () => {
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Erreur chargement events:", err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  const handleRegistration = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      alert(res.data.message);
      fetchEvents();
    } catch (err) {
      alert("Erreur d'inscription. Vérifiez votre connexion.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer définitivement cet événement ?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // --- FILTRAGE DES DONNÉES ---
  const registeredEvents = events.filter(event => 
    event.participants?.some(p => p.userId === user?.id)
  );

  const eventsToDisplay = activeTab === 'all' ? events : registeredEvents;

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* --- BARRE DE NAVIGATION --- */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 10%', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <h2 style={{ margin: 0, color: '#4A90E2', cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => {setActiveTab('all'); window.scrollTo(0,0)}}>🚀 EventMaster</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem' }}>Bienvenue, <strong>{user.name}</strong></span>
              <button onClick={handleLogout} style={{ padding: '8px 18px', borderRadius: '20px', border: '1px solid #ff4d4d', color: '#ff4d4d', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Déconnexion</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuth('login')} style={{ background: 'none', border: 'none', color: '#4A90E2', cursor: 'pointer', fontWeight: 'bold' }}>Connexion</button>
              <button onClick={() => setShowAuth('register')} style={{ background: '#4A90E2', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>S'inscrire</button>
            </>
          )}
        </div>
      </nav>

      {/* --- MODALES D'AUTHENTIFICATION --- */}
      {showAuth && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', padding: '35px', borderRadius: '20px', width: '90%', maxWidth: '420px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setShowAuth(null)} style={{ position: 'absolute', top: 15, right: 15, border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#aaa' }}>&times;</button>
            {showAuth === 'login' ? 
              <Login onLoginSuccess={(u) => { setUser(u); setShowAuth(null); fetchEvents(); }} /> : 
              <Register onSwitchToLogin={() => setShowAuth('login')} />
            }
          </div>
        </div>
      )}

      {/* --- CONTENU PRINCIPAL --- */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {user && (
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>📊 Votre Tableau de Bord</h2>
            <StatsDashboard events={events} userId={user.id} />
            
            <AddEvent 
              onEventAdded={fetchEvents} 
              editingEvent={editingEvent} 
              setEditingEvent={setEditingEvent} 
            />
          </section>
        )}

        <section style={{ marginBottom: '50px' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '25px' }}>📅 Calendrier des activités</h2>
          <EventCalendar events={events} />
        </section>

        {/* --- SYSTÈME D'ONGLETS --- */}
        <div style={{ display: 'flex', gap: '30px', borderBottom: '2px solid #eee', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('all')}
            style={{ 
              padding: '15px 5px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem',
              borderBottom: activeTab === 'all' ? '4px solid #4A90E2' : 'none',
              color: activeTab === 'all' ? '#4A90E2' : '#888',
              fontWeight: activeTab === 'all' ? 'bold' : '500'
            }}
          >
            Tous les événements
          </button>
          {user && (
            <button 
              onClick={() => setActiveTab('my-registrations')}
              style={{ 
                padding: '15px 5px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem',
                borderBottom: activeTab === 'my-registrations' ? '4px solid #50E3C2' : 'none',
                color: activeTab === 'my-registrations' ? '#50E3C2' : '#888',
                fontWeight: activeTab === 'my-registrations' ? 'bold' : '500'
              }}
            >
              Mes inscriptions ({registeredEvents.length})
            </button>
          )}
        </div>

        {/* --- GRILLE DYNAMIQUE D'ÉVÉNEMENTS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {eventsToDisplay.length > 0 ? (
            eventsToDisplay.map(event => {
              const isUserRegistered = event.participants?.some(p => p.userId === user?.id);
              
              return (
                <div key={event.id} style={{ 
                  background: 'white', borderRadius: '15px', padding: '25px', 
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  border: isUserRegistered ? '2px solid #50E3C2' : '1px solid #f0f0f0',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                  {isUserRegistered && (
                    <span style={{ position: 'absolute', top: 15, right: 15, background: '#50E3C2', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>INSCRIT</span>
                  )}
                  
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', color: '#2C3E50', fontSize: '1.3rem' }}>{event.title}</h3>
                    <p style={{ color: '#7F8C8D', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>{event.description}</p>
                    
                    <div style={{ fontSize: '0.85rem', color: '#95A5A6', marginBottom: '20px' }}>
                      <p style={{ margin: '6px 0' }}>📍 <strong>Lieu:</strong> {event.location}</p>
                      <p style={{ margin: '6px 0' }}>📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p style={{ margin: '6px 0' }}>👤 <strong>Par:</strong> {event.organizer?.name}</p>

                      <div style={{ 
                        marginTop: '15px', 
                        padding: '8px', 
                        background: '#F9F9F9', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#4A90E2',
                        fontWeight: 'bold'
                      }}>
                        👥 {event.participants?.length || 0} participant(s)
                      </div>
                    </div>
                  </div>

                  <div>
                    {user && user.id === event.organizerId && (
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button onClick={() => { setEditingEvent(event); window.scrollTo({top:0, behavior:'smooth'}); }} style={{ flex: 1, background: '#F5A623', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Modifier</button>
                        <button onClick={() => handleDelete(event.id)} style={{ flex: 1, background: '#FF4D4D', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Supprimer</button>
                      </div>
                    )}

                    <button 
                      onClick={() => handleRegistration(event.id)}
                      style={{ 
                        width: '100%', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                        background: isUserRegistered ? '#fff' : '#4A90E2',
                        color: isUserRegistered ? '#4A90E2' : 'white',
                        border: '2px solid #4A90E2',
                        transition: '0.3s'
                      }}
                    >
                      {isUserRegistered ? "Se désinscrire" : "S'inscrire maintenant"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px', background: '#f9f9f9', borderRadius: '20px', color: '#999' }}>
              <p style={{ fontSize: '1.2rem' }}>Aucun événement ne correspond à cette catégorie.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* --- FOOTER --- */}
      <footer style={{ textAlign: 'center', padding: '40px', color: '#bbb', fontSize: '0.9rem' }}>
        &copy; 2025 EventMaster
      </footer>
    </div>
  );
}

export default App;