import React, { useState } from 'react';
import './PhaseOne.css';
import bean from '../assets/bean-character.png';
import { policies, policyFeedback } from '../data/policyFeedback';
import { useNavigate } from 'react-router-dom';


const PhaseOne = () => {
  const [budget, setBudget] = useState(14);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [chosenPolicies, setChosenPolicies] = useState({});
  const [feedback, setFeedback] = useState({});
  const [bubbleText, setBubbleText] = useState("Choose a policy area to begin!");
  const [showWarningModal, setShowWarningModal] = useState(false); // 🚨 NEW
  const navigate = useNavigate();


  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleCardClick = (category) => {
    
      setSelectedCategory(category);
      setShowModal(true);
    
  };

  const handleOptionSelect = (option) => {
    // Step 1: Remove previous cost (if already selected)
    const previousCost = chosenPolicies[selectedCategory]?.cost || 0;
    const newBudget = budget + previousCost;
  
    // Step 2: Check if the new option is affordable
    if (newBudget < option.cost) {
      alert("Not enough budget!");
      return;
    }

    const explanation = `You chose ${option.title}. Pros: ${option.pros}. Cons: ${option.cons}`;
    const updatedBudget = newBudget - option.cost;

    setBudget(updatedBudget);
    setChosenPolicies(prev => ({ ...prev, [selectedCategory]: option }));
    setFeedback(prev => ({ ...prev, [selectedCategory]: explanation }));
    setBubbleText(explanation);
    setShowModal(false);
    speak(explanation);
  };

  const handleContinue = () => {
    if (Object.keys(chosenPolicies).length < Object.keys(policies).length) {
      setShowWarningModal(true); // 👀 trigger modal
    } else {
        // Store policy data in localStorage (or context if using)
        localStorage.setItem("userPolicies", JSON.stringify(chosenPolicies));
        navigate('/phase-two');
    }
  };

  return (
    <div className="phase-one-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="wooden-signs-wrapper">
          <img src="/wooden-header.png" alt="Wooden Header" className="wooden-signs" />
        </div>
        <div className="budget-box">Budget Remaining: <span>{budget} / 14</span></div>
      </div>

      {/* Category Grid */}
      <div className="category-grid">
        {Object.keys(policies).map((cat, idx) => {
          let extraClass = '';
          if (idx === 4) extraClass = 'centered-row-1';
          if (idx === 5) extraClass = 'centered-row-2';
          if (idx === 6) extraClass = 'centered-row-3';
          return (
            <div
              key={idx}
              className={`category-card color-${idx} ${chosenPolicies[cat] ? 'completed' : ''} ${extraClass}`}
              onClick={() => handleCardClick(cat)}
            >
              {cat}
            </div>
          );
        })}
      </div>

      {/* Mascot and Speech */}
      <div className="bean-wrapper">
        <div className="speech-bubble">{bubbleText}</div>
        <img src={bean} alt="Bean" className="bean-mascot" />
      </div>

      {/* Modal with Options */}
      {showModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCategory}</h2>
            {policies[selectedCategory].map((opt, i) => {
  const isSelected = chosenPolicies[selectedCategory]?.title === opt.title;

  return (
    <div key={i} className={`option-box ${isSelected ? "selected-option" : ""}`}>
      <h4>{opt.title} (Cost: {opt.cost})</h4>
      <p><strong>Pros:</strong> {opt.pros}</p>
      <p><strong>Cons:</strong> {opt.cons}</p>
      <button onClick={() => handleOptionSelect(opt)}>
        {isSelected ? "✅ Selected" : "Choose This"}
      </button>
    </div>
  );
})}

            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <div className="feedback-section">
        {Object.entries(feedback).map(([cat, text], idx) => (
          <div key={idx} className="feedback-item">
            <h4>{cat}</h4>
            <p>{text}</p>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="continue-section">
        <button className="continue-button" onClick={handleContinue}>
          Continue to Phase II →
        </button>
      </div>

      {/* 🚨 Warning Modal if not complete */}
      {showWarningModal && (
        <div className="modal-overlay" onClick={() => setShowWarningModal(false)}>
          <div className="modal-box warning-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🚨 Incomplete Choices!</h2>
            <p>Please complete all 7 policy choices before continuing to Phase II.</p>
            <button onClick={() => setShowWarningModal(false)}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseOne;
