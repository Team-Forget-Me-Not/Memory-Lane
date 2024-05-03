import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';

const MyCalendar = () => {
  const events = [
    {
      title: 'Team Meeting',
      start: new Date(),
      end: new Date(),
    },
    // Add more events as needed
  ];

  const localizer = momentLocalizer(moment);

  return (
    <div className="my-calendar">
      <div style={{ height: '600px', margin: '20px', width: '500px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default MyCalendar;
