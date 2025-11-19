import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import { ToastProvider } from './components/ToastProvider';

function App() {
  return (
    <Router>
      <ToastProvider>
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Register />} /> {/* Reusing register for demo */}
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
