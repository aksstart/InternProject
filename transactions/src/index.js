// src/index.js

import React from 'react';
import './index.css';
import App from './App';
import axios from 'axios';
import  ReactDOM from 'react-dom/client'

axios.defaults.baseURL = 'https://internproject-uz3x.onrender.com'; // Replace with your backend server URL

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  
);

