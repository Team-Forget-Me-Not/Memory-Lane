import React, { useState } from 'react';
import './CreateAccount.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faArrowRight, faVenusMars } from '@fortawesome/free-solid-svg-icons';


const CreateAccount = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');

  const handleCreateAccount = () => {
    console.log('Account created:', { firstName, lastName, username, email, password, gender });
    setFirstName('');
    setLastName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setGender('');
  };

  return (
    <div className="create-account-page">
      <h1>Create Account</h1>
      <div className="create-account-form">
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faVenusMars} />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button onClick={handleCreateAccount}>
          <FontAwesomeIcon icon={faArrowRight} />
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
