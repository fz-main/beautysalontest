import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Удаляем все возможные старые ключи
localStorage.removeItem('bibenglow_bookings');
localStorage.removeItem('bibenglow_bookings_v2');
localStorage.removeItem('bibenglow_bookings_new');
localStorage.removeItem('beautysalontest_bookings');
localStorage.removeItem('beautysalontest_unique');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
