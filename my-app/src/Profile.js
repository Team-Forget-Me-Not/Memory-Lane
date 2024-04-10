import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { SketchPicker } from 'react-color';
import './Profile.css';

// Initialize Firebase storage and Firestore
const firebaseStorage = getStorage();
const firestore = getFirestore();



const Profile = () => {
  // State variables for profile details
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [relationshipStatus, setRelationshipStatus] = useState(""); // State for relationship status
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // State for background color
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [changesSaved, setChangesSaved] = useState(false); // State to track changes saved

  const history = useHistory();

  // Function to fetch profile data from Firestore and store it in localStorage
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const docRef = doc(collection(firestore, 'profiles'));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsername(data.username);
        setLocation(data.location);
        setBio(data.bio);
        setRelationshipStatus(data.relationshipStatus);
        setBackgroundColor(data.backgroundColor);
        // You can also set the profile picture here if needed

        // Store profile data in localStorage
        localStorage.setItem('profileData', JSON.stringify(data));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      setError("Error fetching profile data. Please try again later.");
      console.error("Error fetching profile data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if profile data exists in localStorage
    const storedProfileData = localStorage.getItem('profileData');
    if (storedProfileData) {
      const data = JSON.parse(storedProfileData);
      setUsername(data.username);
      setLocation(data.location);
      setBio(data.bio);
      setRelationshipStatus(data.relationshipStatus);
      setBackgroundColor(data.backgroundColor);
      // You can also set the profile picture here if needed
    } else {
      // Fetch profile data from Firestore
      fetchProfileData();
    }
  }, []); // Fetch profile data when the component mounts

  // Function to handle profile picture change
  const handleProfilePicChange = (event) => {
    const selectedFile = event.target.files[0];
    setProfilePic(selectedFile);
  };

  // Function to handle username change
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Function to handle location change
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  // Function to handle bio change
  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  // Function to handle relationship status change
  const handleRelationshipStatusChange = (event) => {
    setRelationshipStatus(event.target.value);
  };

  // Function to handle background color change
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
    // Set background color of the body directly
    document.body.style.backgroundColor = color.hex;
  };

  // Function to handle saving changes
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      let imageURL = null;

      // Upload profile picture if selected
      if (profilePic) {
        imageURL = await uploadProfilePicture(profilePic);
      }

      // Profile data to save
      const profileData = {
        username,
        location,
        bio,
        relationshipStatus,
        imageURL, // Include download URL of profile picture
        backgroundColor
      };

      // Add a new document with a generated id in 'profiles' collection
      const docRef = doc(collection(firestore, 'profiles'));
      await setDoc(docRef, profileData);

      console.log("Profile created with ID: ", docRef.id);
      console.log("Profile updated successfully!", profileData);

      setChangesSaved(true);
      setTimeout(() => {
        setChangesSaved(false);
      }, 3000);

      // Update stored profile data in localStorage
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } catch (error) {
      setError("Error updating profile. Please try again later.");
      console.error("Error in updating profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to upload profile picture to Firebase storage
  const uploadProfilePicture = async (file) => {
    const storageRef = ref(firebaseStorage, `profile_pictures/${file.name}`);
    await uploadBytes(storageRef, file);
    return `https://storage.googleapis.com/${firebaseStorage.app.options.storageBucket}/profile_pictures/${file.name}`;
  };

  return (
    <div className="profile-container">
      {/* Profile header section */}
      <div className="profile-header">
        {/* Profile picture */}
        <div className="profile-picture-container">
          <label htmlFor="profile-pic" className="profile-picture-label">
            <img src={profilePic ? URL.createObjectURL(profilePic) : "https://via.placeholder.com/150"} alt="Profile" className="profile-picture" />
            <input type="file" id="profile-pic" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} />
          </label>
        </div>
        {/* Profile details form */}
        <div className="profile-details">
          <h2>Edit Profile</h2>
          {/* Username input field */}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          {/* Location input field */}
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" value={location} onChange={handleLocationChange} />
          </div>
          {/* Bio input field */}
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" value={bio} onChange={handleBioChange}></textarea>
          </div>
          {/* Relationship status input field */}
          <div className="form-group">
            <label htmlFor="relationship">Relationship Status:</label>
            <select id="relationship" value={relationshipStatus} onChange={handleRelationshipStatusChange}>
              <option value="">Select</option>
              <option value="Single">Single - 🔓</option>
              <option value="In a relationship">In a relationship - ❤️</option>
              <option value="Engaged">Engaged - 💍</option>
              <option value="Married">Married - 👰‍♂️</option>
              <option value="Divorced">Divorced - 💔</option>
              <option value="Widowed">Widowed - ⚰️</option>
            </select>
          </div>
          {/* Background color picker */}
          <div className="form-group">
            <label htmlFor="background-color">Background Color:</label>
            <SketchPicker color={backgroundColor} onChange={handleBackgroundColorChange} />
          </div>
          {/* Error message */}
          {error && <div className="error">{error}</div>}
          {/* Button to save changes */}
          <button className="update-button" onClick={handleSaveChanges} disabled={loading || changesSaved}>
            {loading ? 'Saving...' : (changesSaved ? 'Changes Saved' : 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
