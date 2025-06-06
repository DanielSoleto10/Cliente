// components/OrderFlow/FlavorSelection.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Flavor, Category } from '../../services/orderService';

interface FlavorSelectionProps {
  flavors: Flavor[];
  categories: Category[];
  selectedFlavors: string[];
  onAddFlavor: (flavorId: string) => void;
  onRemoveFlavor: (flavorId: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
}

const FlavorSelection: React.FC<FlavorSelectionProps> = ({
  flavors,
  categories,
  selectedFlavors,
  onAddFlavor,
  onRemoveFlavor,
  onNext,
  onBack,
  currentStep
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filteredFlavors, setFilteredFlavors] = useState<Flavor[]>([]);

  const stepTitles = ['', 'Selecciona tu paquete', 'Selecciona tus sabores', 'Grado de dulce', 'Tipo de machucado', 'Resumen del pedido', 'Finaliza tu pedido'];

  // Filtrar sabores por categoría
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredFlavors(flavors);
    } else {
      setFilteredFlavors(flavors.filter(flavor => flavor.category_id === activeCategory));
    }
  }, [activeCategory, flavors]);

  const getFlavorName = (flavorId: string) => {
    const flavor = flavors.find(f => f.id === flavorId);
    return flavor ? flavor.name : '';
  };

  return (
    <div className="card">
      <div className="flex mb-4">
        <button onClick={onBack} className="back-button-styled">
          <ChevronLeft size={20} />
        </button>
        <h2 className="title" style={{ marginLeft: '8px' }}>{stepTitles[currentStep]}</h2>
      </div>
      <div className="progress-text mb-4">Paso {currentStep} de 6</div>

      {/* Tabs de categorías */}
      <div className="category-tabs">
        <button
          className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <p className="subtitle">Puedes elegir hasta 4 sabores</p>

      <div className="flavors-grid">
        {filteredFlavors.map((flavor) => (
          <div
            key={flavor.id}
            className={`flavor-item ${selectedFlavors.includes(flavor.id) ? 'selected' : ''}`}
          >
            <span className="flavor-name">{flavor.name}</span>

            {selectedFlavors.includes(flavor.id) ? (
              <button
                className="remove-button"
                onClick={() => onRemoveFlavor(flavor.id)}
              >
                <X size={16} />
              </button>
            ) : (
              <button
                className="add-button"
                onClick={() => onAddFlavor(flavor.id)}
                disabled={selectedFlavors.length >= 4}
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="selected-flavors">
        <h3 className="mb-2 font-medium">Sabores seleccionados:</h3>

        {selectedFlavors.length === 0 ? (
          <p className="text-gray-500 italic">Ningún sabor seleccionado</p>
        ) : (
          <div className="flex flex-wrap">
            {selectedFlavors.map((flavorId) => (
              <span key={flavorId} className="flavor-tag">
                {getFlavorName(flavorId)}
                <button
                  className="tag-remove"
                  onClick={() => onRemoveFlavor(flavorId)}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        className="button"
        disabled={selectedFlavors.length === 0}
        onClick={onNext}
      >
        Siguiente
        <ChevronRight size={20} className="ml-1" />
      </button>
    </div>
  );
};

export default FlavorSelection;