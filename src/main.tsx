import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Удаляем все возможные ключи, чтобы старые записи не мешали
const allKeys = [
  'bibenglow_bookings',
  'bibenglow_bookings_v2',
  'beautysalontest_bookings',
  'default_bookings'
];
allKeys.forEach(key => localStorage.removeItem(key));

console.log('🧹 Все старые ключи удалены при загрузке нового сайта');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
