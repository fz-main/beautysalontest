import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Удаляем все старые ключи (чтобы старые записи не мешали)
localStorage.removeItem('bibenglow_bookings');
localStorage.removeItem('bibenglow_bookings_v2');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
