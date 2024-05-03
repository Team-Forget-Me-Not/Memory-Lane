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
      <div className="calendar-container">
        <h2 className="calendar-title">My Calendar</h2>
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
