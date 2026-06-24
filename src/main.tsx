import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Удаляем все возможные старые ключи
const allKeys = [
  'bibenglow_bookings',
  'bibenglow_bookings_v2',
  'bibenglow_bookings_new',
  'beautysalontest_bookings',
  'beautysalontest_unique',
  'beautysalontest_v3',
  'beautysalontest_final_separate'
];
allKeys.forEach(key => localStorage.removeItem(key));

console.log('✅ ВСЕ СТАРЫЕ КЛЮЧИ УДАЛЕНЫ');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
