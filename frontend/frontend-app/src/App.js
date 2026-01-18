import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/login'; // Đảm bảo đường dẫn này đúng

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App; 