import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot desde react-dom en lugar de ReactDOM
import Routes from './routes/Routes';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';

createRoot(document.getElementById('root')).render( // Utiliza createRoot en lugar de ReactDOM.render
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

reportWebVitals();
