// src/components/OrderFlow/PaymentProof.tsx (COMPONENTE CLIENTE)
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { qrService, type QRCode } from '../../services/qr'; // 🔧 Usar 'type' para evitar conflicto

// ✅ Remover interface duplicada, usar la importada

interface PaymentProofProps {
  customerName: string;
  onCustomerNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  paymentProof: File | null;
  paymentProofUrl: string;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  uploadingProof: boolean;
  totalPrice: number;
  currentStep: number;
}

const PaymentProof: React.FC<PaymentProofProps> = ({
  customerName,
  onCustomerNameChange,
  paymentProof,
  paymentProofUrl,
  onFileChange,
  onSubmit,
  onBack,
  loading,
  uploadingProof,
  totalPrice,
  currentStep
}) => {
  // 📱 Estados para QRs dinámicos (CLIENTE)
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [loadingQRs, setLoadingQRs] = useState(true);
  const [qrError, setQrError] = useState<string>('');

  const stepTitles = ['', 'Selecciona tu paquete', 'Selecciona tus sabores', 'Grado de dulce', 'Tipo de machucado', 'Resumen del pedido', 'Finaliza tu pedido'];

  // 📱 Cargar QRs activos al montar el componente (usando tu estructura)
  useEffect(() => {
    const loadQRs = async () => {
      try {
        setLoadingQRs(true);
        const activeQRs = await qrService.getActiveQRs(); // 🔧 Usar qrService
        setQrCodes(activeQRs);
        
        // Seleccionar automáticamente el primer QR activo
        if (activeQRs.length > 0) {
          setSelectedQR(activeQRs[0]);
        }
      } catch (error) {
        console.error('Error al cargar QRs:', error);
        setQrError('No se pudieron cargar los códigos QR');
      } finally {
        setLoadingQRs(false);
      }
    };

    loadQRs();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  // ✅ Función para cambiar QR seleccionado (solo si hay múltiples)
  const handleQRSelect = (qr: QRCode) => {
    setSelectedQR(qr);
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

      <div className="bg-primary-light p-4 rounded-lg mb-6">
        <div className="text-center">
          <h3 className="font-bold text-primary mb-2">Total a pagar</h3>
          <p className="text-2xl font-bold text-primary">{totalPrice} Bs</p>
        </div>
      </div>

      {/* 📱 Sección QR dinámico para CLIENTE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem'
      }}>
        {loadingQRs ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <Loader2 style={{ height: '32px', width: '32px', color: '#16a34a', marginBottom: '12px' }} className="animate-spin" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Cargando códigos QR...</span>
          </div>
        ) : qrError ? (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fee2e2', 
            borderRadius: '8px', 
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{qrError}</p>
          </div>
        ) : qrCodes.length === 0 ? (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              No hay códigos QR disponibles en este momento
            </p>
          </div>
        ) : (
          <>
            {/* 📱 Selector de QR (si hay múltiples opciones) */}
            {qrCodes.length > 1 && (
              <div style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '320px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px',
                  textAlign: 'center'
                }}>
                  Selecciona método de pago:
                </label>
                <select
                  value={selectedQR?.id || ''}
                  onChange={(e) => {
                    const selected = qrCodes.find(qr => qr.id === e.target.value);
                    if (selected) handleQRSelect(selected); // ✅ Usar la función
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  {qrCodes.map(qr => (
                    <option key={qr.id} value={qr.id}>
                      {qr.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 📱 QR Image SIN BORDE y más grande */}
            {selectedQR && (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {/* QR sin contenedor, directo y grande */}
                  <img
                    src={selectedQR.image_url}
                    alt={`Código QR - ${selectedQR.name}`}
                    style={{
                      width: '350px',        // Mucho más grande
                      height: '350px',       // Mucho más grande
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: '8px',   // Solo un pequeño radio
                      backgroundColor: 'white'  // Fondo blanco por si el QR tiene transparencia
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/qr_fallback.png';
                    }}
                  />
                  
                  <div style={{ textAlign: 'center', maxWidth: '350px', marginTop: '16px' }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#16a34a',
                      marginBottom: '8px',
                      margin: '0 0 8px 0'
                    }}>
                      {selectedQR.name}
                    </h4>
                    <p style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      margin: '0',
                      lineHeight: '1.5'
                    }}>
                      Escanea el código QR para realizar el pago
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de quien recogerá el pedido *
        </label>
        <input
          type="text"
          className="input"
          value={customerName}
          onChange={onCustomerNameChange}
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
            onChange={handleFileSelect}
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
        disabled={loading || !customerName.trim() || !paymentProofUrl || uploadingProof || !selectedQR}
        onClick={onSubmit}
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
  );
};

export default PaymentProof;