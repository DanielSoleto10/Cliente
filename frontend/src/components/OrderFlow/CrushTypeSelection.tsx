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

      <div className="flex flex-col gap-4 mb-6">
        {crushedTypes.map((type) => (
          <div
            key={type.id}
            className={`crushed-option ${selectedCrushType === type.id ? 'selected' : ''}`}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex items-start">
              <div
                className={`option-checkbox ${selectedCrushType === type.id ? 'checked' : ''}`}
              >
                {selectedCrushType === type.id && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-bold">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="button"
        disabled={!selectedCrushType}
        onClick={onNext}
      >
        Siguiente
        <ChevronRight size={20} className="ml-1" />
      </button>
    </div>
  );
};

export default CrushTypeSelection;