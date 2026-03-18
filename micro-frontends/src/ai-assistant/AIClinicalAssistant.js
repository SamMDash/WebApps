import React, { useState } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import AIAdvisor from './AIAdvisor';
import PatientContext from './PatientContext';
import './styles.css';

const AIClinicalAssistant = () => {
  const [page, setPage] = useState('home');
  const [context, setContext] = useState({ patientId: '', doctorId: '' });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', textAlign: 'center' }}>AI Clinical Assistant</h1>
      <Navbar onNavigate={setPage} />
      <PatientContext onContextChange={setContext} />
      {page === 'home' && <Home />}
      {page === 'ai' && <AIAdvisor patientId={context.patientId} doctorId={context.doctorId} />}
    </div>
  );
};

export default AIClinicalAssistant;
