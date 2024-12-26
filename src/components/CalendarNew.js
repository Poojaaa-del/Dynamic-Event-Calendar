import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import EventForm from './EventForm';
import EventList from './EventList';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events')) || {});
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventDetails, setEventDetails] = useState({ name: '', startTime: '', endTime: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);

  const handlePrevious = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsEditing(false);
    setEventDetails({ name: '', startTime: '', endTime: '', description: '' });
    setIsModalOpen(true);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
    const newEvent = { ...eventDetails, date: dateKey };

    const existingEvents = events[dateKey] || [];
    const isOverlapping = existingEvents.some(event => {
      return (event.startTime < newEvent.endTime && event.endTime > newEvent.startTime);
    });

    if (isOverlapping) {
      alert('Event time overlaps with an existing event.');
      return;
    }

    if (isEditing) {
      const updatedEvents = existingEvents.map((event, index) => 
        index === editingEventIndex ? newEvent : event
      );
      setEvents(prev => ({ ...prev, [dateKey]: updatedEvents }));
      setIsEditing(false);
    } else {
      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newEvent],
      }));
    }

    setEventDetails({ name: '', startTime: '', endTime: '', description: '' });
  };

  const handleEditEvent = (index) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
    const eventsForDate = events[dateKey];

  if (!eventsForDate || eventsForDate.length <= index) {
    console.error("No event found for the selected index.");
    return; // Exit if no event is found
  }
    const eventToEdit = events[dateKey][index];
    setEventDetails(eventToEdit);
    setIsEditing(true);
    setEditingEventIndex(index);
  };

  const handleDeleteEvent = (index) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
    const updatedEvents = events[dateKey].filter((_, i) => i !== index);
    setEvents(prev => ({ ...prev, [dateKey]: updatedEvents }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
  };

  const handleDragStart = (e, event, dateKey, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ event, dateKey, index }));
  };
  
  const handleDrop = (e, targetDateKey) => {
    e.preventDefault();
    const { event, dateKey, index } = JSON.parse(e.dataTransfer.getData('text/plain'));
  
    // Remove the event from the original date
    const updatedEvents = { ...events };
    updatedEvents[dateKey] = updatedEvents[dateKey].filter((_, i) => i !== index);
  
    // Add the event to the new date
    if (!updatedEvents[targetDateKey]) {
      updatedEvents[targetDateKey] = [];
    }
    updatedEvents[targetDateKey].push(event);
  
    setEvents(updatedEvents);
  };


  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const isCurrentDay = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
      const isSelectedDay = day === selectedDay;
      const isWeekend = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 0 || new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 6;

      days.push(
        <div key={day} className={`day ${isWeekend ? 'weekend' : 'weekday'} ${isCurrentDay ? 'current-day' : ''} ${isSelectedDay ? 'selected-day' : ''}`} onClick={() => handleDayClick(day)}>
          {day}
          {events[dateKey]?.map((event, index) => (
  <div 
    key={index} 
    className="event" 
    draggable 
    onDragStart={(e) => handleDragStart(e, event, dateKey, index)} // Add drag start handler
    onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
    onDrop={(e) => handleDrop(e, dateKey)} // Add drop handler
    style={{ backgroundColor: event.color }} // Set background color based on event type
  >
    {event.name}
    <div className="event-buttons">
      <button onClick={() => handleEditEvent(index)}>Edit</button>
      <button onClick={() => handleDeleteEvent(index)}>Delete</button>
    </div>
  </div>
))}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="month">
        <button onClick={handlePrevious} aria-label="Previous month">Previous</button>
        <h1>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h1>
        <button onClick={handleNext} aria-label="Next month">Next</button>
        </div>

      <div className="days">
        {renderDays()}
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <EventForm
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            onSubmit={handleEventSubmit}
            isEditing={isEditing}
          />
          <EventList
            events={events[`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`] || []}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        </Modal>
      )}
    </div>
  );
};

export default Calendar;