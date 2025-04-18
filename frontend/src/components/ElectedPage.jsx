import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElectedPage.css';
import beanLogo from '../assets/bean.png';
import beanReader from '../assets/bean-reader.png'; // <- 3D bean image with transparent background

export default function ElectedPage({ name }) {
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.classList.add('twirl');
    }
  }, []);

  const handleCheckbox = (e) => {
    setAccepted(e.target.checked);
  };

  const handleContinue = () => {
    console.log('Navigating to phase-one...');
    navigate('/phase-one');
  };

  // ⌨️ Enter key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (accepted) {
          handleContinue();
        } else {
          alert('Please accept the terms and conditions before continuing.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [accepted]);

  return (
    <div className="elected-container">
      <div className="congrats-banner">Congratulations, {name}!</div>

      <div className="elected-card">
        <p className="elected-text">You have been elected as a member of parliament!</p>

        {/* Logo with twirl */}
        <img ref={logoRef} className="bean-logo-twirl" src={beanLogo} alt="Republic of Bean Logo" />

        {/* Description text */}
        <p className="republic-desc">
          The Republic of Bean is a diverse and welcoming nation — but today, it faces a growing challenge. Refugees from neighboring lands have arrived in search of safety and a better future. While the country has opened its arms, its systems — especially education — are struggling to keep up. <br /><br />
          Schools are overcrowded, teachers are overwhelmed, and many refugee children don’t speak Teanish, the national language. As a newly elected member of parliament, your mission is clear: <strong>design fair, effective policies to support refugee students</strong> and ensure that every child — no matter where they come from — has access to quality education. <br /><br />
          You’ll explore real dilemmas, hear from advisors, debate your views, and cast votes that shape the nation’s future. Get ready to think critically, act compassionately, and lead the Republic of Bean through a defining moment.
        </p>

        {/* Terms and Continue */}
        <label className="terms">
          <input type="checkbox" onChange={handleCheckbox} /> I accept the terms and conditions
        </label>

        {accepted && (
          <button className="continue-button" onClick={handleContinue}>
            👉 Continue
          </button>
        )}
      </div>

      {/* Floating Bean Character + Speech Bubble */}
      <div className="floating-bean">
        <div className="speech-bubble">Let's see what I sign up for?</div>
        <img src={beanReader} alt="Reading Bean" className="bean-reader" />
      </div>
    </div>
  );
}
