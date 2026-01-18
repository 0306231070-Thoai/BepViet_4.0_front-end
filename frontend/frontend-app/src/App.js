import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/login'; // Đảm bảo đường dẫn này đúng
import ForgotPassword from './pages/Auth/forgotPassword';
import Profile from './User/Profile';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App; 