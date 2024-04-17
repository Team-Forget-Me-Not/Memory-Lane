import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, deleteDoc, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalendarAlt, faImages, faHouse, faUser, faList, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Calendar from './Calendar'; // Import Calendar component
import EmojiPicker from './EmojiPicker'; // Import EmojiPicker component

import './App.css'; // Import CSS file for styling

// Initialize Firestore and Authentication
const firestore = getFirestore();
const auth = getAuth();

// Main component
const App = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [entryTitle, setEntryTitle] = useState(""); // State for entry title
  const [entryText, setEntryText] = useState(""); // State for entry text
  const [image, setImage] = useState(""); // State for image URL
  const [imagePreview, setImagePreview] = useState(""); // State for image preview URL
  const [musicVideoTitle, setMusicVideoTitle] = useState(""); // State for music/video title
  const [musicVideoLink, setMusicVideoLink] = useState(""); // State for music/video link
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State to indicate loading state
  const [entries, setEntries] = useState([]); // State to hold diary entries
  const [editEntryId, setEditEntryId] = useState(null); // State for editing an entry
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date

  const videoRef = useRef(null); // Reference for video iframe
  const history = useHistory(); // History hook for navigation

  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker visibility
  const [selectedEmoji, setSelectedEmoji] = useState(""); // State for selected emoji

  useEffect(() => {
    // Check if there's an image stored in local storage
    const storedImage = localStorage.getItem('image');
    if (storedImage) {
      setImagePreview(storedImage);
    }

    // Effect hook to handle user authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, set user state and fetch entry details
        setUser(user);
        fetchEntryDetails(user.uid);
      } else {
        // If user is not authenticated, reset user state and entry details
        setUser(null);
        setEntryTitle("");
        setEntryText("");
        setImage("");
        setImagePreview("");
        setMusicVideoTitle("");
        setMusicVideoLink("");
        setEntries([]); // Reset entries when user is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup function
  }, []); // Run this effect only once after component mounts

  useEffect(() => {
    // Fetch entry details when selected date or user changes
    fetchEntryDetails(user?.uid); // Fetch entries only if user is authenticated
  }, [selectedDate, user]); // Run this effect when selectedDate or user changes

  const fetchEntryDetails = async (userId) => {
    // Function to fetch diary entries from Firestore
    try {
      setLoading(true);
      if (userId) {
        // Fetch entries from Firestore for the selected user
        const entriesRef = collection(firestore, `diary_entries/${userId}/entries`);
        const querySnapshot = await getDocs(entriesRef);
        const userEntries = [];
        querySnapshot.forEach((doc) => {
          const entryData = doc.data();
          const entryDate = entryData.timestamp.toDate();
          // Filter entries based on the selected date
          if (entryDate.toDateString() === selectedDate.toDateString()) {
            userEntries.push({ id: doc.id, ...entryData, timestamp: entryDate });
          }
        });
        setEntries(userEntries);
      }
    } catch (error) {
      setError("Error fetching entry details. Please try again later.");
      console.error("Error fetching entry details: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url) => {
    // Function to extract YouTube video ID from URL
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  };

  // Event handlers for form inputs
  const handleEntryTitleChange = (event) => {
    setEntryTitle(event.target.value);
  };

  const handleEntryTextChange = (event) => {
    setEntryText(event.target.value);
  };

  const handleImageChange = (event) => {
    // Handle image selection and preview
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setImage(imageUrl);
      setImagePreview(imageUrl);
      // Store image data as Base64 string in local storage
      localStorage.setItem('image', imageUrl);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleMusicVideoTitleChange = (event) => {
    setMusicVideoTitle(event.target.value);
  };

  const handleMusicVideoLinkChange = (event) => {
    setMusicVideoLink(event.target.value);
  };

  const handleSaveEntry = async () => {
    // Function to save or update a diary entry
    try {
      if (!user) {
        setError("User not authenticated. Please log in.");
        return;
      }

      setLoading(true);

      const entryData = {
        title: entryTitle,
        text: entryText,
        image: image,
        musicVideoTitle,
        musicVideoLink,
        timestamp: serverTimestamp()
      };

      if (editEntryId) {
        const entryRef = doc(collection(firestore, `diary_entries/${user.uid}/entries`), editEntryId);
        await setDoc(entryRef, entryData, { merge: true });
        console.log("Entry details updated successfully!");
      } else {
        const userEntriesRef = collection(firestore, `diary_entries/${user.uid}/entries`);
        await addDoc(userEntriesRef, entryData);
        console.log("New entry added successfully!");
      }

      fetchEntryDetails(user.uid);
    } catch (error) {
      setError("Error saving entry details. Please try again later.");
      console.error("Error in saving entry details: ", error);
    } finally {
      setLoading(false);
      setEditEntryId(null);
    }
  };

  const handleEditEntry = (entryId) => {
    // Function to handle editing an entry
    const entryToEdit = entries.find(entry => entry.id === entryId);
    setEditEntryId(entryId);
    setEntryTitle(entryToEdit.title);
    setEntryText(entryToEdit.text);
    setImage(entryToEdit.image);
    setImagePreview(entryToEdit.image);
    setMusicVideoTitle(entryToEdit.musicVideoTitle);
    setMusicVideoLink(entryToEdit.musicVideoLink);
  };

  const handleDeleteEntry = async (entryId) => {
    // Function to handle deleting an entry
    try {
      if (!user) {
        setError("User not authenticated. Please log in.");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
      if (!confirmDelete) {
        return;
      }

      setLoading(true);

      const entryRef = doc(collection(firestore, `diary_entries/${user.uid}/entries`), entryId);
      await deleteDoc(entryRef);

      console.log("Entry deleted successfully!");
      fetchEntryDetails(user.uid);
    } catch (error) {
      setError("Error deleting entry. Please try again later.");
      console.error("Error deleting entry: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    // Function to handle emoji selection
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false); // Hide the emoji picker after selection
    setEntryText(entryText + emoji); // Append selected emoji to entry text
  };

  const handleDateClick = (date) => {
    // Function to handle date click in the calendar
    setSelectedDate(date);
    // Reset entry fields
    setEntryTitle("");
    setEntryText("");
    setImage("");
    setImagePreview("");
    setMusicVideoTitle("");
    setMusicVideoLink("");
    // Clear entries array
    setEntries([]);
  };

  if (!user) {
    // If user is not authenticated, display login message
    return <div>Please log in to access this page</div>;
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
        {/* Quick entry form section */}
        <div className="quick-entry-form">
          <h2>{selectedDate.toDateString()}</h2> {/* Display selected date */}
          <Calendar currentDate={selectedDate} onDateClick={handleDateClick} /> {/* Calendar component */}
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
          {/* Form inputs */}
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
          {/* Button to toggle emoji picker */}
          <button onClick={() => setShowEmojiPicker(prevState => !prevState)}>Add Emoji</button>
          {/* Emoji picker */}
          {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
          {/* Button to upload image */}
          <button className="upload-button" onClick={() => document.getElementById('image-upload').click()}>
            <FontAwesomeIcon icon={faImages} /> Choose File
          </button>
          {/* Hidden input for image upload */}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {/* Image preview */}
          <div className="image-preview">
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '25%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />}
          </div>
          {/* Music/Video inputs */}
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
          {/* Save and cancel buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={handleSaveEntry} className="save-button" style={{ fontSize: '1.2em', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faSave} /> Save Entry
            </button>
            <button onClick={() => {
              setEditEntryId(null);
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
                {/* Display entry details */}
                <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{new Date(entry.timestamp).toLocaleDateString()}</h3>
                <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{entry.title}</h2>
                <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>{entry.text}</p>
                {entry.image && <img src={entry.image} alt="Entry" style={{ maxWidth: '100%', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />}
                {entry.musicVideoLink && (
                  <iframe
                    title="Music/Video Player"
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(entry.musicVideoLink)}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
                {/* Entry actions */}
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
