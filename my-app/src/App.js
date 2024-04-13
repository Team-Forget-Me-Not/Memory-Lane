import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, deleteDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalendarAlt, faImages, faHouse, faUser, faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Calendar from './Calendar';
import './App.css';

// Initialize Firebase authentication and Firestore
const firestore = getFirestore();
const auth = getAuth();

const App = () => {
  const [user, setUser] = useState(null); // State for user authentication
  const [entryTitle, setEntryTitle] = useState(""); // State for entry title
  const [entryText, setEntryText] = useState(""); // State for entry text
  const [image, setImage] = useState(""); // State for image URL
  const [musicVideoTitle, setMusicVideoTitle] = useState(""); // State for music/video title
  const [musicVideoLink, setMusicVideoLink] = useState(""); // State for music/video link
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading status
  const [entries, setEntries] = useState([]); // State for diary entries

  const videoRef = useRef(null); // Reference to the video player

  const history = useHistory(); // History hook for navigation

  const currentDate = new Date(); // Current date

  useEffect(() => {
    // Effect to listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set authenticated user
        fetchEntryDetails(user.uid); // Fetch diary entries for the user
      } else {
        setUser(null); // Set user to null if not authenticated
        setEntryTitle(""); // Reset entry title
        setEntryText(""); // Reset entry text
        setImage(""); // Reset image URL
        setMusicVideoTitle(""); // Reset music/video title
        setMusicVideoLink(""); // Reset music/video link
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  const fetchEntryDetails = async (userId) => {
    try {
      setLoading(true); // Set loading status
      const entryRef = doc(collection(firestore, 'entries'), userId); // Reference to user's diary entry
      const entrySnap = await getDoc(entryRef); // Get diary entry document
      if (entrySnap.exists()) {
        const data = entrySnap.data(); // Extract data from diary entry
        setEntries([data]); // Set diary entries state
      } else {
        console.log("No entry details found for this user!"); // Log if no entry found
        setEntries([]); // Set empty diary entries state
      }
    } catch (error) {
      setError("Error fetching entry details. Please try again later."); // Set error message
      console.error("Error fetching entry details: ", error); // Log error
    } finally {
      setLoading(false); // Reset loading status
    }
  };

  const getYouTubeVideoId = (url) => {
    // Function to extract YouTube video ID from URL
    const match = url.match(/[?&]v=([^&]+)/); // Match video ID pattern in URL
    return match ? match[1] : null; // Return video ID if found, otherwise null
  };

  // Event handlers for input changes
  const handleEntryTitleChange = (event) => {
    setEntryTitle(event.target.value);
  };

  const handleEntryTextChange = (event) => {
    setEntryText(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(URL.createObjectURL(selectedFile));
  };

  const handleMusicVideoTitleChange = (event) => {
    setMusicVideoTitle(event.target.value);
  };

  const handleMusicVideoLinkChange = (event) => {
    setMusicVideoLink(event.target.value);
  };

  const handleSaveEntry = async () => {
    try {
      if (!user) {
        setError("User not authenticated. Please log in."); // Set error message if user not authenticated
        return;
      }

      setLoading(true); // Set loading status

      const entryData = {
        title: entryTitle,
        text: entryText,
        image,
        musicVideoTitle,
        musicVideoLink
      };

      const entryRef = doc(collection(firestore, 'entries'), user.uid); // Reference to user's diary entry
      await setDoc(entryRef, entryData); // Save diary entry data

      console.log("Entry details saved successfully!"); // Log success message
      fetchEntryDetails(user.uid); // Fetch updated diary entries
    } catch (error) {
      setError("Error saving entry details. Please try again later."); // Set error message
      console.error("Error in saving entry details: ", error); // Log error
    } finally {
      setLoading(false); // Reset loading status
    }
  };

  const handleEditEntry = (index) => {
    const entryToEdit = entries[index];
    setEntryTitle(entryToEdit.title);
    setEntryText(entryToEdit.text);
    setImage(entryToEdit.image);
    setMusicVideoTitle(entryToEdit.musicVideoTitle);
    setMusicVideoLink(entryToEdit.musicVideoLink);
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      if (!user) {
        setError("User not authenticated. Please log in."); // Set error message if user not authenticated
        return;
      }

      setLoading(true); // Set loading status

      const entryRef = doc(collection(firestore, 'entries'), user.uid); // Reference to user's diary entry
      await deleteDoc(entryRef); // Delete diary entry

      console.log("Entry deleted successfully!"); // Log success message
      fetchEntryDetails(user.uid); // Fetch updated diary entries
    } catch (error) {
      setError("Error deleting entry. Please try again later."); // Set error message
      console.error("Error deleting entry: ", error); // Log error
    } finally {
      setLoading(false); // Reset loading status
    }
  };

  if (!user) {
    return <div>Please log in to access this page</div>; // Render login message if user not authenticated
  }

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
          <Link to="/Calendar" style={{ textDecoration: 'none' }}>
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
          <Calendar currentDate={currentDate} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            placeholder="Entry Title"
            value={entryTitle}
            onChange={handleEntryTitleChange}
            style={{ fontSize: '1.5em', marginBottom: '10px', padding: '5px' }}
          />
          <textarea
            placeholder="Write your entry here..."
            value={entryText}
            onChange={handleEntryTextChange}
            style={{ fontSize: '1.2em', minHeight: '100px', padding: '5px', marginBottom: '10px' }}
          />
          <label htmlFor="image-upload" className="image-upload-label" style={{ marginBottom: '10px', display: 'block', fontSize: '1.2em', color: '#333' }}>
            <FontAwesomeIcon icon={faImages} /> Upload Image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            placeholder="Music/Video Title"
            value={musicVideoTitle}
            onChange={handleMusicVideoTitleChange}
            style={{ fontSize: '1.2em', marginBottom: '10px', padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Music/Video Link"
            value={musicVideoLink}
            onChange={handleMusicVideoLinkChange}
            style={{ fontSize: '1.2em', marginBottom: '10px', padding: '5px' }}
          />
          <button onClick={handleSaveEntry} style={{ fontSize: '1.2em', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faSave} /> Save Entry
          </button>
        </div>

        {/* Display diary entries */}
        <div className="diary-entries" style={{ marginTop: '30px' }}>
          {entries.length === 0 ? (
            <p style={{ fontSize: '1.2em', color: '#777' }}>No entries for this date.</p>
          ) : (
            entries.map((entry, index) => (
              <div key={index} className="entry-card" style={{ border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px', padding: '15px' }}>
                {/* Edit and delete buttons */}
                <div style={{ marginBottom: '10px' }}>
                  <button onClick={() => handleEditEntry(index)} style={{ marginRight: '10px' }}><FontAwesomeIcon icon={faEdit} /> Edit</button>
                  <button onClick={() => handleDeleteEntry(entry.id)} style={{ color: 'red' }}><FontAwesomeIcon icon={faTrash} /> Delete</button>
                </div>
                {/* Rest of the entry card */}
                <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{entry.date}</h3>
                <h4 style={{ fontSize: '1.3em', marginBottom: '10px' }}>{entry.title}</h4>
                <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{entry.text}</p>
                {entry.image && <img src={entry.image} alt="Entry" style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px' }} />}
                {entry.musicVideoTitle && entry.musicVideoLink && (
                  <div className="music-section">
                    <h4 style={{ fontSize: '1.3em', marginBottom: '10px' }}>{entry.musicVideoTitle}</h4>
                    <iframe
                      ref={videoRef}
                      title="music-player"
                      width="100%"
                      height="166"
                      frameBorder="no"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(entry.musicVideoLink)}`}
                      style={{ borderRadius: '5px' }}
                      onError={(e) => console.error('Error loading YouTube video:', e)}
                    ></iframe>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
