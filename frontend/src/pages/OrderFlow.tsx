// src/pages/OrderFlow.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from 'lucide-react';

// Definir tipos
interface Package {
  id: string;
  price: string;
  weight: string;
}

interface Category {
  id: string;
  name: string;
}

interface Flavor {
  id: string;
  name: string;
  category_id: string;
}

// Componente principal
const OrderFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Datos del pedido
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState<string>('');
  const [crushedType, setCrushedType] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  
  // Estados de UI
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Datos de la aplicación
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [filteredFlavors, setFilteredFlavors] = useState<Flavor[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Datos de ejemplo
      setPackages([
        { id: 'pkg1', price: '10 Bs', weight: '45 g' },
        { id: 'pkg2', price: '12 Bs', weight: '60 g' },
        { id: 'pkg3', price: '15 Bs', weight: '75 g' },
        { id: 'pkg4', price: '20 Bs', weight: '100 g' },
        { id: 'pkg5', price: '30 Bs', weight: '150 g' },
      ]);
      
      setCategories([
        { id: 'cat1', name: 'NATURALES' },
        { id: 'cat2', name: 'ENERGIZANTES' },
        { id: 'cat3', name: 'EXÓTICOS' },
      ]);
      
      const mockFlavors = [
        { id: 'flv1', name: 'Maracuyá', category_id: 'cat1' },
        { id: 'flv2', name: 'Limón', category_id: 'cat1' },
        { id: 'flv3', name: 'Kiwi', category_id: 'cat1' },
        { id: 'flv4', name: 'Menta', category_id: 'cat1' },
        { id: 'flv5', name: 'Red Bull', category_id: 'cat2' },
        { id: 'flv6', name: 'Monster', category_id: 'cat2' },
        { id: 'flv7', name: 'Café', category_id: 'cat2' },
        { id: 'flv8', name: 'Chocolate', category_id: 'cat3' },
        { id: 'flv9', name: 'Ron con Cola', category_id: 'cat3' },
        { id: 'flv10', name: 'Wafer Frutilla', category_id: 'cat3' },
      ];
      
      setFlavors(mockFlavors);
      setFilteredFlavors(mockFlavors);
      
      setInitialLoading(false);
    }, 1000);
  }, []);

  // Filtrar sabores por categoría
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredFlavors(flavors);
    } else {
      setFilteredFlavors(flavors.filter(flavor => flavor.category_id === activeCategory));
    }
  }, [activeCategory, flavors]);
  
  // Handlers de navegación
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Handlers de selección
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };
  
  const handleAddFlavor = (flavorId: string) => {
    if (selectedFlavors.length < 4 && !selectedFlavors.includes(flavorId)) {
      setSelectedFlavors(prev => [...prev, flavorId]);
    }
  };
  
  const handleRemoveFlavor = (flavorId: string) => {
    setSelectedFlavors(prev => prev.filter(id => id !== flavorId));
  };
  
  const handleSweetnessSelect = (value: string) => {
    setSweetness(value);
  };
  
  const handleCrushTypeSelect = (value: string) => {
    setCrushedType(value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };
  
  // Handler de envío de pedido
  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !paymentProof) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simular envío de pedido
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
    }, 1500);
  };
  
  // Reset del formulario
  const handleOrderComplete = () => {
    setCurrentStep(1);
    setSelectedPackage('');
    setSelectedFlavors([]);
    setSweetness('');
    setCrushedType('');
    setCustomerName('');
    setPaymentProof(null);
    setOrderComplete(false);
  };
  
  // Helpers
  const getPackageDetails = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? `${pkg.price} - ${pkg.weight}` : '';
  };
  
  const getFlavorName = (flavorId: string) => {
    const flavor = flavors.find(f => f.id === flavorId);
    return flavor ? flavor.name : '';
  };
  
  // Pantalla de carga
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Cargando...</p>
      </div>
    );
  }
  
  return (
    <div className="container">
      {/* Indicador de progreso */}
      <div className="progress-bar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(currentStep/6)*100}%` }}></div>
        </div>
        <div className="progress-text">Paso {currentStep} de 6</div>
      </div>
      
      {/* Mensaje de error */}
      {error && (
        <div className="card" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-700">{error}</p>
            <button 
              className="ml-auto"
              onClick={() => setError(null)}
            >
              <X size={16} className="text-red-700" />
            </button>
          </div>
        </div>
      )}
      
      {/* Paso 1: Selección de paquete */}
      {currentStep === 1 && (
        <div className="card">
          <h2 className="title">Selecciona tu paquete</h2>
          
          <div className="flex justify-center mb-6">
            <img src="/assets/images/coca-bag.png" alt="Bolsa de coca" className="h-32 object-contain" />
          </div>
          
          <div className="package-grid">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`package-item ${selectedPackage === pkg.id ? 'selected' : ''}`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <div className="package-weight">{pkg.weight}</div>
                <div className="package-price">{pkg.price}</div>
              </div>
            ))}
          </div>
          
          <button
            className="button"
            disabled={!selectedPackage}
            onClick={handleNext}
          >
            Siguiente
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      )}
      
      {/* Paso 2: Selección de sabores */}
      {currentStep === 2 && (
        <div className="card">
          <div className="flex mb-4">
            <button onClick={handleBack} className="bg-transparent border-none text-primary">
              <ChevronLeft size={24} />
            </button>
            <h2 className="title" style={{ marginLeft: '-24px' }}>Selecciona tus sabores</h2>
          </div>
          
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
                    onClick={() => handleRemoveFlavor(flavor.id)}
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <button 
                    className="add-button"
                    onClick={() => handleAddFlavor(flavor.id)}
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
                      onClick={() => handleRemoveFlavor(flavorId)}
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
            onClick={handleNext}
          >
            Siguiente
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      )}
      
      {/* Paso 3: Selección de dulzura */}
      {currentStep === 3 && (
        <div className="card">
          <div className="flex mb-4">
            <button onClick={handleBack} className="bg-transparent border-none text-primary">
              <ChevronLeft size={24} />
            </button>
            <h2 className="title" style={{ marginLeft: '-24px' }}>Grado de dulce</h2>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            {['FUERTE', 'MEDIO', 'SUAVE'].map((level) => (
              <div 
                key={level}
                className={`p-4 rounded-md border-2 ${sweetness === level ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
                onClick={() => handleSweetnessSelect(level)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${sweetness === level ? 'border-primary bg-primary' : 'border-gray-300'}`}
                  >
                    {sweetness === level && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium">{level}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button
            className="button"
            disabled={!sweetness}
            onClick={handleNext}
          >
            Siguiente
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      )}
      
      {/* Paso 4: Selección de tipo de machucado */}
      {currentStep === 4 && (
        <div className="card">
          <div className="flex mb-4">
            <button onClick={handleBack} className="bg-transparent border-none text-primary">
              <ChevronLeft size={24} />
            </button>
            <h2 className="title" style={{ marginLeft: '-24px' }}>Tipo de machucado</h2>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            <div 
              className={`p-4 rounded-md border-2 ${crushedType === 'EXTREMO' ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
              onClick={() => handleCrushTypeSelect('EXTREMO')}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-start">
                <div 
                  className={`w-5 h-5 rounded-sm mt-1 flex-shrink-0 flex items-center justify-center ${crushedType === 'EXTREMO' ? 'border-primary bg-primary' : 'border-gray-300'}`}
                  style={{ border: '2px solid' }}
                >
                  {crushedType === 'EXTREMO' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">MACHUCADO EXTREMO</h3>
                  <p className="text-sm text-gray-600">
                    Hojas completamente machucadas para una liberación máxima de sabor.
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-md border-2 ${crushedType === 'LIGERO' ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
              onClick={() => handleCrushTypeSelect('LIGERO')}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex items-start">
                <div 
                  className={`w-5 h-5 rounded-sm mt-1 flex-shrink-0 flex items-center justify-center ${crushedType === 'LIGERO' ? 'border-primary bg-primary' : 'border-gray-300'}`}
                  style={{ border: '2px solid' }}
                >
                  {crushedType === 'LIGERO' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-bold">MACHUCADO LIGERO</h3>
                  <p className="text-sm text-gray-600">
                    Hojas ligeramente machucadas para preservar la textura original.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            className="button"
            disabled={!crushedType}
            onClick={handleNext}
          >
            Siguiente
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      )}
      
      {/* Paso 5: Resumen del pedido */}
      {currentStep === 5 && (
        <div className="card">
          <div className="flex mb-4">
            <button onClick={handleBack} className="bg-transparent border-none text-primary">
              <ChevronLeft size={24} />
            </button>
            <h2 className="title" style={{ marginLeft: '-24px' }}>Resumen del pedido</h2>
          </div>
          
          <div className="divide-y">
            <div className="py-3">
              <span className="text-sm text-gray-500">Paquete</span>
              <p className="font-medium">{getPackageDetails(selectedPackage)}</p>
            </div>
            
            <div className="py-3">
              <span className="text-sm text-gray-500">Sabores</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedFlavors.map((flavorId) => (
                  <span key={flavorId} className="bg-primary-light text-primary-dark px-2 py-1 rounded-full text-xs">
                    {getFlavorName(flavorId)}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="py-3">
              <span className="text-sm text-gray-500">Grado de dulce</span>
              <p className="font-medium">{sweetness}</p>
            </div>
            
            <div className="py-3">
              <span className="text-sm text-gray-500">Tipo de machucado</span>
              <p className="font-medium">{crushedType}</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              className="button button-outline"
              onClick={handleBack}
            >
              Modificar
            </button>
            <button
              className="button"
              onClick={handleNext}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      
      {/* Paso 6: Pago */}
      {currentStep === 6 && (
        <div className="card">
          <div className="flex mb-4">
            <button onClick={handleBack} className="bg-transparent border-none text-primary">
              <ChevronLeft size={24} />
            </button>
            <h2 className="title" style={{ marginLeft: '-24px' }}>Finaliza tu pedido</h2>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <img src="/assets/images/qr-code.png" alt="Código QR" className="w-48 h-48 object-contain mb-4" />
            <p className="text-center text-gray-600 text-sm">
              Escanea el código QR para realizar el pago
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de quien recogerá el pedido
            </label>
            <input
              type="text"
              className="input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingresa tu nombre"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprobante de pago
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
              onClick={() => document.getElementById('payment-proof')?.click()}
            >
              <input 
                id="payment-proof" 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {paymentProof ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={URL.createObjectURL(paymentProof)} 
                    alt="Vista previa" 
                    className="max-h-32 object-contain mb-2"
                  />
                  <span className="text-sm text-primary">Cambiar imagen</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-primary font-medium">Subir comprobante de pago</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos aceptados: JPG, PNG
                  </p>
                </>
              )}
            </div>
          </div>
          
          <button
            className="button"
            disabled={loading || !customerName.trim() || !paymentProof}
            onClick={handleSubmitOrder}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Procesando...
              </>
            ) : (
              'Finalizar pedido'
            )}
          </button>
        </div>
      )}
      
      {/* Modal de confirmación */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold mb-2">¡Pedido realizado!</h2>
            
            <p className="text-gray-600 mb-6">
              Tu pedido está siendo preparado. Puedes venir a recogerlo en aproximadamente 5 minutos.
            </p>
            
            <button 
              className="button"
              onClick={handleOrderComplete}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFlow;