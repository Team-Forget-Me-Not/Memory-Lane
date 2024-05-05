import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';
import { 
  getFirestore, collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MyCalendar = () => {
  // State variables
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editStart, setEditStart] = useState(null);
  const [editEnd, setEditEnd] = useState(null);
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  // Moment.js localizer for the calendar
  const localizer = momentLocalizer(moment);
  
  // Firebase authentication
  const auth = getAuth();
  
  // Refs for handling clicks outside the event details and edit modal
  const editModalRef = useRef(null);
  const eventDetailsRef = useRef(null);

  // Effect hook to handle clicks outside the event details
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventDetailsRef.current && !eventDetailsRef.current.contains(event.target)) {
        setSelectedEvent(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effect hook to load events when authentication state changes
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

  // Function to handle selecting a time slot on the calendar
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

  // Function to handle clicking on an event
  const handleEventClick = (event, e) => {
    e.preventDefault(); // Prevent default behavior of the click event
    setSelectedEvent(event);
  };

  // Function to handle deleting an event
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

  // Function to handle editing an event
  const handleEditEvent = async () => {
    const db = getFirestore();
    const eventsCollection = collection(db, 'appointments-events', auth.currentUser.uid, 'appointments-events');
    try {
      await updateDoc(doc(eventsCollection, selectedEvent.id), {
        title: editTitle,
        start: editStart,
        end: editEnd,
        location: editLocation,
        description: editDescription
      });
      const updatedEvents = events.map(e => e.id === selectedEvent.id ? { ...e, title: editTitle, start: editStart, end: editEnd, location: editLocation, description: editDescription } : e);
      setEvents(updatedEvents);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  // Function to open the edit modal
  const openEditModal = () => {
    setEditTitle(selectedEvent.title);
    setEditStart(selectedEvent.start);
    setEditEnd(selectedEvent.end);
    setEditLocation(selectedEvent.location || '');
    setEditDescription(selectedEvent.description || '');
    setEditModalOpen(true);
  };

  // JSX for the component
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
      {/* Display event details when an event is selected */}
      {selectedEvent && !editModalOpen && (
        <div className="event-details" ref={eventDetailsRef}>
          <h3>Event Details</h3>
          <p><strong>Title:</strong> {selectedEvent.title}</p>
          <p><strong>Start:</strong> {selectedEvent.start.toString()}</p>
          <p><strong>End:</strong> {selectedEvent.end.toString()}</p>
          <p><strong>Location:</strong> {selectedEvent.location || 'Not specified'}</p>
          <p><strong>Description:</strong> {selectedEvent.description || 'Not specified'}</p>
          <div className="button-group">
            <button className="edit-button" onClick={openEditModal}>Edit</button>
            <button className="delete-button" onClick={() => handleDeleteEvent(selectedEvent)}>Delete</button>
          </div>
        </div>
      )}
      {/* Display edit modal when an event is selected and edit modal is open */}
      {editModalOpen && selectedEvent && (
        <div className="edit-modal" ref={editModalRef}>
          <h3>Edit Event</h3>
          <label><strong>Title:</strong></label>
          <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
          <label><strong>Start:</strong></label>
          <input type="datetime-local" value={moment(editStart).format('YYYY-MM-DDTHH:mm')} onChange={e => setEditStart(new Date(e.target.value))} />
          <label><strong>End:</strong></label>
          <input type="datetime-local" value={moment(editEnd).format('YYYY-MM-DDTHH:mm')} onChange={e => setEditEnd(new Date(e.target.value))} />
          <label><strong>Location:</strong></label>
          <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="Location" />
          <label><strong>Description:</strong></label>
          <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Description"></textarea>
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
