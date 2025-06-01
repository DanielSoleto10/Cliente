// frontend/src/pages/OrderFlow.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from 'lucide-react';
import { orderService, Package, Category, Flavor, CrushedType } from '../services/orderService';

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
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');

  // Estados de UI
  const [orderComplete, setOrderComplete] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploadingProof, setUploadingProof] = useState(false);

  // Datos de la aplicación
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [crushedTypes, setCrushedTypes] = useState<CrushedType[]>([]);
  const [filteredFlavors, setFilteredFlavors] = useState<Flavor[]>([]);

  // Títulos de pasos
  const stepTitles = [
    '',
    'Selecciona tu paquete',
    'Selecciona tus sabores',
    'Grado de dulce',
    'Tipo de machucado',
    'Resumen del pedido',
    'Finaliza tu pedido'
  ];

  // Cargar datos iniciales desde la API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        // Cargar datos en paralelo
        const [packagesData, categoriesData, flavorsData, crushedTypesData] = await Promise.all([
          orderService.getPackages(),
          orderService.getCategories(),
          orderService.getFlavors(),
          orderService.getCrushedTypes()
        ]);

        setPackages(packagesData);
        setCategories(categoriesData);
        setFlavors(flavorsData);
        setCrushedTypes(crushedTypesData);
        setFilteredFlavors(flavorsData);

      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Error al cargar los datos. Por favor, recarga la página.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProof(file);

      // Subir archivo inmediatamente
      setUploadingProof(true);
      setError(null);

      try {
        const url = await orderService.uploadPaymentProof(file);
        setPaymentProofUrl(url);
      } catch (error) {
        console.error('Error uploading proof:', error);
        setError('Error al subir el comprobante. Inténtalo de nuevo.');
        setPaymentProof(null);
        setPaymentProofUrl('');
      } finally {
        setUploadingProof(false);
      }
    }
  };

  // Handler de envío de pedido
  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !paymentProofUrl) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear el formato de sabores como string separado por comas
      const flavorNames = selectedFlavors.map(id => getFlavorName(id));

      const orderData = {
        customerName: customerName.trim(),
        packageInfo: getPackageDetails(selectedPackage),
        flavorIds: flavorNames,
        sweetness,
        crushedType: getCrushedTypeName(crushedType),
        paymentProofUrl
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        setOrderComplete(true);
      } else {
        setError(response.message || 'Error al crear el pedido');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setError('Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
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
    setPaymentProofUrl('');
    setOrderComplete(false);
    setError(null);
  };

  // Helpers
  const getPackageDetails = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? `${pkg.name} - ${pkg.price} Bs - ${pkg.weight} ${pkg.weight_unit}` : '';
  };

  const getFlavorName = (flavorId: string) => {
    const flavor = flavors.find(f => f.id === flavorId);
    return flavor ? flavor.name : '';
  };

  const getCrushedTypeName = (crushedTypeId: string) => {
    const crushedTypeObj = crushedTypes.find(ct => ct.id === crushedTypeId);
    return crushedTypeObj ? crushedTypeObj.name : '';
  };

  const getSelectedPackagePrice = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    return pkg ? pkg.price : 0;
  };

  // Pantalla de carga inicial
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Indicador de progreso */}
      <div className="progress-bar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(currentStep / 6) * 100}%` }}></div>
        </div>
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
          <h2 className="title">{stepTitles[currentStep]}</h2>
          <div className="progress-text mb-4">Paso {currentStep} de 6</div>

          {/* Logo extra grande sin contenedor */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem'
          }}>
            {/* Logo más grande */}
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
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-item ${selectedPackage === pkg.id ? 'selected' : ''}`}
                onClick={() => handlePackageSelect(pkg.id)}
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
            <h2 className="title" style={{ marginLeft: '-24px' }}>{stepTitles[currentStep]}</h2>
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
            <h2 className="title" style={{ marginLeft: '-24px' }}>{stepTitles[currentStep]}</h2>
          </div>
          <div className="progress-text mb-4">Paso {currentStep} de 6</div>

          <div className="flex flex-col gap-4 mb-6">
            {['FUERTE', 'MEDIO', 'SUAVE'].map((level) => (
              <div
                key={level}
                className={`sweetness-option ${sweetness === level ? 'selected' : ''}`}
                onClick={() => handleSweetnessSelect(level)}
              >
                <div className="flex items-center">
                  <div
                    className={`option-radio ${sweetness === level ? 'checked' : ''}`}
                  >
                    {sweetness === level && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium ml-3">{level}</span>
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
            <h2 className="title" style={{ marginLeft: '-24px' }}>{stepTitles[currentStep]}</h2>
          </div>
          <div className="progress-text mb-4">Paso {currentStep} de 6</div>

          <div className="flex flex-col gap-4 mb-6">
            {crushedTypes.map((type) => (
              <div
                key={type.id}
                className={`crushed-option ${crushedType === type.id ? 'selected' : ''}`}
                onClick={() => handleCrushTypeSelect(type.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`option-checkbox ${crushedType === type.id ? 'checked' : ''}`}
                  >
                    {crushedType === type.id && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
            <h2 className="title" style={{ marginLeft: '-24px' }}>{stepTitles[currentStep]}</h2>
          </div>
          <div className="progress-text mb-4">Paso {currentStep} de 6</div>

          <div className="order-summary">
            <div className="summary-section">
              <h3 className="summary-label">Paquete seleccionado</h3>
              <div className="summary-highlight">
                <p className="font-semibold text-lg">{getPackageDetails(selectedPackage)}</p>
              </div>
            </div>

            <div className="summary-section">
              <h3 className="summary-label">Sabores elegidos</h3>
              <div className="summary-tags">
                {selectedFlavors.map((flavorId) => (
                  <span key={flavorId} className="summary-tag-highlight">
                    {getFlavorName(flavorId)}
                  </span>
                ))}
              </div>
            </div>

            <div className="summary-section">
              <h3 className="summary-label">Grado de dulce</h3>
              <div className="summary-highlight">
                <p className="font-medium">{sweetness}</p>
              </div>
            </div>

            <div className="summary-section">
              <h3 className="summary-label">Tipo de machucado</h3>
              <div className="summary-highlight">
                <p className="font-medium">{getCrushedTypeName(crushedType)}</p>
              </div>
            </div>

            <div className="summary-section-total">
              <h3 className="summary-label">Total a pagar</h3>
              <div className="total-highlight">
                <p className="text-2xl font-bold text-primary">{getSelectedPackagePrice()} Bs</p>
              </div>
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
              Continuar al pago
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
            <h2 className="title" style={{ marginLeft: '-24px' }}>{stepTitles[currentStep]}</h2>
          </div>
          <div className="progress-text mb-4">Paso {currentStep} de 6</div>

          <div className="bg-primary-light p-4 rounded-lg mb-6">
            <div className="text-center">
              <h3 className="font-bold text-primary mb-2">Total a pagar</h3>
              <p className="text-2xl font-bold text-primary">{getSelectedPackagePrice()} Bs</p>
            </div>
          </div>

          {/* QR extra grande sin contenedor */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem'
          }}>
            {/* QR más grande */}
            <img
              src="/images/qr_code.png"
              alt="Código QR"
              style={{
                width: '320px',
                height: '320px',
                objectFit: 'contain',
                display: 'block',
                marginBottom: '1.5rem'
              }}
            />

            {/* Texto debajo */}
            <p style={{
              textAlign: 'center',
              color: '#374151',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '8px',
              lineHeight: '1.4',
              maxWidth: '320px'
            }}>
              Escanea el código QR para realizar el pago
            </p>

            
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de quien recogerá el pedido *
            </label>
            <input
              type="text"
              className="input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprobante de pago *
            </label>
            <div 
  style={{
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#fafafa'
  }}
  onClick={() => document.getElementById('payment-proof')?.click()}
>
  <input 
    id="payment-proof" 
    type="file" 
    accept="image/*"
    onChange={handleFileChange}
    style={{ display: 'none' }}
    required
  />
  
  {uploadingProof ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Loader2 style={{ height: '32px', width: '32px', color: '#16a34a', marginBottom: '8px' }} className="animate-spin" />
      <span style={{ fontSize: '14px', color: '#16a34a' }}>Subiendo comprobante...</span>
    </div>
  ) : paymentProof && paymentProofUrl ? (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img 
        src={URL.createObjectURL(paymentProof)} 
        alt="Vista previa" 
        style={{
          maxHeight: '120px',
          objectFit: 'contain',
          marginBottom: '8px',
          borderRadius: '8px'
        }}
      />
      <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: '500' }}>✓ Comprobante subido correctamente</span>
      <span style={{ fontSize: '12px', color: '#6b7280' }}>Haz clic para cambiar</span>
    </div>
  ) : (
    <>
      {/* Ícono + más pequeño */}
      <div style={{
        width: '60px',
        height: '60px',
        backgroundColor: '#ecfdf5',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <svg 
          style={{ width: '24px', height: '24px', color: '#16a34a' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span style={{ 
        color: '#16a34a', 
        fontWeight: '500',
        fontSize: '16px',
        display: 'block',
        marginBottom: '8px'
      }}>
        Subir comprobante de pago
      </span>
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        margin: '0'
      }}>
        Formatos aceptados: JPG, PNG (máx. 5MB)
      </p>
    </>
  )}
</div>
          </div>

          <button
            className="button w-full"
            disabled={loading || !customerName.trim() || !paymentProofUrl || uploadingProof}
            onClick={handleSubmitOrder}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Procesando pedido...
              </>
            ) : (
              'Finalizar pedido'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            © 2025 Tía Coca. Todos los derechos reservados.
          </p>
        </div>
      )}

      {/* Modal de confirmación */}
      {orderComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mb-2 text-green-800">¡Pedido realizado!</h2>

            <p className="text-gray-600 mb-4">
              Tu pedido ha sido enviado exitosamente y está siendo preparado.
            </p>

            <div className="bg-gray-50 p-3 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Tiempo estimado de preparación:</p>
              <p className="font-bold text-primary">5-10 minutos</p>
            </div>

            <button
              className="button w-full"
              onClick={handleOrderComplete}
            >
              Hacer otro pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFlow;