import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';
import { SessionProvider } from './Components/SessionProvider';
import keys from '../keys.json'

import NavBar from './Components/NavBar';
import Home from './Sites/Home';
import Create from './Sites/Create';
import VisitMap from './Sites/VisitMap';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={keys.GoogleClientID}>
    <SessionProvider>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/crearLocalizacion" element={<Create/>} />
          <Route path='/visitMap' element={<VisitMap/>} />
        </Routes>
      </Router>
    </SessionProvider>
  </GoogleOAuthProvider>
)