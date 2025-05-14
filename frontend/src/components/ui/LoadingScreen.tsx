// frontend/src/components/ui/LoadingScreen.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <Loader2 className="loading-icon" />
      <p className="loading-text">Cargando...</p>
    </div>
  );
};

export default LoadingScreen;