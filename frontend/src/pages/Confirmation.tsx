// pages/Confirmation.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import '../styles/Confirmation.css'; // CSS minimalista

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;
  
  // Si no hay datos del pedido, redirigir
  useEffect(() => {
    if (!orderData) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [orderData, navigate]);
  
  // Función para descargar comprobante en PDF
  const handleDownloadReceipt = () => {
    // Importar jsPDF dinámicamente
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configuración de colores - definidas como tuplas
      const primaryColor: [number, number, number] = [22, 163, 74]; // #16a34a
      const darkGreen: [number, number, number] = [22, 101, 52]; // #166534
      const lightGray: [number, number, number] = [107, 114, 128]; // #6b7280

      // Header con fondo verde
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 25, 'F');

      // Función para generar el resto del PDF
      const generateRestOfPDF = () => {
        // Número de pedido destacado
        doc.setFillColor(236, 253, 245); // #ecfdf5
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1);
        doc.rect(20, 35, 170, 25, 'FD');
        
        doc.setTextColor(...lightGray);
        doc.setFontSize(10);
        doc.text('Número de pedido', 105, 45, { align: 'center' });
        
        doc.setTextColor(...darkGreen);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(orderData.orderID, 105, 55, { align: 'center' });

        let yPos = 75;

        // Información del cliente
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENTE', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(orderData.customerName, 20, yPos + 8);
        yPos += 20;

        // Fecha y hora
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('FECHA Y HORA', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const fecha = new Date().toLocaleDateString('es-BO');
        const hora = new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
        doc.text(`${fecha} - ${hora}`, 20, yPos + 8);
        yPos += 20;

        // Producto
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('PRODUCTO', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(orderData.packageDetails.split(' - ')[0], 20, yPos + 8);
        yPos += 20;

        // Sabores
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('SABORES SELECCIONADOS', 20, yPos);
        yPos += 10;
        
        orderData.flavors.forEach((flavor: string, index: number) => {
          doc.setFillColor(236, 253, 245);
          doc.setDrawColor(...primaryColor);
          doc.roundedRect(20 + (index % 3) * 55, yPos, 50, 8, 2, 2, 'FD');
          
          doc.setTextColor(...darkGreen);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.text(flavor, 25 + (index % 3) * 55, yPos + 5);
          
          if ((index + 1) % 3 === 0) yPos += 12;
        });
        
        if (orderData.flavors.length % 3 !== 0) yPos += 12;
        yPos += 10;

        // Personalización
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('PERSONALIZACIÓN', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`• Dulzura: ${orderData.sweetness}`, 20, yPos + 10);
        doc.text(`• Machucado: ${orderData.crushedType}`, 20, yPos + 18);
        yPos += 30;

        // Estado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('ESTADO DEL PEDIDO', 20, yPos);
        
        doc.setTextColor(...primaryColor);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text('• Preparando tu pedido', 20, yPos + 8);
        doc.text(`• Tiempo estimado: ${orderData.estimatedTime}`, 20, yPos + 16);
        yPos += 30;

        // Total destacado
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(2);
        doc.rect(20, yPos, 170, 20, 'FD');
        
        doc.setTextColor(...lightGray);
        doc.setFontSize(12);
        doc.text('Total pagado', 105, yPos + 8, { align: 'center' });
        
        doc.setTextColor(...primaryColor);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`${orderData.totalPrice} Bs`, 105, yPos + 16, { align: 'center' });
        yPos += 35;

        // Footer
        doc.setDrawColor(...lightGray);
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        
        doc.setTextColor(...lightGray);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Gracias por tu preferencia', 105, yPos + 8, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.text(`Tía Coca - ${new Date().getFullYear()}`, 105, yPos + 15, { align: 'center' });

        // Descargar el PDF
        doc.save(`TiaCoca-Comprobante-${orderData.orderID}.pdf`);
      };

      // Cargar y añadir el logo
      const logoImg = new Image();
      logoImg.onload = () => {
        try {
          // Añadir logo centrado (ajusta las dimensiones según necesites)
          doc.addImage(logoImg, 'PNG', 85, 2, 40, 18); // x, y, width, height
          
          // Texto "Comprobante de Pedido" debajo del logo con más espacio
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('Comprobante de Pedido', 105, 24, { align: 'center' });
          
          generateRestOfPDF();
        } catch (error) {
          console.warn('Error al añadir logo, usando texto:', error);
          // Fallback a texto si hay error con el logo
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text('TÍA COCA', 105, 16, { align: 'center' });
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text('Comprobante de Pedido', 105, 21, { align: 'center' });
          
          generateRestOfPDF();
        }
      };
      
      logoImg.onerror = () => {
        console.warn('No se pudo cargar el logo, usando texto');
        // Si no se puede cargar el logo, usar texto
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('TÍA COCA', 105, 16, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Comprobante de Pedido', 105, 21, { align: 'center' });
        
        generateRestOfPDF();
      };
      
      // Cargar el logo desde la ruta correcta
      logoImg.src = '/images/logosfondo.png';
      
    }).catch(error => {
      console.error('Error al cargar jsPDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    });
  };
  
  // Volver al inicio
  const handleReturn = () => {
    navigate('/', { replace: true });
  };
  
  if (!orderData) {
    return (
      <div className="container">
        <div className="card">
          <p className="subtitle">No hay información de pedido disponible.</p>
          <p className="subtitle">Redirigiendo...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      {/* Ícono de éxito con animación */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div 
          className="success-icon-animated"
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Check size={40} color="white" strokeWidth={3} />
        </div>
        <h1 className="title">¡Pedido confirmado!</h1>
        <p className="subtitle">
          Hola <strong>{orderData.customerName}</strong>, tu pedido está listo.
        </p>
      </div>

      {/* Información principal en una sola card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {/* Número de pedido destacado */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '1rem',
          padding: '1rem',
          background: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--color-primary)'
        }}>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-text-light)', 
            marginBottom: '0.5rem'
          }}>
            Tu número de pedido
          </p>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: 'var(--color-primary-dark)',
            margin: 0,
            letterSpacing: '0.05em'
          }}>
            {orderData.orderID}
          </p>
        </div>

        {/* Instrucciones para recoger el pedido */}
        <div style={{
          background: '#fefce8',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ 
            color: '#92400e', 
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '0.875rem'
          }}>
            💡 Para recoger tu pedido presenta cualquiera de estos:
          </h4>
          <ul style={{ 
            color: '#a16207',
            fontSize: '0.875rem',
            margin: 0,
            paddingLeft: '1rem',
            listStyle: 'disc'
          }}>
            <li>Tu nombre: <strong>"{orderData.customerName}"</strong></li>
            <li>Número de pedido: <strong>{orderData.orderID}</strong></li>
            <li>Este comprobante descargado</li>
          </ul>
        </div>

        {/* Estado y tiempo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '0.75rem',
          background: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          gap: '0.5rem'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--color-primary)',
            borderRadius: '50%'
          }}></div>
          <span style={{ fontWeight: '500', color: 'var(--color-text)' }}>
            Preparando tu pedido • {orderData.estimatedTime}
          </span>
        </div>

        {/* Resumen del pedido */}
        <div>
          <h3 style={{ 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: 'var(--color-text)'
          }}>
            Resumen de tu pedido
          </h3>
          
          <div style={{ marginBottom: '0.75rem' }}>
            <p style={{ fontWeight: '600', color: 'var(--color-text)' }}>
              {orderData.packageDetails.split(' - ')[0]}
            </p>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {orderData.flavors.map((flavor: string, index: number) => (
                <span key={index} className="flavor-tag">
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                {orderData.sweetness} • {orderData.crushedType}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '1.25rem',
                fontWeight: 'bold', 
                color: 'var(--color-primary)' 
              }}>
                {orderData.totalPrice} Bs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones simples */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px'
      } as React.CSSProperties}>
        <button
          className="button"
          onClick={handleReturn}
        >
          Hacer otro pedido
        </button>
        <button
          className="button button-outline"
          onClick={handleDownloadReceipt}
        >
          Descargar PDF
        </button>
      </div>

      {/* Footer minimalista */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        fontSize: '0.875rem',
        color: 'var(--color-text-light)'
      }}>
        <p>Gracias por tu preferencia</p>
      </div>
    </div>
  );
};

export default Confirmation;