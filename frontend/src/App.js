import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import ElectedPage from './components/ElectedPage';
import PhaseOne from './pages/PhaseOne';
import PhaseTwo from './pages/PhaseTwo';
import PhaseThree from './pages/PhaseThree';
import PolicySummary from './pages/Summary';
import ThankYouPage from './pages/ThankYouPage';


function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/elected" element={<ElectedPage name={location.state?.name || 'Citizen'} />} />
      <Route path="/phase-one" element={<PhaseOne />} />
      <Route path="/phase-two" element={<PhaseTwo />} />
      <Route path="/Summary" element={<PolicySummary />} />
      <Route path="/phase-three" element={<PhaseThree />} />
      <Route path="/thankyou" element={<ThankYouPage />} />
      


    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;