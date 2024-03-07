// Import necessary dependencies and components
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalendarAlt, faPlus, faList, faImages, faTasks, faMusic, faMobileButton, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
import Calendar from './Calendar';
import Planner from './Planner'; // Import Planner component

// Define the main App component
const App = () => {
  // State variables for managing diary entries and form inputs
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entryTitle, setEntryTitle] = useState('');
  const [entryText, setEntryText] = useState('');
  const [image, setImage] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);

  // Reference for the video element
  const videoRef = useRef(null);

  // State variables for managing edit mode and edited entry index
  const [editMode, setEditMode] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);

  // Function to extract YouTube video ID from a video link
  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  // Function to toggle full screen for the video player
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

  // Function to add or update diary entries based on edit mode
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
      // Update existing entry if in edit mode
      const updatedEntries = [...diaryEntries];
      updatedEntries[editedIndex] = newEntry;
      setDiaryEntries(updatedEntries);
      setEditMode(false);
      setEditedIndex(null);
    } else {
      // Add a new entry if not in edit mode
      setDiaryEntries([...diaryEntries, newEntry]);
    }

    // Reset form inputs and textarea height
    setEntryTitle('');
    setEntryText('');
    setImage('');
    setMusicTitle('');
    setMusicLink('');
    setIsTextareaExpanded(false);
  };

  // Function to populate form inputs for editing an existing entry
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

  // Function to delete an entry
  const deleteEntry = (index) => {
    const updatedEntries = [...diaryEntries];
    updatedEntries.splice(index, 1);
    setDiaryEntries(updatedEntries);
  };

  // Function to handle day click in the calendar
  const handleDayClick = (year, month, day) => {
    setCurrentDate(new Date(year, month, day));
  };

  // Function to expand the textarea height
  const expandTextarea = () => {
    setIsTextareaExpanded(true);
  };

  // Function to collapse the textarea height
  const collapseTextarea = () => {
    setIsTextareaExpanded(false);
  };

  // JSX rendering of the main App component
  return (
    <div className="App">
      {/* Header section with navigation links */}
      <header>
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

      {/* Main section containing quick entry form and diary entries */}
      <section className="main-section">
        {/* Quick entry form */}
        <div className="quick-entry-form">
          <h2>{currentDate.toDateString()}</h2>
          <Calendar currentDate={currentDate} onDayClick={handleDayClick} />
          {/* Form inputs for entry details */}
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
          <label htmlFor="image-upload" className="image-upload-label">
            <FontAwesomeIcon icon={faImages} /> Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          />
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
          {/* Button to save or update entry */}
          <button onClick={addEntry}>
            <FontAwesomeIcon icon={faSave} /> {editMode ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>

        {/* Display of existing diary entries */}
        <div className="diary-entries">
          {diaryEntries.map((entry, index) => (
            <div key={index} className="entry-card">
              <h3>{entry.date}</h3>
              <h4>{entry.title}</h4>
              <p>{entry.text}</p>
              {/* Display uploaded image if available */}
              {entry.image && <img src={entry.image} alt="Entry" />}
              {/* Display music/video section if available */}
              {entry.musicTitle && entry.musicLink && (
                <div className="music-section">
                  <h4>{entry.musicTitle}</h4>
                  {/* Embed YouTube video player with full-screen option */}
                  <iframe
                    ref={videoRef}
                    title="music-player"
                    width="100%"
                    height="166"
                    frameBorder="no"year
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(entry.musicLink)}`}
                    onClick={toggleFullScreen}
                  ></iframe>
                </div>
              )}
              {/* Buttons to edit or delete the entry */}
              <div>
                <button onClick={() => editEntry(index)}>Edit</button>
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Export the App component as the default export
export default App;
