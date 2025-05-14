// frontend/src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-green-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/" 
          className="bg-green-600 text-white py-2 px-6 rounded-lg inline-block hover:bg-green-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;