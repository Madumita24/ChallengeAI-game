# CHALLENGE AI – Refugee Education Policy Simulation Game

**CHALLENGE AI** is an interactive, AI-powered web application built for the Hackathon conducted in Arizona State University. It simulates the complexities of policymaking around refugee education through an engaging 3-phase experience with realistic budget constraints, AI-driven agent debates, and voice-based interactions.

## 🧠 Project Overview

This project empowers users to act as decision-makers tasked with allocating a fixed budget across multiple refugee education policy categories. Users engage in structured deliberation with four ideologically distinct AI agents and reflect on the final group decision.

## 🔥 Key Features

### ✅ Phase I – Policy Selection
- Allocate a total of **14 budget points** across **7 education policy categories**
- Real-time budget tracking and option lock-in

### 🗣️ Phase II – AI Deliberation
- AI agents (Red, Blue, Yellow, Green) provide unique perspectives and justifications
- Users engage with agents via **voice input** and receive **speech synthesis responses**
- Each agent votes independently based on their beliefs and budget awareness
- Final group decision made by majority voting

### 🧾 Phase III – Reflection & Summary
- Users reflect on decisions and debates
- Option to **generate a downloadable PDF report** of all session data

## 🛠️ Tech Stack

| Layer     | Tools / Frameworks                                  |
|-----------|------------------------------------------------------|
| Frontend  | React, Tailwind CSS, Web Speech API (Voice I/O)      |
| Backend   | Node.js, Express, OpenAI API (GPT-3.5 / GPT-4)       |
| Database  | Firebase Firestore                                   |
| Hosting   | GitHub Pages (Frontend), AWS EC2 (Backend)           |
| AI Logic  | Custom prompt engineering + role-based GPT agents    |

## 🗃️ Data Architecture

- `phaseOneData`: User policy selections with budget usage
- `PhaseTwoVotes`: AI agent votes and justifications
- `debates`: Voice-based AI discussions
- `phaseThreeReflections`: User feedback and insights
- All documents are linked by a unique **session ID**
