import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhaseTwo.css';

import bgImage from '../assets/bg.png';
import agentBlue from '../assets/agent-blue.png';
import agentGreen from '../assets/agent-green.png';
import agentPink from '../assets/agent-pink.png';
import agentYellow from '../assets/agent-yellow.png';
import agentRed from '../assets/agent-red.png';

const agentImages = [agentBlue, agentGreen, agentRed, agentYellow, agentPink];
const angles = ['left', 'midleft', 'center', 'midright', 'right'];

const optionDescriptions = {
  "Access to Education": [
    "Limit access to education for refugees, allowing only a small percentage to enroll in mainstream schools.",
    "Establish separate schools or learning centers specifically for refugee education.",
    "Provide equal access to education for all, and integrate refugee students into mainstream schools."
  ],
  "Language Instruction": [
    "Teach only Teanish in schools, excluding other languages.",
    "Provide primary Teanish language courses to refugees.",
    "Implement bilingual education programs in both Teanish and the refugees' mother tongues."
  ],
  "Teacher Training": [
    "Provide minimal or no specific training for teachers regarding refugee education.",
    "Offer basic training sessions for teachers to familiarize them with the challenges and needs of refugee students.",
    "Implement comprehensive and ongoing training programs for teachers to support and educate refugee students effectively."
  ],
  "Curriculum Adaptation": [
    "Maintain the existing national curriculum without modifications.",
    "Introduce supplementary materials acknowledging refugee experiences within the current curriculum.",
    "Adapt the national curriculum to include diverse perspectives, histories, and cultural elements relevant to all."
  ],
  "Psychosocial Support": [
    "Provide limited or no specific psychosocial support for refugee students.",
    "Establish basic support services such as counseling and peer support programs.",
    "Develop comprehensive and specialized psychosocial support programs for refugee students and their families."
  ],
  "Financial Support": [
    "Allocate minimal funds to support refugee education.",
    "Increase financial support for refugee education, but may still fall short of full needs.",
    "Allocate significant financial resources to ensure adequate funding and comprehensive support."
  ],
  "Certification/Accreditation": [
    "Only recognize education obtained within the Republic of Bean, disregarding prior learning.",
    "Establish a universal evaluation process to accredit refugees’ prior education.",
    "Combine recognition of previous education with additional training to meet national standards."
  ]
};

export default function PhaseTwo() {
  const initialPolicies = JSON.parse(localStorage.getItem('userPolicies')) || {};
  const categories = Object.keys(initialPolicies);
  const navigate = useNavigate();

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [userVotes, setUserVotes] = useState({});
  const [groupVotes, setGroupVotes] = useState({});
  const [agentComments, setAgentComments] = useState([]);
  const [agentVotes, setAgentVotes] = useState([]);
  const [agentReasons, setAgentReasons] = useState([]);
  const [userSpeech, setUserSpeech] = useState('');
  const [finalDecision, setFinalDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [debateComplete, setDebateComplete] = useState(false);
  const [agentSpeakingIndex, setAgentSpeakingIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
  
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      console.log("🗣️ Available voices:", availableVoices.map(v => v.name));
      setVoices(availableVoices);
    };
  
    // Chrome sometimes delays voice loading — trigger it with a timeout
    setTimeout(() => {
      populateVoices();
    }, 100);
  
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = populateVoices;
    }
  }, []);
  


  const currentCategory = categories[currentCategoryIndex];
  const currentVote = userVotes[currentCategory] || '';
  const maxBudget = 14;

  const getOptionScore = (value) => parseInt(value, 10);
  const usedBudget = Object.values(userVotes).reduce((acc, val) => acc + getOptionScore(val), 0);
  const remainingBudget = maxBudget - usedBudget;

  useEffect(() => {
    const synth = window.speechSynthesis;
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };
    populateVoices();
    synth.onvoiceschanged = populateVoices;
  }, []);

  useEffect(() => {
    setShowResults(false);
    setFinalDecision(null);
    setAgentVotes([]);
    setAgentReasons([]);
    setAgentComments([]);
    setUserSpeech('');
    setDebateComplete(false);
  }, [currentCategory]);

  const handleVote = (value) => {
    const proposed = getOptionScore(value);
    const previous = getOptionScore(userVotes[currentCategory] || 0);
    if (usedBudget - previous + proposed > maxBudget) {
      alert("Not enough budget left.");
      return;
    }
    setUserVotes({ ...userVotes, [currentCategory]: value });
  };

  const handleConfirmVote = async () => {
    if (!currentVote) {
      alert("Please select a vote to save your preference.");
      return;
    }

    const existingVotes = JSON.parse(localStorage.getItem("userVotes")) || {};
    const updatedVotes = {
      ...existingVotes,
      [currentCategory]: currentVote
    };
    localStorage.setItem("userVotes", JSON.stringify(updatedVotes));

    setLoading(true);
    try {
      const res = await fetch('/submit-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem("sessionId"),
          category: currentCategory,
          userVote: currentVote
        })
      });

      const data = await res.json();
      setAgentVotes(data.agentVotes);
      setAgentReasons(data.agentReasons);
      setFinalDecision(data.finalDecision);

      setGroupVotes(prev => ({
        ...prev,
        [currentCategory]: {
          user: currentVote,
          agents: data.agentVotes,
          agentReasons: data.agentReasons,
          finalDecision: data.finalDecision
        }
      }));
      setShowResults(true);
    } catch (err) {
      console.error("Voting failed:", err);
    } finally {
      setLoading(false);

      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
      } else {
        localStorage.setItem("groupVotes", JSON.stringify(groupVotes));
        navigate('/summary');
      }
    }
  };

  const startUserSpeechDebate = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsRecording(true);

    recognition.onresult = async (event) => {
      setIsRecording(false);
      const spokenText = event.results[0][0].transcript;
      setUserSpeech(spokenText);

      try {
        const res = await fetch('/user-debate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: localStorage.getItem("sessionId"),
            category: currentCategory,
            userSpeech: spokenText
          })
        });

        const data = await res.json();
        const replies = data.agentReplies;
        const updatedComments = [];
        //const usableVoices = voices.length ? voices : [];
     // ✅ Map preferred voice names to agents
