// frontend/src/components/OrderFlow/OrderSummary.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderSummaryProps {
  packageDetails: string;
  flavorNames: string[];
  sweetness: string;
  crushedType: string;
  onNext: () => void;
  onBack: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageDetails,
  flavorNames,
  sweetness,
  crushedType,
  onNext,
  onBack
}) => {
  return (
    <div className="order-summary-container">
      <div className="step-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft className="button-icon" />
        </button>
        <h2 className="step-title">Resumen del pedido</h2>
      </div>
      
      <div className="order-summary">
        <div className="summary-section">
          <span className="summary-label">Paquete</span>
          <p className="summary-value">{packageDetails}</p>
        </div>
        
        <div className="summary-section">
          <span className="summary-label">Sabores</span>
          <div className="summary-tags">
            {flavorNames.map((flavor, index) => (
              <span key={index} className="summary-tag">{flavor}</span>
            ))}
          </div>
        </div>
        
        <div className="summary-section">
          <span className="summary-label">Grado de dulce</span>
          <p className="summary-value">{sweetness}</p>
        </div>
        
        <div className="summary-section">
          <span className="summary-label">Tipo de machucado</span>
          <p className="summary-value">{crushedType}</p>
        </div>
      </div>
      
      <div className="summary-buttons">
        <button
          className="modify-button"
          onClick={onBack}
        >
          Modificar
        </button>
        <button
          className="continue-button"
          onClick={onNext}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;