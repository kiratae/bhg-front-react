import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthenticationPage from './pages/AuthenticationPage';
import RoomPage from './pages/RoomPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
