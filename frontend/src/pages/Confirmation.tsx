// pages/Confirmation.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Clock, Package, User } from 'lucide-react';
import '../styles/Confirmation.css'; // Asegúrate de tener este archivo CSS

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;
  
  // Si no hay datos del pedido, redirigir después de 2 segundos
  useEffect(() => {
    if (!orderData) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [orderData, navigate]);
  
  // Volver al inicio
  const handleReturn = () => {
    navigate('/', { replace: true });
  };
  
  if (!orderData) {
    return (
      <div className="confirmation-loading">
        <div className="loading-content">
          <p>No hay información de pedido disponible.</p>
          <p>Redirigiendo a la página principal...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="confirmation-container">
      {/* Header elegante */}
      <div className="confirmation-header">
        <div className="header-content">
          <img
            src="/images/logo.png"
            alt="Tía Coca"
            className="header-logo"
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="confirmation-main">
        
        {/* Ícono de éxito y título */}
        <div className="success-section">
          <div className="success-icon">
            <Check className="check-icon" strokeWidth={3} />
          </div>
          
          <h1 className="main-title">¡Pedido confirmado!</h1>
          
          <p className="welcome-text">
            Hola <span className="customer-name">{orderData.customerName}</span> 👋
          </p>
          <p className="subtitle">
            Tu pedido ha sido registrado exitosamente y está en preparación.
          </p>
        </div>

        {/* Cards del contenido */}
        <div className="cards-container">
          
          {/* Card del número de pedido */}
          <div className="card order-number-card">
            <div className="card-header green-header">
              <Package className="header-icon" />
              <h3>Número de pedido</h3>
            </div>
            <div className="card-content centered">
              <p className="order-id">{orderData.orderID}</p>
              <p className="order-note">Guarda este número para recoger tu pedido</p>
            </div>
          </div>

          {/* Card del estado */}
          <div className="card status-card">
            <div className="card-header blue-header">
              <Clock className="header-icon" />
              <h3>Estado del pedido</h3>
            </div>
            <div className="card-content">
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span className="status-text">Preparando tu pedido</span>
              </div>
              <div className="time-estimate">
                <p>Tiempo estimado: <span className="time-bold">{orderData.estimatedTime}</span></p>
              </div>
            </div>
          </div>

          {/* Card del resumen */}
          <div className="card summary-card">
            <div className="card-header gray-header">
              <h3>Resumen de tu pedido</h3>
            </div>
            <div className="card-content">
              <div className="summary-grid">
                
                <div className="summary-column">
                  <div className="summary-item">
                    <span className="label">Producto:</span>
                    <span className="value">{orderData.packageDetails.split(' - ')[0]}</span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="label">Sabores:</span>
                    <div className="flavors-container">
                      {orderData.flavors.map((flavor: string, index: number) => (
                        <span key={index} className="flavor-tag">
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="summary-column">
                  <div className="summary-item">
                    <span className="label">Dulzura:</span>
                    <span className="value">{orderData.sweetness}</span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="label">Machucado:</span>
                    <span className="value">{orderData.crushedType}</span>
                  </div>
                </div>
              </div>
              
              <hr className="divider" />
              
              <div className="total-section">
                <span className="total-label">Total pagado:</span>
                <span className="total-amount">{orderData.totalPrice} Bs</span>
              </div>
            </div>
          </div>

          {/* Card de instrucciones */}
          <div className="card instructions-card">
            <div className="card-header yellow-header">
              <User className="header-icon" />
              <h3>¿Cómo recoger tu pedido?</h3>
            </div>
            <div className="card-content">
              <div className="instructions-box">
                <p className="instructions-title">🗣️ Presenta cualquiera de estos datos:</p>
                <ul className="instructions-list">
                  <li>• Tu nombre: <strong>"{orderData.customerName}"</strong></li>
                  <li>• Número de pedido: <strong>{orderData.orderID}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botón principal */}
        <div className="button-section">
          <button
            onClick={handleReturn}
            className="main-button"
          >
            🛒 Hacer otro pedido
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="confirmation-footer">
        <p>© 2025 Tía Coca. Gracias por tu preferencia 💚</p>
      </div>
    </div>
  );
};

export default Confirmation;