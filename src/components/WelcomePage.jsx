import React, { useState, useEffect } from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';
export default function WelcomePage() {
 const [showSpeech, setShowSpeech] = useState(true); // NEW
  const [name, setName] = useState('');
  const navigate = useNavigate();

  
const handleSubmit = () => {
    if (name.trim()) {
      navigate('/elected', { state: { name } });
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpeech(false);
    }, 4000); // Hide after 4 seconds
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="welcome-container">
      <h1>Welcome to the Republic of Bean!</h1>
      <div className="bean-wrapper">
  <div className="bean-logo" />
  {showSpeech && (
    <div className="bean-speech">👋 Welcome, policymaker!</div>
  )}
</div>
      <div className="name-box">
        <div className="name-title">Please enter your name:</div>
        <div className="input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name here"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
