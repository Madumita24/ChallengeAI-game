import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhaseTwo.css';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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

  const [userName, setUserName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [userVotesArray, setUserVotesArray] = useState([]);
  const [currentVote, setCurrentVote] = useState(null);
  const [agentVotesByAgent, setAgentVotesByAgent] = useState({
    agent_1: [],
    agent_2: [],
    agent_3: [],
    agent_4: []
  });
  const [agentReplies, setAgentReplies] = useState([]);
  const [userSpeech, setUserSpeech] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [debateComplete, setDebateComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agentSpeakingIndex, setAgentSpeakingIndex] = useState(null);
  const [voices, setVoices] = useState([]);

  const currentCategory = categories[currentCategoryIndex];

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const session = localStorage.getItem("sessionId");
    if (!name || !session) {
      alert("Missing session info. Returning to start.");
      navigate('/');
    } else {
      setUserName(name);
      setSessionId(session);
    }
  }, [navigate]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const populateVoices = () => setVoices(synth.getVoices());
    synth.onvoiceschanged = populateVoices;
    populateVoices();
  }, []);

  const startDebate = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsRecording(true);

    recognition.onresult = async (event) => {
      setIsRecording(false);
      const spoken = event.results[0][0].transcript;
      setUserSpeech(spoken);
      setDebateComplete(false);
      setAgentReplies([]);

      try {
        // const res = await fetch('/user-debate', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     sessionId,
        //     category: currentCategory,
        //     userSpeech: spoken
        //   })
        // });
          const res = await fetch('http://localhost:3001/user-debate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              category: currentCategory,
              userSpeech: spoken
            })
          });
        

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);

        const { agentReplies, agentVotes } = await res.json();

        const updated = { ...agentVotesByAgent };
        agentVotes.forEach((vote, index) => {
          updated[`agent_${index + 1}`].push(vote);
        });
        setAgentVotesByAgent(updated);

        const voiceNameMap = [
          "Microsoft David - English (United States)",
          "Microsoft Zira - English (United States)",
          "Microsoft David - English (United States)",
          "Microsoft Zira - English (United States)"
        ];

        const usableVoices = voiceNameMap.map(name =>
          voices.find(v => v.name === name)
        );
        const fallbackVoice = voices.find(v => v.lang.startsWith('en')) || voices[0] || null;

        const updatedReplies = [];

        for (let i = 0; i < agentReplies.length; i++) {
          setAgentSpeakingIndex(i);
          updatedReplies[i] = '';
          setAgentReplies([...updatedReplies]);

          const reply = agentReplies[i];
          const tts = new SpeechSynthesisUtterance(reply);
          tts.voice = usableVoices[i] || fallbackVoice;
          tts.pitch = 1;
          tts.rate = 1;
          tts.volume = 1;
          tts.lang = 'en-US';

          const typeEffect = () =>
            new Promise(resolve => {
              let idx = 0;
              const interval = setInterval(() => {
                if (idx < reply.length) {
                  updatedReplies[i] += reply[idx];
                  setAgentReplies([...updatedReplies]);
                  idx++;
                } else {
                  clearInterval(interval);
                  resolve();
                }
              }, 10);
            });

          const speechPromise = new Promise(resolve => {
            tts.onend = resolve;
            window.speechSynthesis.cancel();
            setTimeout(() => {
              window.speechSynthesis.speak(tts);
            }, 150);
          });

          await Promise.all([typeEffect(), speechPromise]);
        }

        setAgentSpeakingIndex(null);
        setDebateComplete(true);
      } catch (err) {
        console.error("❌ Error during debate fetch:", err);
        alert("Backend failed to respond. Check your server or try again.");
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
  };

  const handleOptionSelect = (vote) => {
    setCurrentVote(vote);
  };

  const handleConfirmVote = async () => {
    if (!debateComplete) {
      alert("Please complete the debate before continuing.");
      return;
    }

    if (!currentVote) {
      alert("Please select a voting option before continuing.");
      return;
    }

    // const updatedVotes = [...userVotesArray, currentVote];
    // setUserVotesArray(updatedVotes);
    const updatedVotes = [...userVotesArray, currentVote];
setUserVotesArray(updatedVotes);

// 🧠 Get the full text of the selected option
const selectedOptionText = optionDescriptions[currentCategory][currentVote - 1];

// 🗳️ Create or update a separate array for verbose votes
const userVotesVerbose = JSON.parse(localStorage.getItem('userVotesVerbose')) || [];
userVotesVerbose.push(selectedOptionText);
localStorage.setItem('userVotesVerbose', JSON.stringify(userVotesVerbose));

    setLoading(true);

    try {
      await setDoc(doc(db, 'PhaseTwoVotes', sessionId), {
        sessionId,
        userName,
        userVotesArray: updatedVotes,
        userVotesVerbose,
        agentVotesByAgent,
        timestamp: new Date()
      });

      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
        setDebateComplete(false);
        setUserSpeech('');
        setAgentReplies([]);
        setCurrentVote(null);
      } else {
        navigate('/summary');
      }
    } catch (err) {
      console.error("Error storing vote data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phase-two-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="budget-bar">
        <strong>Budget Remaining:</strong> {14 - userVotesArray.reduce((acc, v) => acc + parseInt(v), 0)} / 14
      </div>

      <div className="table-group">
        {agentImages.map((img, i) => (
          <div className={`agent-wrapper angle-${angles[i]}`} key={i}>
            <img src={img} alt={`Agent ${i + 1}`} className="agent" />
            <div className={`speech-bubble ${agentSpeakingIndex === i ? 'speaking' : ''}`}>
              {agentReplies[i] || ""}
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
                onChange={() => handleOptionSelect(val)}
                checked={currentVote === val}
                disabled={loading}
              />
              <strong>Option {val}:</strong> {optionDescriptions[currentCategory][idx]}
            </label>
          ))}
        </div>

        <div className="speak-wrapper">
          <button className={`speak-button ${isRecording ? 'recording' : ''}`} onClick={startDebate}>
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
      </div>
    </div>
  );
}