const voiceNameMap = [
  "Microsoft David - English (United States)",
  "Microsoft Zira - English (United States)",
  "Microsoft David - English (United States)",
  "Microsoft Zira - English (United States)"
  // "Google US English",
  // "Google UK English Female"
];

// 🎯 Map to actual available voice objects
const usableVoices = voiceNameMap.map(name =>
  voices.find(v => v.name === name)
);

// 💬 Fallback if a voice is missing
const fallbackVoice = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;

console.log("🎙️ Agent Voice Assignments:");
usableVoices.forEach((v, i) => {
  console.log(`Agent ${i + 1}: ${v?.name || '❌ Not found, will fallback'}`);
});

for (let i = 0; i < replies.length; i++) {
  setAgentSpeakingIndex(i);
  updatedComments[i] = '';
  setAgentComments([...updatedComments]);

  const reply = replies[i];
  const tts = new SpeechSynthesisUtterance(reply);

  const selectedVoice = usableVoices[i] || fallbackVoice;
  tts.voice = selectedVoice;
  tts.pitch = 1;
  tts.rate = 1;
  tts.volume = 1;
  tts.lang = 'en-US';

  console.log(`🧠 Agent ${i + 1} speaking with: ${selectedVoice?.name}`);

  const typeEffect = () => {
    return new Promise(resolve => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < reply.length) {
          updatedComments[i] += reply[index];
          setAgentComments([...updatedComments]);
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  };

  const speechPromise = new Promise(resolve => {
    tts.onend = resolve;
    window.speechSynthesis.cancel(); // stop leftovers
    setTimeout(() => {
      window.speechSynthesis.speak(tts);
    }, 150); // slight delay to prevent drop
  });

  await Promise.all([typeEffect(), speechPromise]);
}


        setAgentSpeakingIndex(null);
        setDebateComplete(true);
      } catch (err) {
        console.error("Voice debate error:", err);
        setIsRecording(false);
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      setIsRecording(false);
    };
  };

  return (
    <div className="phase-two-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="budget-bar">
        Budget Remaining: <span>{remainingBudget}</span> / {maxBudget}
      </div>

      <div className="table-group">
        {agentImages.map((img, i) => (
          <div className={`agent-wrapper angle-${angles[i]}`} key={i}>
            <img src={img} alt={`Agent ${i}`} className="agent" />
            <div className={`speech-bubble ${agentSpeakingIndex === i ? 'speaking' : ''}`}>
              {agentComments[i] || ""}
            </div>
          </div>
        ))}
      </div>

      <div className="voting-box">
        <h3>Vote on “{currentCategory}”</h3>

        <div className="vote-options">
          {[1, 2, 3].map((val, idx) => (
            <label key={val}>
              <input
                type="radio"
                name="vote"
                value={val}
                checked={currentVote === String(val)}
                onChange={(e) => handleVote(e.target.value)}
              />
              <strong>Option {val}:</strong> {optionDescriptions[currentCategory]?.[idx]}
            </label>
          ))}
        </div>

        <div className="speak-wrapper">
          <button
            className={`speak-button ${isRecording ? 'recording' : ''}`}
            onClick={startUserSpeechDebate}
          >
            {isRecording ? '🎤 Listening...' : '🎙 Let’s First Discuss'}
          </button>
          {userSpeech && <p><strong>You said:</strong> {userSpeech}</p>}
        </div>

        {debateComplete && (
          <div className="vote-buttons">
            <button onClick={handleConfirmVote} disabled={loading}>
              Save & Continue
            </button>
          </div>
        )}

        {showResults && (
          <div className="vote-moderator">
            <p>🧠 Agent Votes: {agentVotes.join(', ')}</p>
            <p>🧾 Agent Reasons:</p>
            <ul>
              {agentReasons.map((r, i) => (
                <li key={i}><strong>Agent {i + 1}:</strong> {r}</li>
              ))}
            </ul>
            <p>🗳 Final Group Decision: Option {finalDecision}</p>
          </div>
        )}
      </div>
    </div>
  );
}
