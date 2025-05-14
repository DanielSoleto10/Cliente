// frontend/src/components/OrderFlow/FlavorSelection.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface Flavor {
  id: string;
  name: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

interface FlavorSelectionProps {
  flavors: Flavor[];
  categories: Category[];
  selectedFlavors: string[];
  onAddFlavor: (flavorId: string) => void;
  onRemoveFlavor: (flavorId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const FlavorSelection: React.FC<FlavorSelectionProps> = ({
  flavors,
  categories,
  selectedFlavors,
  onAddFlavor,
  onRemoveFlavor,
  onNext,
  onBack
}) => {
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  
  // Filter flavors by category
  const filteredFlavors = activeCategory === 'all' 
    ? flavors 
    : flavors.filter(flavor => flavor.category_id === activeCategory);
  
  // Get flavor name by ID
  const getFlavorName = (flavorId: string) => {
    const flavor = flavors.find(f => f.id === flavorId);
    return flavor ? flavor.name : '';
  };

  return (
    <div className="flavor-selection">
      <div className="step-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft className="button-icon" />
        </button>
        <h2 className="step-title">Selecciona tus sabores</h2>
      </div>
      
      {/* Category tabs */}
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
      
      {/* Flavor selection guide */}
      <p className="selection-guide">Puedes elegir hasta 4 sabores</p>
      
      {/* Flavors grid */}
      <div className="flavors-grid">
        {filteredFlavors.map(flavor => (
          <div 
            key={flavor.id}
            className={`flavor-item ${selectedFlavors.includes(flavor.id) ? 'selected' : ''}`}
          >
            <span className="flavor-name">{flavor.name}</span>
            
            {selectedFlavors.includes(flavor.id) ? (
              <button 
                className="remove-flavor-button"
                onClick={() => onRemoveFlavor(flavor.id)}
              >
                <X className="button-icon small" />
              </button>
            ) : (
              <button 
                className="add-flavor-button"
                onClick={() => onAddFlavor(flavor.id)}
                disabled={selectedFlavors.length >= 4}
              >
                <Plus className="button-icon small" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Selected flavors */}
      <div className="selected-flavors-section">
        <h3 className="section-title">Sabores seleccionados:</h3>
        
        {selectedFlavors.length === 0 ? (
          <p className="empty-selection">Ningún sabor seleccionado</p>
        ) : (
          <div className="selected-flavors-list">
            {selectedFlavors.map(flavorId => (
              <div key={flavorId} className="selected-flavor-tag">
                {getFlavorName(flavorId)}
                <button 
                  className="remove-tag-button"
                  onClick={() => onRemoveFlavor(flavorId)}
                >
                  <X className="button-icon extra-small" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button
        className="next-button"
        disabled={selectedFlavors.length === 0}
        onClick={onNext}
      >
        Siguiente <ChevronRight className="button-icon" />
      </button>
    </div>
  );
};

export default FlavorSelection;