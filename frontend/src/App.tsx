// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderFlow from './pages/OrderFlow';
import Confirmation from './pages/Confirmation';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<OrderFlow />} />
          <Route path="/confirmacion" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;