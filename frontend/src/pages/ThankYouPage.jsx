import React, { useEffect, useState } from 'react';
import './ThankYouPage.css';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ThankYouPage = () => {
  const [sessionId, setSessionId] = useState('');
  const [allData, setAllData] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sid = localStorage.getItem('sessionId');
        if (!sid) {
          alert("Session ID not found!");
          return;
        }

        setSessionId(sid);
        const collections = ['phaseOneData', 'PhaseTwoVotes', 'debates', 'phaseThreeReflections'];
        const data = {};

        for (let col of collections) {
          const docRef = doc(db, col, sid);
          const snap = await getDoc(docRef);
          data[col] = snap.exists() ? snap.data() : { note: 'No data found' };
        }

        setAllData(data);
      } catch (error) {
        console.error('❌ Failed to fetch report data:', error);
      }
    };

    fetchSessionData();
  }, []);

  const handleDownload = () => {
    if (!allData) {
      alert("Report data not loaded yet.");
      return;
    }

    const pdf = new jsPDF();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Refugee Education Policy Report', 14, 22);

    let currentY = 35;

    Object.entries(allData).forEach(([section, content], i) => {
      pdf.setFontSize(14);
      pdf.setTextColor(40);
      pdf.text(`${section}`, 14, currentY);
      currentY += 4;

      const entries = Object.entries(content || {}).map(([k, v]) => [k, JSON.stringify(v, null, 2)]);
      autoTable(pdf, {
        startY: currentY + 2,
        head: [['Field', 'Value']],
        body: entries,
        styles: { fontSize: 9, cellPadding: 2 },
      });

      currentY = pdf.lastAutoTable.finalY + 10; // Move down after each table
    });

    pdf.save(`RefugeePolicyReport_${sessionId}.pdf`);
  };

  return (
    <div className="thankyou-container">
      <h1 className="thank-title">🎉 Thank You for Participating!</h1>
      <p className="thank-subtext">Your insights have helped shape a better future for refugee education.</p>
      <button className="download-button" onClick={handleDownload}>
        Download Report as PDF 📄
      </button>
    </div>
  );
};

export default ThankYouPage;
