import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // PHẢI có dòng này
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Bắt buộc bao bọc App ở đây */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);