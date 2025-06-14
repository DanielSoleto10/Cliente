// components/OrderFlow/CrushTypeSelection.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CrushedType } from '../../services/orderService';

interface CrushTypeSelectionProps {
  crushedTypes: CrushedType[];
  selectedCrushType: string;
  onSelect: (crushType: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

const CrushTypeSelection: React.FC<CrushTypeSelectionProps> = ({
  crushedTypes,
  selectedCrushType,
  onSelect,
  onNext,
  onBack,
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

      {/* Opciones con separación consistente */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        marginBottom: '24px'
      } as React.CSSProperties}>
        {crushedTypes.map((type) => (
          <div
            key={type.id}
            className={`crushed-option ${selectedCrushType === type.id ? 'selected' : ''}`}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex items-center justify-between">
              <div
                className={`option-checkbox ${selectedCrushType === type.id ? 'checked' : ''}`}
              >
                {selectedCrushType === type.id && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <div style={{ 
                flex: 1, 
                textAlign: 'center', 
                paddingLeft: '16px', 
                paddingRight: '16px' 
              }}>
                <h3 className="font-bold">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
              {/* Espacio invisible para balance */}
              <div style={{ width: '20px' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          className="button"
          disabled={!selectedCrushType}
          onClick={onNext}
        >
          Siguiente
          <ChevronRight size={20} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default CrushTypeSelection;