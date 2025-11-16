import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create root
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
