// frontend/src/components/OrderFlow/PackageSelection.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Package {
  id: string;
  price: string;
  weight: string;
}

interface PackageSelectionProps {
  packages: Package[];
  selectedPackage: string;
  onSelect: (packageId: string) => void;
  onNext: () => void;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({ 
  packages, 
  selectedPackage, 
  onSelect, 
  onNext 
}) => {
  return (
    <div className="package-selection">
      <h2 className="step-title">Selecciona tu paquete</h2>
      
      <div className="package-image-container">
        <img src="/assets/images/coca-bag.png" alt="Bolsa de coca" className="package-image" />
      </div>
      
      <div className="packages-list">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`package-item ${selectedPackage === pkg.id ? 'selected' : ''}`}
            onClick={() => onSelect(pkg.id)}
          >
            <div className="package-details">
              <span className="package-weight">{pkg.weight}</span>
              <span className="package-price">{pkg.price}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button
        className="next-button"
        disabled={!selectedPackage}
        onClick={onNext}
      >
        Siguiente <ChevronRight className="button-icon" />
      </button>
    </div>
  );
};

export default PackageSelection;