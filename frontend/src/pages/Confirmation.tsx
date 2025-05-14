// frontend/src/pages/Confirmation.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;
  
  // If no order data, redirect to home after 2 seconds
  useEffect(() => {
    if (!orderData) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [orderData, navigate]);
  
  // Return to home
  const handleReturn = () => {
    navigate('/', { replace: true });
  };
  
  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-green-200">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No hay información de pedido disponible.</p>
          <p className="text-gray-600">Redirigiendo a la página principal...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-100 to-green-200">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Pedido Confirmado!</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Tu pedido ha sido registrado con éxito.
          </p>
          <p className="text-gray-600">
            Número de pedido: <span className="font-semibold">{orderData.orderID}</span>
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <h2 className="font-semibold text-green-800 mb-2">Información importante</h2>
          <p className="text-green-700 text-sm">
            Tu pedido estará listo en aproximadamente 5 minutos. Puedes venir a recogerlo presentando tu nombre o número de pedido.
          </p>
        </div>
        
        <button
          onClick={handleReturn}
          className="bg-green-600 text-white py-2 px-6 rounded-lg inline-block hover:bg-green-700 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Confirmation;