import React from 'react';

const Navbar = ({ onNavigate }) => {
  return (
    <nav style={{ background: '#1976d2', color: '#fff', padding: '1em' }}>
      <button style={{ marginRight: '1em' }} onClick={() => onNavigate('home')}>Home</button>
      <button onClick={() => onNavigate('ai')}>AI Assistant</button>
    </nav>
  );
};

export default Navbar;
