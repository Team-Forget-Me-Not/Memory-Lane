// Calendar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Calendar.css';

const Calendar = ({ currentDate = new Date(), onDateClick, fetchEntryDetails }) => {
  const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const createCalendar = () => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarGrid = Array.from({ length: firstDayOfMonth }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      calendarGrid.push(day);
    }

    return (
      <div className="calendar-grid">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="day-header">
            {day}
          </div>
        ))}
        {calendarGrid.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day !== null ? "active" : "inactive"} ${day === selectedDay ? "selected" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day !== null ? (
              <Link to={`/entry/${calendarYear}/${calendarMonth + 1}/${day}`} onClick={(e) => e.preventDefault()}>
                {day}
              </Link>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleNavigation = (type) => {
    if (type === 'previousYear') {
      setCalendarYear((prevYear) => prevYear - 1);
    } else if (type === 'previousMonth') {
      setCalendarMonth((prevMonth) => (prevMonth - 1 + 12) % 12);
    } else if (type === 'nextMonth') {
      setCalendarMonth((nextMonth) => (nextMonth + 1) % 12);
    } else if (type === 'nextYear') {
      setCalendarYear((nextYear) => nextYear + 1);
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onDateClick) {
      const selectedDate = new Date(calendarYear, calendarMonth, day);
      onDateClick(selectedDate);
    }
  };

  useEffect(() => {
    if (fetchEntryDetails) {
      fetchEntryDetails(new Date(calendarYear, calendarMonth, 1));
    }
  }, [calendarYear, calendarMonth, fetchEntryDetails]);

  return (
    <div className="calendar">
      <button onClick={() => handleNavigation('previousYear')}>Previous Year</button>
      <button onClick={() => handleNavigation('previousMonth')}>Previous Month</button>
      <h2>{`${monthNames[calendarMonth]} - ${calendarYear}`}</h2>
      <button onClick={() => handleNavigation('nextMonth')}>Next Month</button>
      <button onClick={() => handleNavigation('nextYear')}>Next Year</button>
      {createCalendar()}
    </div>
  );
};

export default Calendar;
