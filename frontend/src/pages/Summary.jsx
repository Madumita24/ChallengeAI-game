import React, { useEffect, useState } from 'react';
import './Summary.css';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import agentBlue from '../assets/bluebot.png';
import agentGreen from '../assets/greenbot.png';
import agentOrange from '../assets/yellowbot.png';
import agentRed from '../assets/redbot.png';
import userSilhouette from '../assets/user.png';

const agents = [
  { name: 'Policy Maker 1', img: agentBlue },
  { name: 'Policy Maker 2', img: agentGreen },
  { name: 'Policy Maker 3', img: agentOrange },
  { name: 'Policy Maker 4', img: agentRed },
  { name: 'User', img: userSilhouette },
];

const policyNames = [
  "Access to Education",
  "Language Instruction",
  "Teacher Training",
  "Curriculum Adaptation",
  "Psychosocial Support",
  "Financial Support",
  "Certification/Accreditation"
];

const PolicySummary = () => {
  const [policyVotes, setPolicyVotes] = useState([]);
  const [optimizedSet, setOptimizedSet] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestVotes = async () => {
      try {
        const latestVoteQuery = query(
          collection(db, 'PhaseTwoVotes'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        const snapshot = await getDocs(latestVoteQuery);

        if (snapshot.empty) {
          console.warn('No recent vote data found.');
          return;
        }

        const voteDoc = snapshot.docs[0];
        const data = voteDoc.data();

        const agentVotes = [
          data.agentVotesByAgent.agent_1.map(Number),
          data.agentVotesByAgent.agent_2.map(Number),
          data.agentVotesByAgent.agent_3.map(Number),
          data.agentVotesByAgent.agent_4.map(Number),
        ];
        const userVotes = data.userVotesArray;

        const combinedVotes = agentVotes[0].map((_, i) => [
          agentVotes[0][i],
          agentVotes[1][i],
          agentVotes[2][i],
          agentVotes[3][i],
          userVotes[i],
        ]);

        // Calculate optimized choices
        const optimized = combinedVotes.map(votesRow => {
          const count = { 1: 0, 2: 0, 3: 0 };
          votesRow.forEach(v => count[v]++);
          const maxVotes = Math.max(...Object.values(count));
          const optionsWithMaxVotes = Object.entries(count)
            .filter(([opt, val]) => val === maxVotes)
            .map(([opt]) => parseInt(opt));
          return Math.min(...optionsWithMaxVotes);
        });

        // Enforce budget
        let totalScore = optimized.reduce((sum, val) => sum + val, 0);

        if (totalScore > 14) {
          let downgradeCandidates = combinedVotes.map((votes, index) => {
            const count = { 1: 0, 2: 0, 3: 0 };
            votes.forEach(v => count[v]++);
            const score = optimized[index];
            return {
              index,
              score,
              votesFor3: count[3],
            };
          });

          downgradeCandidates = downgradeCandidates
            .filter(c => c.score === 3)
            .sort((a, b) => a.votesFor3 - b.votesFor3);

          for (let i = 0; i < downgradeCandidates.length && totalScore > 14; i++) {
            const { index } = downgradeCandidates[i];
            optimized[index] = 2;
            totalScore -= 1;
          }
        }

        setPolicyVotes(combinedVotes);
        setOptimizedSet(optimized);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch PhaseTwoVotes:', error);
      }
    };

    fetchLatestVotes();
  }, []);

  if (loading) return <div className="subtitle">Loading vote summary...</div>;

  return (
    <div className="summary-container">
      <h2 className="subtitle">OPTIMIZED POLICY SET</h2>
      <table className="vote-table dark-theme">
        <thead>
          <tr>
            <th>Policy</th>
            {agents.map((agent, index) => (
              <th key={index}>
                <img src={agent.img} alt={agent.name} className="agent-icon" />
                <div>{agent.name}</div>
              </th>
            ))}
            <th>Optimized Result</th>
          </tr>
        </thead>
        <tbody>
          {policyVotes.map((row, index) => (
            <tr key={index}>
              <td>{policyNames[index]}</td>
              {row.map((vote, idx) => (
                <td key={idx}>{vote}</td>
              ))}
              <td>{optimizedSet[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Continue Button */}
      <button
        className="continue-button"
        onClick={() => navigate("/phase-three")}
      >
        Continue to Reflection
      </button>
    </div>
  );
};

export default PolicySummary;
