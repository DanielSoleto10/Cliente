// components/OrderFlow/SweetnessSelection.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SweetnessSelectionProps {
  selectedSweetness: string;
  onSelect: (sweetness: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

const SweetnessSelection: React.FC<SweetnessSelectionProps> = ({
  selectedSweetness,
  onSelect,
  onNext,
  onBack,
  currentStep
}) => {
  const stepTitles = ['', 'Selecciona tu paquete', 'Selecciona tus sabores', 'Grado de dulce', 'Tipo de machucado', 'Resumen del pedido', 'Finaliza tu pedido'];

  const sweetnessLevels = ['FUERTE', 'MEDIO', 'SUAVE'];

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
        {sweetnessLevels.map((level) => (
          <div
            key={level}
            className={`sweetness-option ${selectedSweetness === level ? 'selected' : ''}`}
            onClick={() => onSelect(level)}
          >
            <div className="flex items-center">
              <div
                className={`option-radio ${selectedSweetness === level ? 'checked' : ''}`}
              >
                {selectedSweetness === level && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium ml-3">{level}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="button"
        disabled={!selectedSweetness}
        onClick={onNext}
      >
        Siguiente
        <ChevronRight size={20} className="ml-1" />
      </button>
    </div>
  );
};

export default SweetnessSelection;