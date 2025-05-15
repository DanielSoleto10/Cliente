import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderFlow from './pages/OrderFlow';
import Confirmation from './pages/Confirmation';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <img src="/assets/images/logo.png" alt="Coca Premium" className="app-logo" />
          <h1 className="app-title">Coca Premium</h1>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<OrderFlow />} />
            <Route path="/confirmacion" element={<Confirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;