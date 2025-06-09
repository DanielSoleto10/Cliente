// components/OrderFlow/OrderSummary.tsx
import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface OrderSummaryProps {
  packageDetails: string;
  flavorNames: string[];
  sweetness: string;
  crushedType: string;
  totalPrice: number;
  onNext: () => void;
  onBack: () => void;
  onModify: (step: number) => void;
  currentStep: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  packageDetails,
  flavorNames,
  sweetness,
  crushedType,
  totalPrice,
  onNext,
  onBack,
  onModify,
  currentStep
}) => {
  const stepTitles = ['', 'Selecciona tu paquete', 'Selecciona tus sabores', 'Grado de dulce', 'Tipo de machucado', 'Resumen del pedido', 'Finaliza tu pedido'];

  return (
    <div className="card">
      <div className="flex mb-4">
        <button onClick={onBack} className="back-button-styled">
          <ChevronLeft size={20} />
        </button>
        <h2 className="title" style={{ marginLeft: '8px' }}>{stepTitles[currentStep]}</h2>
      </div>
      <div className="progress-text mb-4">Paso {currentStep} de 6</div>

      <div className="order-summary">
        <div className="summary-section">
          <h3 className="summary-label">Paquete seleccionado</h3>
          <div className="summary-highlight">
            <p className="font-semibold text-lg">{packageDetails}</p>
          </div>
          <button 
            className="modify-button"
            onClick={() => onModify(1)}
          >
            Modificar paquete
          </button>
        </div>

        <div className="summary-section">
          <h3 className="summary-label">Sabores elegidos</h3>
          <div className="summary-tags">
            {flavorNames.map((flavor, index) => (
              <span key={index} className="summary-tag-highlight">
                {flavor}
              </span>
            ))}
          </div>
          <button 
            className="modify-button"
            onClick={() => onModify(2)}
          >
            Modificar sabores
          </button>
        </div>

        <div className="summary-section">
          <h3 className="summary-label">Grado de dulce</h3>
          <div className="summary-highlight">
            <p className="font-medium">{sweetness}</p>
          </div>
          <button 
            className="modify-button"
            onClick={() => onModify(3)}
          >
            Modificar dulzura
          </button>
        </div>

        <div className="summary-section">
          <h3 className="summary-label">Tipo de machucado</h3>
          <div className="summary-highlight">
            <p className="font-medium">{crushedType}</p>
          </div>
          <button 
            className="modify-button"
            onClick={() => onModify(4)}
          >
            Modificar machucado
          </button>
        </div>

        <div className="summary-section-total">
          <h3 className="summary-label">Total a pagar</h3>
          <div className="total-highlight">
            <p className="text-2xl font-bold text-primary">{totalPrice} Bs</p>
          </div>
        </div>
      </div>

      {/* Botones verticales con separación consistente */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        marginTop: '24px',
        width: '100%'
      } as React.CSSProperties}>
        <button
          className="button button-outline"
          style={{ 
            width: '100%',
            marginBottom: '0',
            marginRight: '0'
          } as React.CSSProperties}
          onClick={onBack}
        >
          Regresar
        </button>
        <button
          className="button"
          style={{ 
            width: '100%',
            marginBottom: '0',
            marginRight: '0'
          } as React.CSSProperties}
          onClick={onNext}
        >
          Continuar al pago
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;