// frontend/src/components/OrderFlow/CrushTypeSelection.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CrushTypeSelectionProps {
  selectedCrushType: string;
  onSelect: (crushType: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const CrushTypeSelection: React.FC<CrushTypeSelectionProps> = ({
  selectedCrushType,
  onSelect,
  onNext,
  onBack
}) => {
  return (
    <div className="crush-type-selection">
      <div className="step-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft className="button-icon" />
        </button>
        <h2 className="step-title">Tipo de machucado</h2>
      </div>
      
      <div className="crush-type-options">
        <div
          className={`option-item ${selectedCrushType === 'EXTREMO' ? 'selected' : ''}`}
          onClick={() => onSelect('EXTREMO')}
        >
          <div className="option-content">
            <div className={`option-radio ${selectedCrushType === 'EXTREMO' ? 'checked' : ''}`}></div>
            <div>
              <span className="option-label">MACHUCADO EXTREMO</span>
              <p className="option-description">
                Hojas completamente machucadas para una liberación máxima de sabor.
              </p>
            </div>
          </div>
        </div>
        
        <div
          className={`option-item ${selectedCrushType === 'LIGERO' ? 'selected' : ''}`}
          onClick={() => onSelect('LIGERO')}
        >
          <div className="option-content">
            <div className={`option-radio ${selectedCrushType === 'LIGERO' ? 'checked' : ''}`}></div>
            <div>
              <span className="option-label">MACHUCADO LIGERO</span>
              <p className="option-description">
                Hojas ligeramente machucadas para preservar la textura original.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <button
        className="next-button"
        disabled={!selectedCrushType}
        onClick={onNext}
      >
        Siguiente <ChevronRight className="button-icon" />
      </button>
    </div>
  );
};

export default CrushTypeSelection;