// frontend/src/pages/OrderFlow.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import PackageSelection from '../components/OrderFlow/PackageSelection';
import FlavorSelection from '../components/OrderFlow/FlavorSelection';
import SweetnessSelection from '../components/OrderFlow/SweetnessSelection';
import CrushTypeSelection from '../components/OrderFlow/CrushTypeSelection';
import OrderSummary from '../components/OrderFlow/OrderSummary';
import PaymentProof from '../components/OrderFlow/PaymentProof';
import OrderComplete from '../components/OrderFlow/OrderComplete';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import LoadingScreen from '../components/ui/LoadingScreen';
import ErrorMessage from '../components/ui/ErrorMessage';
import '../styles/OrderFlow.css';

// Types
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

const OrderFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Order data
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sweetness, setSweetness] = useState<string>('');
  const [crushedType, setCrushedType] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  
  // Data from API
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [orderComplete, setOrderComplete] = useState(false);

  // Load initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        
        // In a production app, these would be API calls to your backend
        // For now, we'll use mock data
        
        // Mock packages data - in production replace with API call
        setPackages([
          { id: 'pkg1', price: '10 Bs', weight: '45 g' },
          { id: 'pkg2', price: '12 Bs', weight: '60 g' },
          { id: 'pkg3', price: '15 Bs', weight: '75 g' },
          { id: 'pkg4', price: '20 Bs', weight: '100 g' },
          { id: 'pkg5', price: '30 Bs', weight: '150 g' },
        ]);
        
        // Mock categories data - in production replace with API call
        setCategories([
          { id: 'cat1', name: 'NATURALES' },
          { id: 'cat2', name: 'ENERGIZANTES' },
          { id: 'cat3', name: 'EXÓTICOS' },
        ]);
        
        // Mock flavors data - in production replace with API call
        setFlavors([
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
        ]);
        
        // In production, these would be separate API calls:
        // const { data: packagesData } = await orderService.getPackages();
        // const { data: categoriesData } = await orderService.getCategories();
        // const { data: flavorsData } = await orderService.getAllFlavors();
        
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Package selection handler
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };
  
  // Flavor selection handlers
  const handleAddFlavor = (flavorId: string) => {
    if (selectedFlavors.length < 4 && !selectedFlavors.includes(flavorId)) {
      setSelectedFlavors(prev => [...prev, flavorId]);
    }
  };
  
  const handleRemoveFlavor = (flavorId: string) => {
    setSelectedFlavors(prev => prev.filter(id => id !== flavorId));
  };
  
  // Sweetness selection handler
  const handleSweetnessSelect = (value: string) => {
    setSweetness(value);
  };
  
  // Crush type selection handler
  const handleCrushTypeSelect = (value: string) => {
    setCrushedType(value);
  };
  
  // Customer name handler
  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
  };
  
  // Payment proof handler
  const handleFileChange = (file: File | null) => {
    setPaymentProof(file);
  };
  
  // Submit order handler
  const handleSubmitOrder = async () => {
    if (!customerName.trim() || !paymentProof) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 1. Upload payment proof
      // In production, this would be an API call to upload the image
      // const { data: uploadData } = await orderService.uploadPaymentProof(paymentProof);
      // const paymentProofUrl = uploadData.url;
      
      // Mock upload - in production this would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockPaymentProofUrl = 'https://example.com/payment-proof.jpg';
      setPaymentProofUrl(mockPaymentProofUrl);
      
      // 2. Create order
      // In production, this would be an API call to create the order
      // await orderService.createOrder({
      //   customerName,
      //   packageInfo: selectedPackage,
      //   flavorIds: selectedFlavors,
      //   sweetness,
      //   crushedType,
      //   paymentProofUrl: mockPaymentProofUrl
      // });
      
      // Mock order creation - in production this would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show order complete screen
      setOrderComplete(true);
      
    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Error al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form after order complete
  const handleOrderComplete = () => {
    // Reset all form state
    setCurrentStep(1);
    setSelectedPackage('');
    setSelectedFlavors([]);
    setSweetness('');
    setCrushedType('');
    setCustomerName('');
    setPaymentProof(null);
    setPaymentProofUrl('');
    setOrderComplete(false);
    
    // Navigate to home (optional)
    // navigate('/', { replace: true });
  };
  
  // Helper to get package details
  const getPackageDetails = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? `${pkg.price} - ${pkg.weight}` : '';
  };
  
  // Helper to get flavor names
  const getFlavorNames = (flavorIds: string[]) => {
    return flavorIds.map(id => {
      const flavor = flavors.find(f => f.id === id);
      return flavor ? flavor.name : '';
    });
  };
  
  if (initialLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="order-flow">
      {/* Header */}
      <header className="order-flow-header">
        <img src="/assets/images/logo.png" alt="Coca Premium" className="logo" />
        <h1>Coca Premium</h1>
      </header>
      
      {/* Progress indicator */}
      <ProgressIndicator currentStep={currentStep} totalSteps={6} />
      
      {/* Error message */}
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      
      {/* Order flow steps */}
      <main className="order-flow-content">
        {currentStep === 1 && (
          <PackageSelection 
            packages={packages}
            selectedPackage={selectedPackage}
            onSelect={handlePackageSelect}
            onNext={handleNext}
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
          />
        )}
        
        {currentStep === 3 && (
          <SweetnessSelection 
            selectedSweetness={sweetness}
            onSelect={handleSweetnessSelect}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 4 && (
          <CrushTypeSelection 
            selectedCrushType={crushedType}
            onSelect={handleCrushTypeSelect}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 5 && (
          <OrderSummary 
            packageDetails={getPackageDetails(selectedPackage)}
            flavorNames={getFlavorNames(selectedFlavors)}
            sweetness={sweetness}
            crushedType={crushedType}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 6 && (
          <PaymentProof 
            customerName={customerName}
            onCustomerNameChange={handleCustomerNameChange}
            paymentProof={paymentProof}
            onFileChange={handleFileChange}
            onSubmit={handleSubmitOrder}
            onBack={handleBack}
            loading={loading}
          />
        )}
      </main>
      
      {/* Order complete modal */}
      {orderComplete && (
        <OrderComplete onClose={handleOrderComplete} />
      )}
    </div>
  );
};

export default OrderFlow;