import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Удаляем все возможные старые ключи
const oldKeys = [
  'bibenglow_bookings',
  'bibenglow_bookings_v2',
  'beautysalontest_bookings',
  'beautysalontest_v3',
  'beautysalontest_prod_2025'
];
oldKeys.forEach(key => localStorage.removeItem(key));

console.log('🧹 СТАРЫЕ КЛЮЧИ УДАЛЕНЫ');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
