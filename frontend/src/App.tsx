import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderFlow from './pages/OrderFlow';
import Confirmation from './pages/Confirmation';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app-container">
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