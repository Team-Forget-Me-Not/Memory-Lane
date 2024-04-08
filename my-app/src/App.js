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
  const [error, setError] = useState(null);

  // Save diary entries to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    } catch (error) {
      console.error('Error saving diary entries to localStorage:', error);
      setError('Error saving diary entries. Please try again later.');
    }
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
    try {
      // Validate inputs
      if (!validateInputs()) {
        throw new Error('Invalid input data');
      }

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
      resetInputs();
    } catch (error) {
      console.error('Error adding/updating entry:', error);
      setError('Error adding/updating entry. Please try again.');
    }
  };

  // Function to validate user inputs
  const validateInputs = () => {
    // Perform validation checks here
    // Return true if inputs are valid, false otherwise
    return true;
  };

  // Function to reset input fields and state
  const resetInputs = () => {
    setEntryTitle('');
    setEntryText('');
    setImage('');
    setMusicTitle('');
    setMusicLink('');
    setIsTextareaExpanded(false);
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
    try {
      const filteredIndex = diaryEntries.findIndex(entry => entry.date === currentDate.toLocaleDateString());
      if (filteredIndex !== -1) {
        const updatedEntries = [...diaryEntries];
        updatedEntries.splice(filteredIndex, 1);
        setDiaryEntries(updatedEntries);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Error deleting entry. Please try again.');
    }
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            placeholder="Entry Title"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            style={{ fontSize: '1.5em', marginBottom: '10px', padding: '5px' }}
          />
          <textarea
            placeholder="Write your entry here..."
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            onFocus={expandTextarea}
            onBlur={collapseTextarea}
            style={{ fontSize: '1.2em', minHeight: '100px', padding: '5px', marginBottom: '10px' }}
          />
          {/* Image upload input */}
          <label htmlFor="image-upload" className="image-upload-label" style={{ marginBottom: '10px', display: 'block', fontSize: '1.2em', color: '#333' }}>
            <FontAwesomeIcon icon={faImages} /> Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
            style={{ display: 'none' }}
          />
          {/* Music/Video inputs */}
          <input
            type="text"
            placeholder="Music/Video Title"
            value={musicTitle}
            onChange={(e) => setMusicTitle(e.target.value)}
            style={{ fontSize: '1.2em', marginBottom: '10px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Music/Video Link"
            value={musicLink}
            onChange={(e) => setMusicLink(e.target.value)}
            style={{ fontSize: '1.2em', marginBottom: '10px', padding: '5px' }}
          />
          {/* Button to add or update entry */}
          <button onClick={addEntry} style={{ fontSize: '1.2em', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faSave} /> {editMode ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>

        {/* Display diary entries */}
        <div className="diary-entries" style={{ marginTop: '30px' }}>
          {filteredEntries.length === 0 ? (
            <p style={{ fontSize: '1.2em', color: '#777' }}>No entries for this date.</p>
          ) : (
            filteredEntries.map((entry, index) => (
              <div key={index} className="entry-card" style={{ border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', padding: '15px' }}>
                <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{entry.date}</h3>
                <h4 style={{ fontSize: '1.3em', marginBottom: '10px' }}>{entry.title}</h4>
                <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{entry.text}</p>
                {entry.image && <img src={entry.image} alt="Entry" style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />}
                {entry.musicTitle && entry.musicLink && (
                  <div className="music-section">
                    <h4 style={{ fontSize: '1.3em', marginBottom: '10px' }}>{entry.musicTitle}</h4>
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
                      style={{ borderRadius: '5px' }}
                    ></iframe>
                  </div>
                )}
                {/* Edit and delete buttons */}
                <div>
                  <button onClick={() => editEntry(index)} style={{ fontSize: '1em', padding: '5px 10px', marginRight: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => deleteEntry(index)} style={{ fontSize: '1em', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
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
