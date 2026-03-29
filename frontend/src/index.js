import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Enterprise Legacy Mapper - React Entry Point
 * This file bootstraps the application.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);