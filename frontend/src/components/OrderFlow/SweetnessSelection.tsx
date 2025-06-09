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

      {/* Opciones con separación consistente */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        marginBottom: '24px'
      } as React.CSSProperties}>
        {sweetnessLevels.map((level) => (
          <div
            key={level}
            className={`sweetness-option ${selectedSweetness === level ? 'selected' : ''}`}
            onClick={() => onSelect(level)}
          >
            <div style={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}>
              {/* Checkbox en su posición original */}
              <div
                className={`option-checkbox ${selectedSweetness === level ? 'checked' : ''}`}
              >
                {selectedSweetness === level && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              
              {/* Texto centrado en toda la caja */}
              <span 
                className="font-medium"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {level}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          className="button"
          disabled={!selectedSweetness}
          onClick={onNext}
        >
          Siguiente
          <ChevronRight size={20} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default SweetnessSelection;