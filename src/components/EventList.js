import React from 'react';

const EventList = ({ events, onEdit, onDelete }) => {
  return (
    <div className="event-list">
      <h3>Events for the Day</h3>
      {events.length === 0 ? (
        <p>No events scheduled for this day.</p>
      ) : (
        events.map((event, index) => (
          <div key={index} className="event-item">
            <h4>{event.name}</h4>
            <p>{event.startTime} - {event.endTime}</p>
            <p>{event.description}</p>
            <button onClick={() => onEdit(index)}>Edit</button>
            <button onClick={() => onDelete(index)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default EventList;