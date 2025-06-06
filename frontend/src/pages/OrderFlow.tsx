// pages/OrderFlow.tsx - Componente principal refactorizado
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { orderService, Package, Category, Flavor, CrushedType } from '../services/orderService';

// Importar componentes
import PackageSelection from '../components/OrderFlow/PackageSelection';
import FlavorSelection from '../components/OrderFlow/FlavorSelection';
import SweetnessSelection from '../components/OrderFlow/SweetnessSelection';
import CrushTypeSelection from '../components/OrderFlow/CrushTypeSelection';
import OrderSummary from '../components/OrderFlow/OrderSummary';
import PaymentProof from '../components/OrderFlow/PaymentProof';

const OrderFlow: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado de navegación
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado del pedido
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState<string>('');
  const [crushedType, setCrushedType] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [uploadingProof, setUploadingProof] = useState(false);

  // Datos de la aplicación
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [crushedTypes, setCrushedTypes] = useState<CrushedType[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

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
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Error al cargar los datos. Por favor, recarga la página.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handlers de navegación
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
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

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };

  // Manejo de archivo de pago
  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    setPaymentProof(file);
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
  };

  // Envío de pedido
  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !paymentProofUrl) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
        // Extraer ID real del backend y convertirlo al mismo formato que usa el admin
        const backendId = response.data?.id;
        const formattedOrderId = backendId ? `#${backendId.slice(0, 8)}` : `#${Math.random().toString(36).substr(2, 8)}`;
        
        // Navegar a página de confirmación con datos del pedido
        navigate('/confirmacion', {
          state: {
            orderData: {
              orderID: formattedOrderId,
              backendId: backendId, // Guardamos también el ID completo por si acaso
              customerName: customerName.trim(),
              packageDetails: getPackageDetails(selectedPackage),
              flavors: flavorNames,
              sweetness,
              crushedType: getCrushedTypeName(crushedType),
              totalPrice: getSelectedPackagePrice(),
              estimatedTime: '5-10 minutos'
            }
          },
          replace: true
        });
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

      {/* Mensaje de error global */}
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
              <span className="text-red-700">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Renderizado condicional de pasos */}
      {currentStep === 1 && (
        <PackageSelection
          packages={packages}
          selectedPackage={selectedPackage}
          onSelect={handlePackageSelect}
          onNext={handleNext}
          currentStep={currentStep}
        />
      )}

      {currentStep === 2 && (
        <FlavorSelection
          flavors={flavors}
          categories={categories}
          selectedFlavors={selectedFlavors}
          onAddFlavor={handleAddFlavor}
          onRemoveFlavor={handleRemoveFlavor}
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
        />
      )}

      {currentStep === 3 && (
        <SweetnessSelection
          selectedSweetness={sweetness}
          onSelect={handleSweetnessSelect}
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
        />
      )}

      {currentStep === 4 && (
        <CrushTypeSelection
          crushedTypes={crushedTypes}
          selectedCrushType={crushedType}
          onSelect={handleCrushTypeSelect}
          onNext={handleNext}
          onBack={handleBack}
          currentStep={currentStep}
        />
      )}

      {currentStep === 5 && (
        <OrderSummary
          packageDetails={getPackageDetails(selectedPackage)}
          flavorNames={selectedFlavors.map(id => getFlavorName(id))}
          sweetness={sweetness}
          crushedType={getCrushedTypeName(crushedType)}
          totalPrice={getSelectedPackagePrice()}
          onNext={handleNext}
          onBack={handleBack}
          onModify={goToStep}
          currentStep={currentStep}
        />
      )}

      {currentStep === 6 && (
        <PaymentProof
          customerName={customerName}
          onCustomerNameChange={handleCustomerNameChange}
          paymentProof={paymentProof}
          paymentProofUrl={paymentProofUrl}
          onFileChange={handleFileChange}
          onSubmit={handleSubmitOrder}
          onBack={handleBack}
          loading={loading}
          uploadingProof={uploadingProof}
          totalPrice={getSelectedPackagePrice()}
          currentStep={currentStep}
        />
      )}
    </div>
  );
};

export default OrderFlow;