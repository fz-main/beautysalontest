import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Удаляем все возможные старые ключи
const keysToRemove = [
  'bibenglow_bookings',
  'bibenglow_bookings_v2',
  'bibenglow_bookings_new',
  'beautysalontest_bookings',
  'beautysalontest_unique'
];
keysToRemove.forEach(key => localStorage.removeItem(key));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
