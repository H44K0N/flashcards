import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Signup from './pages/Signup'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

