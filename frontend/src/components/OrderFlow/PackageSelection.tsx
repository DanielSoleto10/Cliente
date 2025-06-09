// components/OrderFlow/PackageSelection.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Package } from '../../services/orderService';

interface PackageSelectionProps {
  packages: Package[];
  selectedPackage: string;
  onSelect: (packageId: string) => void;
  onNext: () => void;
  currentStep: number;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({
  packages,
  selectedPackage,
  onSelect,
  onNext,
  currentStep
}) => {
  const stepTitles = ['', 'Selecciona tu paquete', 'Selecciona tus sabores', 'Grado de dulce', 'Tipo de machucado', 'Resumen del pedido', 'Finaliza tu pedido'];

  // Ordenar paquetes de menor a mayor precio
  const sortedPackages = [...packages].sort((a, b) => a.price - b.price);

  return (
    <div className="card">
      <h2 className="title">{stepTitles[currentStep]}</h2>
      <div className="progress-text mb-4">Paso {currentStep} de 6</div>

      {/* Logo extra grande */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem'
      }}>
        <img
          src="/images/logo.png"
          alt="Logo Tía Coca"
          onLoad={() => console.log('✅ Logo cargado correctamente')}
          onError={(e) => console.log('❌ Error cargando logo:', e)}
          style={{
            width: '320px',
            height: 'auto',
            maxHeight: '200px',
            objectFit: 'contain',
            display: 'block',
            marginBottom: '1rem'
          }}
        />
      </div>

      <div className="package-grid">
        {sortedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`package-item ${selectedPackage === pkg.id ? 'selected' : ''}`}
            onClick={() => onSelect(pkg.id)}
          >
            <div className="package-name">{pkg.name}</div>
            <div className="package-weight">{pkg.weight} {pkg.weight_unit}</div>
            <div className="package-price">{pkg.price} Bs</div>
          </div>
        ))}
      </div>

      <button
        className="button"
        disabled={!selectedPackage}
        onClick={onNext}
      >
        Siguiente
        <ChevronRight size={20} className="ml-1" />
      </button>
    </div>
  );
};

export default PackageSelection;