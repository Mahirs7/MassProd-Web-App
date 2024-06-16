// src/components/Schedule.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { firestore, auth } from '../firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Schedule.css';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const { projectId } = useParams();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    allDay: false,
  });
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(firestore, 'projects', projectId, 'events'));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().start.toDate(),
        end: doc.data().end.toDate(),
      }));
      setEvents(eventsData);
    };

    fetchEvents();
  }, [projectId]);

  const handleAddEvent = async () => {
    try {
      const eventDocRef = await addDoc(collection(firestore, 'projects', projectId, 'events'), {
        ...newEvent,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      });

      setEvents([...events, { id: eventDocRef.id, ...newEvent }]);
      setNewEvent({ title: '', start: '', end: '', allDay: false });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
  };

  return (
    <div className="schedule-container">
      <h3>Schedule</h3>
      {(user?.email === 'sumit@mass-studios.com' || user?.role === 'head') && (
        <div className="add-event-form">
          <input
            type="text"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <label>Start Date and Time</label>
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
          <label>End Date and Time</label>
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        views={['month', 'week', 'day']}
        components={{
          event: ({ event }) => <span className="event">{event.title}</span>,
        }}
      />
    </div>
  );
};

export default Schedule;
