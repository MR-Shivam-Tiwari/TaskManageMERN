import React from 'react';
import ReactDOM from 'react-dom/client';
// src/index.js or App.js

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


