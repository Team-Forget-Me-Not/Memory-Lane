import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalendarAlt, faPlus, faList, faImages, faTasks, faMusic, faMobileButton, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import Calendar from './Calendar';
import Planner from './Planner'; // Import Planner component

const App = () => {
  // State hooks for managing diary entries and other data
  const [diaryEntries, setDiaryEntries] = useState(() => {
    // Load diary entries from localStorage, or return an empty array if not found
    const storedEntries = localStorage.getItem('diaryEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [entryTitle, setEntryTitle] = useState('');
  const [entryText, setEntryText] = useState('');
  const [image, setImage] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);
  const videoRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);

  // Save diary entries to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  // Function to extract YouTube video ID from a URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  // Function to toggle full screen mode for the video player
  const toggleFullScreen = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      if (!document.fullscreenElement) {
        videoElement.requestFullscreen().catch((err) => {
          console.error('Error attempting to enable full screen:', err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Function to add or update a diary entry
  const addEntry = () => {
    const newEntry = {
      date: currentDate.toLocaleDateString(),
      title: entryTitle,
      text: entryText,
      image: image,
      musicTitle: musicTitle,
      musicLink: musicLink,
    };

    if (editMode) {
      const updatedEntries = [...diaryEntries];
      updatedEntries[editedIndex] = newEntry;
      setDiaryEntries(updatedEntries);
      setEditMode(false);
      setEditedIndex(null);
    } else {
      setDiaryEntries([...diaryEntries, newEntry]);
    }

    // Clear input fields and reset state after adding/updating entry
    setEntryTitle('');
    setEntryText('');
    setImage('');
    setMusicTitle('');
    setMusicLink('');
    setIsTextareaExpanded(false);
  };

  // Function to edit a diary entry
  const editEntry = (index) => {
    const entryToEdit = diaryEntries[index];
    setEntryTitle(entryToEdit.title);
    setEntryText(entryToEdit.text);
    setImage(entryToEdit.image);
    setMusicTitle(entryToEdit.musicTitle);
    setMusicLink(entryToEdit.musicLink);
    setEditMode(true);
    setEditedIndex(index);
  };

  // Function to delete a diary entry
  const deleteEntry = (index) => {
    const filteredIndex = diaryEntries.findIndex(entry => entry.date === currentDate.toLocaleDateString());
    if (filteredIndex !== -1) {
      const updatedEntries = [...diaryEntries];
      updatedEntries.splice(filteredIndex, 1);
      setDiaryEntries(updatedEntries);
    }
  };

  // Function to handle click on a day in the calendar
  const handleDayClick = (year, month, day) => {
    setCurrentDate(new Date(year, month, day));
  };

  // Function to expand the text area for entry text input
  const expandTextarea = () => {
    setIsTextareaExpanded(true);
  };

  // Function to collapse the text area for entry text input
  const collapseTextarea = () => {
    setIsTextareaExpanded(false);
  };

  // Filter diary entries based on the current date
  const filteredEntries = diaryEntries.filter(entry => entry.date === currentDate.toLocaleDateString());

  // Render the component
  return (
    <div className="App">
      <header>
        {/* Navigation links */}
        <Link to="/Front-page" style={{ textDecoration: 'none' }}>
          <img src="MemoryLane.jpeg" alt="Memory Lane" className="logo-image" />
        </Link>
        <nav>
          <Link to="/Front-page" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faHouse} /> Log out
          </Link>
          <Link to="/calendar" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
          </Link>
          <Link to="/planner" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faList} /> Planner
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faUser} /> Profile
          </Link>
        </nav>
      </header>

      <section className="main-section">
        {/* Quick entry form */}
        <div className="quick-entry-form">
          <h2>{currentDate.toDateString()}</h2>
          <Calendar currentDate={currentDate} onDayClick={handleDayClick} />
          <input
            type="text"
            placeholder="Entry Title"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your entry here..."
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            onFocus={expandTextarea}
            onBlur={collapseTextarea}
            style={{ height: isTextareaExpanded ? '200px' : '40px' }}
          />
          {/* Image upload input */}
          <label htmlFor="image-upload" className="image-upload-label">
            <FontAwesomeIcon icon={faImages} /> Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          />
          {/* Music/Video inputs */}
          <input
            type="text"
            placeholder="Music/Video Title"
            value={musicTitle}
            onChange={(e) => setMusicTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Music/Video Link"
            value={musicLink}
            onChange={(e) => setMusicLink(e.target.value)}
          />
          {/* Button to add or update entry */}
          <button onClick={addEntry}>
            <FontAwesomeIcon icon={faSave} /> {editMode ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>

        {/* Display diary entries */}
        <div className="diary-entries">
          {filteredEntries.length === 0 ? (
          <p>No entries for this date.</p>
          ) : (
            filteredEntries.map((entry, index) => (
              <div key={index} className="entry-card">
                <h3>{entry.date}</h3>
                <h4>{entry.title}</h4>
                <p>{entry.text}</p>
                {entry.image && <img src={entry.image} alt="Entry" />}
                {entry.musicTitle && entry.musicLink && (
                  <div className="music-section">
                    <h4>{entry.musicTitle}</h4>
                    {/* Embedded YouTube video */}
                    <iframe
                      ref={videoRef}
                      title="music-player"
                      width="100%"
                      height="166"
                      frameBorder="no"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(entry.musicLink)}`}
                      onClick={toggleFullScreen}
                    ></iframe>
                  </div>
                )}
                {/* Edit and delete buttons */}
                <div>
                  <button onClick={() => editEntry(index)}>Edit</button>
                  <button onClick={() => deleteEntry(index)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
