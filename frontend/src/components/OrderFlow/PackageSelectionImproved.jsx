// src/components/OrderFlow/PackageSelectionImproved.jsx
import React from "react";
import { ChevronRight } from "lucide-react";

function PackageSelection({ packages, selectedPackage, onSelect, onNext }) {
  return (
    <div className="card">
      <h2 className="title">Selecciona tu paquete</h2>
      <p className="subtitle">Elige el tamaño que mejor se adapte a tus necesidades</p>

      <div className="flex justify-center mb-6">
        <img src="/assets/images/coca-bag.png" alt="Bolsa de coca" className="package-image" />
      </div>

      <div className="package-grid">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`package-item ${selectedPackage === pkg.id ? 'selected' : ''}`}
            onClick={() => onSelect(pkg.id)}
          >
            <div className="package-weight">{pkg.weight}</div>
            <div className="package-price">{pkg.price}</div>
          </div>
        ))}
      </div>

      <button
        className="button"
        disabled={!selectedPackage}
        onClick={onNext}
      >
        Siguiente
        <ChevronRight className="ml-1" size={20} />
      </button>

      <style jsx>{`
        .package-image {
          height: 150px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}

export default PackageSelection;