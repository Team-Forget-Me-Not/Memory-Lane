import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalendarAlt, faPlus, faList, faImages, faTasks, faMusic } from '@fortawesome/free-solid-svg-icons';
import Calendar from './Calendar';




const App = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entryTitle, setEntryTitle] = useState('');
  const [entryText, setEntryText] = useState('');
  const [image, setImage] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);

  const videoRef = useRef(null);

  const getYouTubeVideoId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

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

  const addEntry = () => {
    const newEntry = {
      date: currentDate.toLocaleDateString(),
      title: entryTitle,
      text: entryText,
      image: image,
      musicTitle: musicTitle,
      musicLink: musicLink,
    };

    setDiaryEntries([...diaryEntries, newEntry]);
    setEntryTitle('');
    setEntryText('');
    setImage('');
    setMusicTitle('');
    setMusicLink('');
    setIsTextareaExpanded(false);
  };

  const handleDayClick = (year, month, day) => {
    setCurrentDate(new Date(year, month, day));
  };

  const expandTextarea = () => {
    setIsTextareaExpanded(true);
  };

  const collapseTextarea = () => {
    setIsTextareaExpanded(false);
  };

  return (
    <div className="App">
      <header>
        <Link to="/Front-page">
          <h1>Memory Lane</h1>
        </Link>
        <nav>
          {/* Removed or commented out login and create account button links */}
          {/*<Link to="/login-page">
            <FontAwesomeIcon icon={faPlus} /> Login Page
          </Link>
          <Link to="/create-account">
            <FontAwesomeIcon icon={faPlus} /> Create Account
          </Link>*/}
          <Link to="/calendar">
            <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
          </Link>
          <FontAwesomeIcon icon={faList} /> Planner
          <FontAwesomeIcon icon={faTasks} /> Lists
        </nav>
      </header>

      <section className="main-section">
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
            placeholder="Music Title"
            value={musicTitle}
            onChange={(e) => setMusicTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Music Link"
            value={musicLink}
            onChange={(e) => setMusicLink(e.target.value)}
          />
          <button onClick={addEntry}>
            <FontAwesomeIcon icon={faSave} /> Save Entry
          </button>
        </div>

        <div className="diary-entries">
          {diaryEntries.map((entry, index) => (
            <div key={index} className="entry-card">
              <h3>{entry.date}</h3>
              <h4>{entry.title}</h4>
              <p>{entry.text}</p>
              {entry.image && <img src={entry.image} alt="Entry" />}
              {entry.musicTitle && entry.musicLink && (
                <div className="music-section">
                  <h4>{entry.musicTitle}</h4>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
