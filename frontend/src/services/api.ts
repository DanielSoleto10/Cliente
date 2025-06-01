// frontend/src/services/api.ts
import axios from 'axios';

// Base URL for the API - can be changed in .env file
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.5:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API services for order flow
export const orderService = {
  // Get all available packages
  getPackages: async () => {
    try {
      const response = await api.get('/packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Get all flavor categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get flavors by category
  getFlavorsByCategory: async (categoryId: string) => {
    try {
      const response = await api.get(`/flavors/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flavors:', error);
      throw error;
    }
  },

  // Get all flavors
  getAllFlavors: async () => {
    try {
      const response = await api.get('/flavors');
      return response.data;
    } catch (error) {
      console.error('Error fetching all flavors:', error);
      throw error;
    }
  },

  // NUEVA FUNCIÓN: Get crushed types
  getCrushedTypes: async () => {
    try {
      const response = await api.get('/crushed-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching crushed types:', error);
      throw error;
    }
  },

  // Upload payment proof
  uploadPaymentProof: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('paymentProof', file);

      const response = await api.post('/upload/payment-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData: {
    customerName: string;
    packageInfo: string;
    flavorIds: string[];
    sweetness: string;
    crushedType: string;
    paymentProofUrl: string;
  }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
};

export default api;