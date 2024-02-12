import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from React Router
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalendarAlt, faPlus, faList, faImages, faTasks } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entryTitle, setEntryTitle] = useState('');
  const [entryText, setEntryText] = useState('');
  const [image, setImage] = useState('');

  const addEntry = () => {
    const newEntry = {
      date: currentDate.toLocaleDateString(),
      title: entryTitle,
      text: entryText,
      image: image,
    };

    setDiaryEntries([...diaryEntries, newEntry]);
    setEntryTitle('');
    setEntryText('');
    setImage('');
  };

  return (
    <div className="App">
      <header>
        <h1>My Web Diary</h1>
        <nav>
          <Link to ="/login-page">
            <FontAwesomeIcon icon={faPlus} />Login Page
          </Link>
          <Link to="/create-account">
          <FontAwesomeIcon icon={faPlus} /> Create Account
          </Link>
          <FontAwesomeIcon icon={faCalendarAlt} /> Diary
          <FontAwesomeIcon icon={faList} /> Planner
          <FontAwesomeIcon icon={faTasks} /> Lists
        </nav>
      </header>

      <section className="main-section">
        <div className="quick-entry-form">
          <h2>{currentDate.toDateString()}</h2>
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
