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
        You are an honorable member of parliament in the Republic of Bean, a unique nation situated in a distant realm beyond Earth. While the country is not wealthy, its citizens enjoy free access to education, healthcare, and various public services. The Republic of Bean prides itself on its multicultural society, comprising three ethnicities and two religious minority groups. Thanks to the country's commitment to secularism, citizens are free to practice their religions without any obstacles. However, due to safety concerns, the nation follows many monolithic praxis and policies, which includes a monolingual education system and teaching only Grapes’ , the majority group, history, and literature. Also, Grapes’ language, Teanish is the only official language is used for the public services.
The largest minority group in the Republic of Bean is the Curly Hairs, who possess distinct ethnic backgrounds and their own language. They have
long been advocating for their cultural rights, with a specific focus on education in their mother tongue. The Curly Hairs make up approximately
22% of the country's total population. While poverty is not a prevalent issue in the Republic of Bean, the nation suffer from corruption, which angers citizens. In response, citizens occasionally take to the streets in protest, sometimes resulting in clashes with the police. Additionally, Grapes seeks to maintain their dominance
in the administration and bureaucracy. They hold the belief that sharing power with other groups would jeopardize the nation's future.
The Republic of Bean shares borders with four neighboring countries, three of which enjoy stable conditions. However, the country's northwestern neighbor, Orangenya, is currently experiencing internal conflicts. As a result, two million individuals have sought refuge in the Republic of Bean, comprising 14% of its entire population. Despite their geographic proximity, these refugees and the citizens of the Republic of
Bean possess numerous cultural differences.
In the aftermath of a global economic crisis, the Republic of Bean's economy has become increasingly unstable. Moreover, other nations worldwide are hesitant to extend solidarity towards the country. This unfortunately promotes xenophobia and political debates, leading to
heightened polarization within the nation. In response to these challenges, the parliament has initiated an educational reform aimed at providing
contemporary, quality, and accessible education for all refugees. Also, the parliament wants to focus on the social integration of refugees to prevent possible conflicts.
As a member of parliament, you bear the responsibility of actively participating in and contributing to this reform process. The reform package comprises 7 key factors, and you will be tasked with choosing an option from each factor, ensuring the allocation of limited resources. By making
these decisions, you can help shape the future of refugee education in the Republic of Bean.
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
        <div className="speech-bubble">What do I sign up for ?</div>
        <img src={beanReader} alt="Reading Bean" className="bean-reader" />
      </div>
    </div>
  );
}
