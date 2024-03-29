import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './Profile.css';

// Initialize Firebase storage and Firestore
const firebaseStorage = getStorage();
const firestore = getFirestore();

const Profile = () => {
  // State variables for profile details
  const [username, setUsername] = useState("Monika Asano");
  const [location, setLocation] = useState("Earth");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [relationshipStatus, setRelationshipStatus] = useState(""); // State for relationship status
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // State for background color
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [changesSaved, setChangesSaved] = useState(false); // State to track changes saved

  const history = useHistory();

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
  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
    // Set background color of the body directly
    document.body.style.backgroundColor = event.target.value;
  };

  // Function to handle saving changes
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      // Upload profile picture if selected
      let imageURL = profilePic ? await uploadProfilePicture(profilePic) : null;
      // Update profile details in Firestore
      const profileData = {
        username,
        location,
        bio,
        relationshipStatus,
        imageURL,
        backgroundColor // Include background color in profile data
      };
      await setDoc(doc(firestore, 'profiles', 'user_id'), profileData);
      // Log updated profile details
      console.log("Profile updated successfully!", profileData);
      // Set changes saved state
      setChangesSaved(true);
      setTimeout(() => {
        setChangesSaved(false);
      }, 3000); // Reset changes saved state after 3 seconds
    } catch (error) {
      // Handle error during profile update
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
            <input type="color" id="background-color" value={backgroundColor} onChange={handleBackgroundColorChange} />
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
