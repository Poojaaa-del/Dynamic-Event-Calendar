import React from 'react';

const EventForm = ({ eventDetails, setEventDetails, onSubmit, isEditing }) => {

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Event Name"
        value={eventDetails.name}
        onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
        required
      />
      <input
        type="time"
        placeholder="Start Time"
        value={eventDetails.startTime}
        onChange={(e) => setEventDetails({ ...eventDetails, startTime: e.target.value })}
        required
      />
      <input
        type="time"
        placeholder="End Time"
        value={eventDetails.endTime}
        onChange={(e) => setEventDetails({ ...eventDetails, endTime: e.target.value })}
        required
      />
      <select 
  value={eventDetails.color} 
  onChange={(e) => setEventDetails({ ...eventDetails, color: e.target.value })}
>
  <option value="#ffcc00">Work</option>
  <option value="#00ccff">Personal</option>
  <option value="#ff6699">Others</option>
</select>
      <textarea
        placeholder="Description"
        value={eventDetails.description}
        onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
      />
      <button type="submit">{isEditing ? 'Update Event' : 'Add Event'}</button>
    </form>
  );
};

export default EventForm;