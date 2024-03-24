// Calendar.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Calendar.css';

// Calendar component with optional props: currentDate and onDayClick
const Calendar = ({ currentDate = new Date(), onDayClick }) => {
  // State variables for calendar year, month, and selected day
  const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  // Array to store month names for display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Function to dynamically create the calendar grid
  const createCalendar = () => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Populate the calendarGrid array with days and null values for padding
    const calendarGrid = Array.from({ length: firstDayOfMonth }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      calendarGrid.push(day);
    }

    // Render the calendar grid with day headers and links to entry pages
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

  // Function to handle navigation button clicks for changing months and years
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

  // Function to handle day clicks, updating the selected day and invoking the provided onDayClick function if available
  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onDayClick) {
      onDayClick(calendarYear, calendarMonth, day);
    }
  };

  // useEffect to call createCalendar when calendar state or selected day changes
  useEffect(() => {
    createCalendar();
  }, [calendarYear, calendarMonth, selectedDay, onDayClick]);

  // JSX rendering of the Calendar component
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

// Export the Calendar component as the default export
export default Calendar;
