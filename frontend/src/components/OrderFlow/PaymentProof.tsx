// frontend/src/components/OrderFlow/PaymentProof.tsx
import React from 'react';
import { ChevronLeft, Upload, Loader2 } from 'lucide-react';

interface PaymentProofProps {
  customerName: string;
  onCustomerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paymentProof: File | null;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

const PaymentProof: React.FC<PaymentProofProps> = ({
  customerName,
  onCustomerNameChange,
  paymentProof,
  onFileChange,
  onSubmit,
  onBack,
  loading
}) => {
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };
  
  return (
    <div className="payment-proof-container">
      <div className="step-header">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft className="button-icon" />
        </button>
        <h2 className="step-title">Finaliza tu pedido</h2>
      </div>
      
      <div className="qr-code-section">
        <img 
          src="/assets/images/qr-code.png" 
          alt="Código QR para pago" 
          className="qr-code-image"
        />
        <p className="qr-code-text">
          Escanea el código QR para realizar el pago
        </p>
      </div>
      
      <div className="payment-form">
        <div className="form-group">
          <label className="form-label">
            Nombre de quien recogerá el pedido
          </label>
          <input
            type="text"
            value={customerName}
            onChange={onCustomerNameChange}
            className="form-input"
            placeholder="Ingresa tu nombre"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Comprobante de pago
          </label>
          <input 
            id="payment-proof-input" 
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label 
            htmlFor="payment-proof-input"
            className="upload-container"
          >
            {paymentProof ? (
              <div className="upload-preview">
                <img 
                  src={URL.createObjectURL(paymentProof)} 
                  alt="Vista previa" 
                  className="preview-image"
                />
                <span className="upload-text">Cambiar imagen</span>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <Upload size={24} />
                </div>
                <div className="upload-text">
                  Subir comprobante de pago
                </div>
                <p className="upload-info">
                  Formatos aceptados: JPG, PNG
                </p>
              </>
            )}
          </label>
        </div>
      </div>
      
      <button
        className="submit-button"
        disabled={loading || !customerName.trim() || !paymentProof}
        onClick={onSubmit}
      >
        {loading ? (
          <>
            <Loader2 className="spinner" />
            Procesando...
          </>
        ) : (
          'Finalizar pedido'
        )}
      </button>
    </div>
  );
};

export default PaymentProof;