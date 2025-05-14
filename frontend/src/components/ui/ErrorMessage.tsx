// frontend/src/components/ui/ErrorMessage.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <AlertTriangle className="error-icon" />
      <span className="error-text">{message}</span>
      <button className="error-close" onClick={onClose}>
        <X className="button-icon small" />
      </button>
    </div>
  );
};

export default ErrorMessage;