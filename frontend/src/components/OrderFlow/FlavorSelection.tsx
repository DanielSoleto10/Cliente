// components/OrderFlow/FlavorSelection.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Search } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState<string>('');

  const stepTitles = ['', 'Selecciona tu paquete', 'Selecciona tus sabores', 'Grado de dulce', 'Tipo de machucado', 'Resumen del pedido', 'Finaliza tu pedido'];

  // Filtrar y ordenar sabores por categoría y búsqueda
  useEffect(() => {
    let filtered: Flavor[];
    
    if (activeCategory === 'all') {
      filtered = [...flavors];
    } else {
      filtered = flavors.filter(flavor => flavor.category_id === activeCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(flavor => 
        flavor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenar alfabéticamente por nombre
    const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredFlavors(sorted);
  }, [activeCategory, flavors, searchTerm]);

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

      {/* Barra de búsqueda con estilo de la app */}
      <div className="mb-4">
        <div className="flavor-item" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          marginBottom: '8px'
        }}>
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar sabor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              fontWeight: '500',
              color: '#333'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                marginLeft: '8px',
                padding: '4px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#dc3545',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: '24px',
                height: '24px'
              }}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        {searchTerm && filteredFlavors.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '16px',
            color: '#6c757d',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            No se encontró "{searchTerm}"
          </div>
        )}
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