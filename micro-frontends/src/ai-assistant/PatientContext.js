import React, { useState } from 'react';

const PatientContext = ({ onContextChange }) => {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onContextChange({ patientId, doctorId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1em' }}>
      <input
        type="text"
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
        placeholder="Patient ID"
        required
        style={{ marginRight: '0.5em' }}
      />
      <input
        type="text"
        value={doctorId}
        onChange={e => setDoctorId(e.target.value)}
        placeholder="Doctor ID"
        required
        style={{ marginRight: '0.5em' }}
      />
      <button type="submit">Set Context</button>
    </form>
  );
};

export default PatientContext;
