// frontend/src/components/ui/ProgressIndicator.tsx
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="progress-indicator">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progress-text">
        Paso {currentStep} de {totalSteps}
      </div>
    </div>
  );
};

export default ProgressIndicator;