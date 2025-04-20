import React, { useState, useRef } from 'react';
import './PhaseThree.css';
import thinkingBean from '../assets/bean-thinking.png';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebaseConfig"; // ✅ ensure you export app from firebaseConfig.js


import { useNavigate } from 'react-router-dom';
const questions = [
  "What emotions came up for you during the decision-making process—discomfort, frustration, detachment, guilt? What do those feelings reveal about your position in relation to refugee education?",
  "Did anything about your role in the game feel familiar—either from your personal or professional life? If so, how?",
  "What assumptions about refugees, policy, or education were challenged or reinforced during the game?",
  "How did the group dynamics impact your ability to advocate for certain policies? Were there moments when you chose silence or compromise? Why?",
  "Has your understanding of refugee education shifted from seeing it as a service 'for them' to a system embedded in broader struggles over power, identity, and justice? If so, how?",
  "Whose interests did your decisions ultimately serve—refugees, citizens, or the state? Why?",
  "What power did you assume you had as a policymaker—and who did you imagine was absent or voiceless in that process?",
  "What compromises did you make for the sake of consensus, and who or what got erased in the process?",
  "How did the structure of the game (budget, options, scenario) shape or limit your imagination of justice?",
  "If refugee education wasn't about inclusion into existing systems—but about transforming those systems—what would that look like, and did your decisions move toward or away from that?"
];

const PhaseThree = () => {
  const [responses, setResponses] = useState({});
  const recognitionRef = useRef(null);
  const navigate = useNavigate(); // 👈 you need this

  const handleChange = (index, value) => {
    setResponses(prev => ({ ...prev, [index]: value }));
  };

  const handleMicClick = (index) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser 😢");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort(); // stop previous if running
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setResponses(prev => ({
        ...prev,
        [index]: prev[index] ? `${prev[index]} ${transcript}` : transcript
      }));
    };

    recognition.onerror = (event) => {
      alert(`Error: ${event.error}`);
    };
  };

  const handleSubmit = async () => {
    const sessionId = localStorage.getItem("sessionId");
    const userName = localStorage.getItem("userName"); // 👈 Add this line

    try {
      await setDoc(doc(db, "phaseThreeReflections", sessionId), {
        userName,
        sessionId,
        reflections: responses,
        timestamp: new Date()
      });
      alert("✅ Reflections saved successfully.");
      navigate("/thankyou"); // ✅ Redirect to Thank You page
    } catch (err) {
      console.error("❌ Failed to save reflections:", err);
      alert("Error saving reflections.");
    }
  };
  ///////////////////////////
  // const handleSubmit = async () => {
  //   const sessionId = localStorage.getItem("sessionId");
  //   const userName = localStorage.getItem("userName");
  
  //   try {
  //     // ✅ 1. Save reflection data to Firestore
  //     await setDoc(doc(db, "phaseThreeReflections", sessionId), {
  //       userName,
  //       sessionId,
  //       reflections: responses,
  //       timestamp: new Date(),
  //     });
  
  //     // ✅ 2. Call your local Express backend to send the email
  //     const response = await fetch("http://localhost:4000/send-report", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ sessionId }),
  //     });
  
  //     const result = await response.json();
  
  //     if (result.success) {
  //       alert("✅ Reflections saved & report emailed.");
  //       navigate("/thankyou");
  //     } else {
  //       throw new Error(result.error || "Unknown error");
  //     }
  //   } catch (err) {
  //     console.error("❌ Failed to save or send report:", err);
  //     alert("Something went wrong while saving or sending the report.");
  //   }
  // };
  
  
  return (
    <div className="phase-three-container">
      <h1 className="title">Time to Reflect in the Republic of Bean!</h1>

      <div className="bean-area">
        <img src={thinkingBean} alt="Reflective Bean" className="thinking-bean" />
        <p className="bean-quote">Justice begins with reflection.</p>
      </div>

      <div className="questions-area">
        {questions.map((question, index) => (
          <div className="question-card" key={index}>
            <label>{question}</label>
            <textarea
              value={responses[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Type your answer here or you can speak ..."
            />
            <img
              src={require('../assets/mic-icon.png')}
              alt="Mic Icon"
              className="mic-icon"
              onClick={() => handleMicClick(index)}
              title="Click to speak"
            />
          </div>
        ))}
      </div>

      <div className="submit-area">
        <button className="submit-btn" onClick={handleSubmit}>Submit Reflection</button>
        <p className="footer-note">Your responses will be included in your Evaluation Report.</p>
      </div>
    </div>
  );
};

export default PhaseThree;
