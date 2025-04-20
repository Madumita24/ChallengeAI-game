import React, { useState } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      // ✅ Save to localStorage
      const sessionId = crypto.randomUUID(); // generate unique session ID
      localStorage.setItem("userName", trimmedName);
      localStorage.setItem("sessionId", sessionId);

      // ✅ Navigate to next page
      navigate('/elected');
    } else {
      alert('Please enter your name before proceeding.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to the Republic of Bean!</h1>

      <div className="bean-section">
        <div className="bean-logo" />
      </div>

      <div className="name-box">
        <div className="name-title">Please enter your name:</div>
        <div className="input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Your name here"
          />
        </div>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
