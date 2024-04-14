import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, deleteDoc, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const [imagePreview, setImagePreview] = useState(""); // State for image preview URL
  const [musicVideoTitle, setMusicVideoTitle] = useState(""); // State for music/video title
  const [musicVideoLink, setMusicVideoLink] = useState(""); // State for music/video link
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading status
  const [entries, setEntries] = useState([]); // State for diary entries
  const [editEntryId, setEditEntryId] = useState(null); // State to track the ID of the entry being edited

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
        setImagePreview(""); // Reset image preview URL
        setMusicVideoTitle(""); // Reset music/video title
        setMusicVideoLink(""); // Reset music/video link
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  const fetchEntryDetails = async (userId) => {
    try {
      setLoading(true); // Set loading status
      const entriesRef = collection(firestore, `diary_entries/${userId}/entries`); // Reference to entries subcollection for the current user
      const querySnapshot = await getDocs(entriesRef); // Get all documents from the entries subcollection
      const userEntries = []; // Array to store user's entries
      querySnapshot.forEach((doc) => {
        const entryData = doc.data();
        userEntries.push({ id: doc.id, ...entryData, timestamp: entryData.timestamp.toDate() }); // Parse timestamp to Date object
      });
      setEntries(userEntries); // Set diary entries state
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
    const imageUrl = URL.createObjectURL(selectedFile);
    setImage(imageUrl); // Set image URL
    setImagePreview(imageUrl); // Set image preview URL
  };

  const handleMusicVideoTitleChange = (event) => {
    setMusicVideoTitle(event.target.value);
  };

  const handleMusicVideoLinkChange = (event) => {
    setMusicVideoLink(event.target.value);
  };

  // Function to handle both adding and updating entries
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
        image: image, // Save image URL
        musicVideoTitle,
        musicVideoLink,
        timestamp: serverTimestamp() // Use serverTimestamp() to generate server-side timestamp
      };

      if (editEntryId) {
        // If editEntryId exists, update the existing entry
        const entryRef = doc(collection(firestore, `diary_entries/${user.uid}/entries`), editEntryId);
        await setDoc(entryRef, entryData, { merge: true }); // Merge with existing data
        console.log("Entry details updated successfully!");
      } else {
        // If editEntryId does not exist, add a new entry
        const userEntriesRef = collection(firestore, `diary_entries/${user.uid}/entries`); // Reference to entries subcollection for the current user
        await addDoc(userEntriesRef, entryData); // Add new entry document
        console.log("New entry added successfully!");
      }

      fetchEntryDetails(user.uid); // Fetch updated diary entries
    } catch (error) {
      setError("Error saving entry details. Please try again later."); // Set error message
      console.error("Error in saving entry details: ", error); // Log error
    } finally {
      setLoading(false); // Reset loading status
      setEditEntryId(null); // Reset editEntryId state
    }
  };

  // Function to set state for editing an entry
  const handleEditEntry = (entryId) => {
    const entryToEdit = entries.find(entry => entry.id === entryId);
    setEditEntryId(entryId); // Set the ID of the entry being edited
    setEntryTitle(entryToEdit.title);
    setEntryText(entryToEdit.text);
    setImage(entryToEdit.image);
    setImagePreview(entryToEdit.image); // Set image preview
    setMusicVideoTitle(entryToEdit.musicVideoTitle);
    setMusicVideoLink(entryToEdit.musicVideoLink);
  };

  // Function to delete an entry
  const handleDeleteEntry = async (entryId) => {
    try {
      if (!user) {
        setError("User not authenticated. Please log in."); // Set error message if user not authenticated
        return;
      }

      // Ask for confirmation before deleting the entry
      const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
      if (!confirmDelete) {
        return; // If user cancels, do nothing
      }

      setLoading(true); // Set loading status

      const entryRef = doc(collection(firestore, `diary_entries/${user.uid}/entries`), entryId); // Reference to entry document
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
        {/* Header with navigation links */}
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
          <button className="upload-button" onClick={() => document.getElementById('image-upload').click()}>
            <FontAwesomeIcon icon={faImages} /> Choose File
          </button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <div className="image-preview">
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '25%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />}
          </div>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handleSaveEntry} className="save-button" style={{ fontSize: '1.2em', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faSave} /> Save Entry
            </button>
            <button onClick={() => { // Function to clear input fields
              setEditEntryId(null); // Reset editEntryId state
              setEntryTitle("");
              setEntryText("");
              setImage("");
              setImagePreview("");
              setMusicVideoTitle("");
              setMusicVideoLink("");
            }} className="cancel-button" style={{ fontSize: '1.2em', padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Cancel
            </button>
          </div>
        </div>

        {/* Display diary entries */}
        <div className="diary-entries" style={{ marginTop: '30px' }}>
          {entries.length === 0 ? (
            <p style={{ fontSize: '1.2em', color: '#777' }}>No entries for this date.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                {/* Rest of the entry card */}
                <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{new Date(entry.timestamp).toLocaleDateString()}</h3>
                <h4 style={{ fontSize: '1.3em', marginBottom: '10px' }}>{entry.title}</h4>
                <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{entry.text}</p>
                {entry.image && (
                  <img
                    src={entry.image}
                    alt="Entry"
                    style={{
                      maxWidth: '100%',
                      marginBottom: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ccc', // Add border for better visibility
                    }}
                    onError={(e) => console.error('Error loading image:', e)} // Add error handling
                  />
                )}
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
                {/* Edit and delete buttons */}
                <div className="entry-actions">
                  <button onClick={() => handleEditEntry(entry.id)} className="edit-button">
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button onClick={() => handleDeleteEntry(entry.id)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
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
