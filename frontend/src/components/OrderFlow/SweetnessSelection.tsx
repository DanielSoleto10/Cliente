// frontend/src/components/OrderFlow/SweetnessSelection.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SweetnessSelectionProps {
  selectedSweetness: string;
  onSelect: (sweetness: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const SweetnessSelection: React.FC<SweetnessSelectionProps> = ({
  selectedSweetness,
  onSelect,
  onNext,
  onBack
}) => {
  return (
    <div className="sweetness-selection">
      <div className="step-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft className="button-icon" />
        </button>
        <h2 className="step-title">Grado de dulce</h2>
      </div>
      
      <div className="sweetness-options">
        {['FUERTE', 'MEDIO', 'SUAVE'].map((level) => (
          <div 
            key={level}
            className={`option-item ${selectedSweetness === level ? 'selected' : ''}`}
            onClick={() => onSelect(level)}
          >
            <div className="option-content">
              <div className={`option-radio ${selectedSweetness === level ? 'checked' : ''}`}></div>
              <span className="option-label">{level}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button
        className="next-button"
        disabled={!selectedSweetness}
        onClick={onNext}
      >
        Siguiente <ChevronRight className="button-icon" />
      </button>
    </div>
  );
};

export default SweetnessSelection;