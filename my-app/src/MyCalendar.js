import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';
import { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const localizer = momentLocalizer(moment);
  const auth = getAuth();

  useEffect(() => {
    const loadEvents = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const db = getFirestore();
        const eventsCollection = collection(db, 'appointments-events', currentUser.uid, 'appointments-events');
        const snapshot = await getDocs(eventsCollection);
        const loadedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(loadedEvents);
        // Store events in local storage
        localStorage.setItem('events', JSON.stringify(loadedEvents));
      }
    };

    // Load events when component mounts
    loadEvents();

    // Listen for authentication changes and reload events accordingly
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        loadEvents();
      } else {
        setEvents([]);
        localStorage.removeItem('events'); // Clear local storage when user logs out
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
        localStorage.setItem('events', JSON.stringify(updatedEvents)); // Update local storage
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
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
          />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
