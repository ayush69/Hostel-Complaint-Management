import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'react-hot-toast';
import './styles.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><App/><Toaster position="top-right"/></BrowserRouter>);
