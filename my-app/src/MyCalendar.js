import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editStart, setEditStart] = useState(null);
  const [editEnd, setEditEnd] = useState(null);
  const localizer = momentLocalizer(moment);
  const auth = getAuth();
  const editModalRef = useRef(null);

  useEffect(() => {
    const loadEvents = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const db = getFirestore();
        const eventsCollection = collection(db, 'appointments-events', currentUser.uid, 'appointments-events');
        const snapshot = await getDocs(eventsCollection);
        const loadedEvents = snapshot.docs.map(doc => {
          const eventData = doc.data();
          return {
            id: doc.id,
            ...eventData,
            start: eventData.start.toDate ? eventData.start.toDate() : new Date(eventData.start),
            end: eventData.end.toDate ? eventData.end.toDate() : new Date(eventData.end)
          };
        });
        setEvents(loadedEvents);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        loadEvents();
      } else {
        setEvents([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleSelectSlot = async ({ start, end }) => {
    const title = window.prompt('Enter event title:');
    const currentUser = auth.currentUser;
    if (title && currentUser) {
      const db = getFirestore();
      const eventsCollection = collection(db, 'appointments-events', currentUser.uid, 'appointments-events');
      const newEvent = {
        title,
        createdAt: serverTimestamp(),
        start,
        end,
      };
      try {
        const docRef = await addDoc(eventsCollection, newEvent);
        const updatedEvents = [...events, { id: docRef.id, ...newEvent }];
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  const handleEventClick = (event, e) => {
    e.preventDefault(); // Prevent default behavior of the click event
    setSelectedEvent(event);
  };

  const handleDeleteEvent = async (event) => {
    const db = getFirestore();
    const eventsCollection = collection(db, 'appointments-events', auth.currentUser.uid, 'appointments-events');
    try {
      await deleteDoc(doc(eventsCollection, event.id));
      const updatedEvents = events.filter(e => e.id !== event.id);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
    setSelectedEvent(null);
  };

  const handleEditEvent = async () => {
    const db = getFirestore();
    const eventsCollection = collection(db, 'appointments-events', auth.currentUser.uid, 'appointments-events');
    try {
      await updateDoc(doc(eventsCollection, selectedEvent.id), {
        title: editTitle,
        start: editStart,
        end: editEnd
      });
      const updatedEvents = events.map(e => e.id === selectedEvent.id ? { ...e, title: editTitle, start: editStart, end: editEnd } : e);
      setEvents(updatedEvents);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const openEditModal = () => {
    setEditTitle(selectedEvent.title);
    setEditStart(selectedEvent.start);
    setEditEnd(selectedEvent.end);
    setEditModalOpen(true);
  };

  return (
    <div className="my-calendar">
      <div className="calendar-container">
        <h2 className="calendar-title">My Calendar</h2>
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '600px' }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>
      {selectedEvent && (
        <div className="event-details">
          <h3>Event Details</h3>
          <p><strong>Title:</strong> {selectedEvent.title}</p>
          <p><strong>Start:</strong> {selectedEvent.start.toString()}</p>
          <p><strong>End:</strong> {selectedEvent.end.toString()}</p>
          <div className="button-group">
            <button className="delete-button" onClick={() => handleDeleteEvent(selectedEvent)}>Delete</button>
            <button className="edit-button" onClick={openEditModal}>Edit</button>
          </div>
        </div>
      )}
      {editModalOpen && selectedEvent && (
        <div className="edit-modal" ref={editModalRef}>
          <h3>Edit Event</h3>
          <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
          <input type="datetime-local" value={moment(editStart).format('YYYY-MM-DDTHH:mm')} onChange={e => setEditStart(new Date(e.target.value))} />
          <input type="datetime-local" value={moment(editEnd).format('YYYY-MM-DDTHH:mm')} onChange={e => setEditEnd(new Date(e.target.value))} />
          <div className="button-group">
            <button className="save-button" onClick={handleEditEvent}>Save</button>
            <button className="cancel-button" onClick={() => setEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
