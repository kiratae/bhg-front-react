import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Flowbite } from "flowbite-react";
import AuthenticationPage from './pages/AuthenticationPage';
import RoomPage from './pages/RoomPage';
import './App.css';

const customTheme = {
  button: {
    color: {
      primary: "border border-violet-500 bg-violet-500 hover:bg-violet-700 hover:border-violet-700 text-white shadow rounded-lg",
      secondary: "border border-blue-500 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 text-white shadow rounded-lg",
      light: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 shadow rounded-lg",
    },
  },
  modal: {
    header: {
      close: {
        base: "hidden",
      },
    },
  }
};

function App() {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Router>
        <Routes>
          <Route path="/" element={<AuthenticationPage />} />
          <Route path="/join/:roomId" element={<AuthenticationPage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </Router>
    </Flowbite>
  );
}

export default App;
