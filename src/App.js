import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import ElectedPage from './components/ElectedPage';
import PhaseOne from './pages/PhaseOne';


function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/elected" element={<ElectedPage name={location.state?.name || 'Citizen'} />} />
      <Route path="/phase-one" element={<PhaseOne />} />
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
