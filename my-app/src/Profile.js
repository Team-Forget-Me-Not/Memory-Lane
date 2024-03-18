import React, { useRef,useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import './Profile.css';
import { getStorage, ref, uploadBytes} from 'firebase/storage';


const firebaseStorage = getStorage();

const Profile = () => {
  // State variables for profile details and profile picture
  const [username, setUsername] = useState("Monika Asano");
  const [location, setLocation] = useState("Earth");
  const [joined, setJoined] = useState("January 2024");
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [bio, setBio] = useState("");

  const history = useHistory();
  // Function to handle profile picture upload
  const handleProfilePicChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the selected file
    setProfilePic(URL.createObjectURL(selectedFile)); // Set the profile picture to the selected file
  };

  // Function to handle username update
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };


  // Function to handle location update
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  // Function to handle bio update
  const handleBioChange = (event) => {
    setBio(event.target.value);
  };


  // Function to handle profile update
  const handleProfileUpdate = async () => {
    try{
      //This will upload the profile picture to the firebase storage
      let imageURL = profilePic ? await uploadProfilePicture(profilePic) : null;
      console.log("Profile updated successfully!",{
        username,
        location,
        bio,
        imageURL
      });
      //Redirect the user to the main menu
      history.push("/");
    } catch (error){
      console.error("Error in updating profile: ", error);
    }
    // Perform profile update logic here
    // For example, send updated profile data to the server
    // This function can also handle updating the profile picture if needed

  };

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
        <img src={profilePic ? URL.createObjectURL(profilePic) : "https://via.placeholder.com/150"} alt="Profile" />
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
          {/* Button to update profile */}
          <button className="update-button" onClick={handleProfileUpdate}>Update Profile</button>
        </div>
      </div>
      {/* Profile options section */}
      <div className="profile-options">
        <h3>Profile Options</h3>
        {/* Option to change profile picture */}
        <div className="option">
          <label htmlFor="profile-pic">Change Profile Picture:</label>
          <input type="file" id="profile-pic" accept="image/*" onChange={handleProfilePicChange} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
