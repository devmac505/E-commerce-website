import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './assets/styles.css';
import './assets/admin-styles.css';

// Create root element for React
const root = createRoot(document.getElementById('root'));

// Render the App component inside BrowserRouter
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
