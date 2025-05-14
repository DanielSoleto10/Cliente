// frontend/src/components/OrderFlow/OrderComplete.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface OrderCompleteProps {
  onClose: () => void;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="success-icon">
          <Check size={32} />
        </div>
        <h2 className="modal-title">¡Pedido realizado!</h2>
        <p className="modal-message">
          Tu pedido está siendo preparado. Puedes venir a recogerlo en aproximadamente 5 minutos.
        </p>
        <button className="modal-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default OrderComplete;