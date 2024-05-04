import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { SketchPicker } from 'react-color';
import './Profile.css';

const firestore = getFirestore();
const auth = getAuth();

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(""); // State to hold profile picture data as Base64 encoded string
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchProfileData(user.uid);
      } else {
        setUser(null);
      }
    });

    const storedColor = localStorage.getItem('backgroundColor');
    const storedProfilePic = localStorage.getItem('profilePic'); // Retrieve profile picture data from local storage
    if (storedColor) {
      setBackgroundColor(storedColor);
      document.body.style.backgroundColor = storedColor;
    }
    if (storedProfilePic) {
      setProfilePic(storedProfilePic); // Set profile picture data from local storage
    }

    return () => unsubscribe();
  }, []);

  const fetchProfileData = async (userId) => {
    try {
      setLoading(true);
      const profileRef = doc(collection(firestore, 'profiles'), userId);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setUsername(data.username);
        setLocation(data.location);
        setBio(data.bio);
        setRelationshipStatus(data.relationshipStatus);
        setProfilePic(data.imageURL);
        setBackgroundColor(data.backgroundColor);
        localStorage.setItem('profilePic', data.imageURL); // Store profile picture data in local storage
      } else {
        console.log("No profile data found for this user!");
      }
    } catch (error) {
      setError("Error fetching profile data. Please try again later.");
      console.error("Error fetching profile data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleRelationshipStatusChange = (event) => {
    setRelationshipStatus(event.target.value);
  };

  const handleBackgroundColorChange = (color) => {
    const colorValue = color.hex;
    setBackgroundColor(colorValue);
    document.body.style.backgroundColor = colorValue;
    localStorage.setItem('backgroundColor', colorValue);
  };

  const handleProfilePicChange = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      setProfilePic(event.target.result); // Set profile picture data as Base64 encoded string
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSaveChanges = async () => {
    try {
      if (!user) {
        setError("User not authenticated. Please log in.");
        return;
      }

      setLoading(true);

      const profileData = {
        username,
        location,
        bio,
        relationshipStatus,
        imageURL: profilePic,
        backgroundColor
      };

      const profileRef = doc(collection(firestore, 'profiles'), user.uid);
      await setDoc(profileRef, profileData);

      console.log("Profile updated successfully!");

      setChangesSaved(true);
      setTimeout(() => {
        setChangesSaved(false);
      }, 3000);
    } catch (error) {
      setError("Error updating profile. Please try again later.");
      console.error("Error in updating profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to access this page</div>;
  }

  return (
    <div>
    <div className="header-banner">
      <img src="MemoryLaneB.png" alt="Logo" className="logo" />
      Memory Lane
    </div>
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture-container" onClick={() => document.getElementById('profile-pic-input').click()}>
          <img src={profilePic || "https://via.placeholder.com/150"} alt="Profile" className="profile-picture" />
          <input type="file" id="profile-pic-input" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} />
        </div>
        <div className="profile-details">
          <h2>Edit Profile</h2>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={handleUsernameChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" value={location} onChange={handleLocationChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" value={bio} onChange={handleBioChange}></textarea>
          </div>
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
          <div className="form-group">
            <label htmlFor="background-color">Background Color:</label>
            <SketchPicker color={backgroundColor} onChange={handleBackgroundColorChange} />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="update-button" onClick={handleSaveChanges} disabled={loading || changesSaved}>
            {loading ? 'Saving...' : (changesSaved ? 'Changes Saved' : 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
