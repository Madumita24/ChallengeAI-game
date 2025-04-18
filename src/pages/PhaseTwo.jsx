// src/pages/PhaseTwo.jsx
import React from 'react';
import './PhaseTwo.css';
import bgImage from '../assets/bg.png';

import agentBlue from '../assets/agent-blue.png';
import agentGreen from '../assets/agent-green.png';
import agentPink from '../assets/agent-pink.png';
import agentYellow from '../assets/agent-yellow.png';
import agentRed from '../assets/agent-red.png';

export default function PhaseTwo() {
  return (
    <div
      className="phase-two-container"
      style={{ backgroundImage: `url(${bgImage})` }}

    >
      <div className="table-group">
        <div className="agent-wrapper angle-left">
          <img src={agentBlue} alt="Agent Blue" className="agent" />
          <div className="speech-bubble">Option A is logical.</div>
        </div>

        <div className="agent-wrapper angle-midleft">
          <img src={agentGreen} alt="Agent Green" className="agent" />
          <div className="speech-bubble">Let's evaluate the risks.</div>
        </div>

        <div className="agent-wrapper angle-center">
          <img src={agentRed} alt="Agent Red" className="agent" />
          <div className="speech-bubble">I'm undecided.</div>
        </div>

        <div className="agent-wrapper angle-midright">
          <img src={agentYellow} alt="Agent Yellow" className="agent" />
          <div className="speech-bubble">Think of the cost!</div>
        </div>

        <div className="agent-wrapper angle-right">
          <img src={agentPink} alt="Agent Pink" className="agent" />
          <div className="speech-bubble">No!</div>
        </div>
      </div>

      <div className="voting-box">
  <h3>Choose your vote for “Language Instruction”</h3>
  <div className="vote-options">
    <label><input type="radio" name="vote" value="1" /> Option 1</label>
    <label><input type="radio" name="vote" value="2" /> Option 2</label>
    <label><input type="radio" name="vote" value="3" /> Option 3</label>
  </div>
  <div className="vote-buttons">
    <button>✔ Confirm Vote</button>
    <button>🔁 Re-vote</button>
    <button>→ Next Category</button>
  </div>
  <div className="vote-moderator">
    Moderator: Tie detected — breaking via randomness…
  </div>
</div>

    </div>
  );
}