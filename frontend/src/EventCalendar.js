import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import du style par défaut

function EventCalendar({ events }) {
  // Fonction pour ajouter une petite pastille sous les dates qui ont un événement
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasEvent = events.some(event => 
        new Date(event.date).toDateString() === date.toDateString()
      );
      return hasEvent ? <div style={{ color: 'blue', fontWeight: 'bold' }}>•</div> : null;
    }
  };

  return (
    <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '10px', background: 'white' }}>
        <Calendar 
          tileContent={tileContent}
          className="my-custom-calendar"
        />
      </div>
    </div>
  );
}

export default EventCalendar;