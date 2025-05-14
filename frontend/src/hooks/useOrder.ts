// frontend/src/hooks/useOrder.ts
import { useState } from 'react';
import { orderService } from '../services/api';

// Define types
export interface OrderState {
  selectedPackage: string;
  selectedFlavors: string[];
  sweetness: string;
  crushedType: string;
  customerName: string;
  paymentProofUrl: string;
}

export interface UseOrderResult {
  // Order state
  orderState: OrderState;
  // State setters
  setSelectedPackage: (packageId: string) => void;
  addFlavor: (flavorId: string) => void;
  removeFlavor: (flavorId: string) => void;
  setSweetness: (sweetness: string) => void;
  setCrushedType: (crushedType: string) => void;
  setCustomerName: (name: string) => void;
  // File handling
  uploadPaymentProof: (file: File) => Promise<string>;
  // Order submission
  submitOrder: () => Promise<any>;
  // Loading and error states
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useOrder(): UseOrderResult {
  // Order state
  const [orderState, setOrderState] = useState<OrderState>({
    selectedPackage: '',
    selectedFlavors: [],
    sweetness: '',
    crushedType: '',
    customerName: '',
    paymentProofUrl: '',
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Clear error
  const clearError = () => setError(null);
  
  // Update package selection
  const setSelectedPackage = (packageId: string) => {
    setOrderState(prev => ({ ...prev, selectedPackage: packageId }));
  };
  
  // Add flavor to selection (max 4)
  const addFlavor = (flavorId: string) => {
    setOrderState(prev => {
      if (prev.selectedFlavors.length >= 4 || prev.selectedFlavors.includes(flavorId)) {
        return prev;
      }
      return { ...prev, selectedFlavors: [...prev.selectedFlavors, flavorId] };
    });
  };
  
  // Remove flavor from selection
  const removeFlavor = (flavorId: string) => {
    setOrderState(prev => ({
      ...prev,
      selectedFlavors: prev.selectedFlavors.filter(id => id !== flavorId)
    }));
  };
  
  // Set sweetness level
  const setSweetness = (sweetness: string) => {
    setOrderState(prev => ({ ...prev, sweetness }));
  };
  
  // Set crush type
  const setCrushedType = (crushedType: string) => {
    setOrderState(prev => ({ ...prev, crushedType }));
  };
  
  // Set customer name
  const setCustomerName = (customerName: string) => {
    setOrderState(prev => ({ ...prev, customerName }));
  };
  
  // Upload payment proof and get URL
  const uploadPaymentProof = async (file: File): Promise<string> => {
    setLoading(true);
    try {
      const response = await orderService.uploadPaymentProof(file);
      const paymentProofUrl = response.url;
      setOrderState(prev => ({ ...prev, paymentProofUrl }));
      return paymentProofUrl;
    } catch (err: any) {
      setError('Error al subir el comprobante de pago. Por favor, intenta nuevamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Submit complete order
  const submitOrder = async () => {
    setLoading(true);
    try {
      // Validate order data
      if (!orderState.selectedPackage) {
        throw new Error('Por favor selecciona un paquete.');
      }
      if (orderState.selectedFlavors.length === 0) {
        throw new Error('Por favor selecciona al menos un sabor.');
      }
      if (!orderState.sweetness) {
        throw new Error('Por favor selecciona un nivel de dulzura.');
      }
      if (!orderState.crushedType) {
        throw new Error('Por favor selecciona un tipo de machucado.');
      }
      if (!orderState.customerName.trim()) {
        throw new Error('Por favor ingresa el nombre de quien recogerá el pedido.');
      }
      if (!orderState.paymentProofUrl) {
        throw new Error('Por favor sube un comprobante de pago.');
      }
      
      // Submit order
      const response = await orderService.createOrder({
        customerName: orderState.customerName,
        packageInfo: orderState.selectedPackage,
        flavorIds: orderState.selectedFlavors,
        sweetness: orderState.sweetness,
        crushedType: orderState.crushedType,
        paymentProofUrl: orderState.paymentProofUrl
      });
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido. Por favor, intenta nuevamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    orderState,
    setSelectedPackage,
    addFlavor,
    removeFlavor,
    setSweetness,
    setCrushedType,
    setCustomerName,
    uploadPaymentProof,
    submitOrder,
    loading,
    error,
    clearError
  };
}