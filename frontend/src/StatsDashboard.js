import React from 'react';

function StatsDashboard({ events, userId }) {
  // Calculs dynamiques
  const createdByMe = events.filter(e => e.organizerId === userId).length;
  const registeredTo = events.filter(e => e.participants?.some(p => p.userId === userId)).length;
  const totalParticipants = events
    .filter(e => e.organizerId === userId)
    .reduce((acc, curr) => acc + (curr.participants?.length || 0), 0);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px', 
      marginBottom: '30px' 
    }}>
      <div style={cardStyle('#4A90E2')}>
        <h4 style={labelStyle}>Événements créés</h4>
        <p style={valueStyle}>{createdByMe}</p>
      </div>
      <div style={cardStyle('#50E3C2')}>
        <h4 style={labelStyle}>Mes inscriptions</h4>
        <p style={valueStyle}>{registeredTo}</p>
      </div>
      <div style={cardStyle('#F5A623')}>
        <h4 style={labelStyle}>Total inscrits à mes events</h4>
        <p style={valueStyle}>{totalParticipants}</p>
      </div>
    </div>
  );
}

// Styles rapides en JS
const cardStyle = (color) => ({
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  borderTop: `5px solid ${color}`,
  textAlign: 'center'
});

const labelStyle = { margin: 0, color: '#888', fontSize: '0.9rem', fontWeight: 'normal' };
const valueStyle = { margin: '10px 0 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#333' };

export default StatsDashboard;