// components/OrderFlow/OrderComplete.tsx
import React from 'react';

interface OrderCompleteProps {
  onClose: () => void;
  customerName: string;
  packageDetails: string;
  totalPrice: number;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({ 
  onClose, 
  customerName, 
  packageDetails, 
  totalPrice 
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 z-50 flex flex-col">
      {/* Header con logo */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-center">
          <img
            src="/images/logo.png"
            alt="Tía Coca"
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          
          {/* Ícono de éxito animado */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Título principal */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Pedido confirmado!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Hola <span className="font-semibold text-green-700">{customerName}</span>, 
            tu pedido está siendo preparado con mucho cariño.
          </p>

          {/* Estado del pedido */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping mr-2"></div>
              <span className="text-green-800 font-medium">Preparando tu pedido</span>
            </div>
            <p className="text-green-700 text-sm">
              Tiempo estimado: <strong>5-10 minutos</strong>
            </p>
          </div>

          {/* Detalles del pedido */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">Resumen de tu pedido</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Producto:</span>
                <span className="font-medium text-gray-800">{packageDetails.split(' - ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total pagado:</span>
                <span className="font-bold text-green-600">{totalPrice} Bs</span>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">¿Cómo recoger tu pedido?</h4>
            <p className="text-blue-700 text-sm">
              Presenta tu nombre <strong>"{customerName}"</strong> al momento de recoger tu pedido.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Hacer otro pedido
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-6 py-4">
        <p className="text-center text-xs text-gray-500">
          © 2025 Tía Coca. Gracias por tu preferencia.
        </p>
      </div>
    </div>
  );
};

export default OrderComplete;