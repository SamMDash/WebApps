import React, { useState } from 'react';


const getBahmniContext = () => {
  // Try to extract patientId and doctorId from global Bahmni context if available
  let patientId = '';
  let doctorId = '';
  if (window.patientContext && window.patientContext.patient && window.patientContext.patient.uuid) {
    patientId = window.patientContext.patient.uuid;
  } else if (window.patient && window.patient.uuid) {
    patientId = window.patient.uuid;
  }
  if (window.sessionContext && window.sessionContext.currentProvider && window.sessionContext.currentProvider.uuid) {
    doctorId = window.sessionContext.currentProvider.uuid;
  } else if (window.currentUser && window.currentUser.uuid) {
    doctorId = window.currentUser.uuid;
  }
  return { patientId, doctorId };
};

const PatientContext = ({ onContextChange }) => {
  const bahmniContext = getBahmniContext();
  const [patientId, setPatientId] = useState(bahmniContext.patientId);
  const [doctorId, setDoctorId] = useState(bahmniContext.doctorId);

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
