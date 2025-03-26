import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PagoCompleto() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtotal, productos } = location.state || { subtotal: 10, productos: [] };

  useEffect(() => {
    // Cargar el SDK de PayPal
    const script = document.createElement("script");
    script.src = "https://sandbox.paypal.com/sdk/js?client-id=AeeXXQ2QxzE0qAgb96RX4Ri7CGztz4gv8qx8RrApoKp87iOzl6WIiXqhbuS_ywEa5A64dxLlYNo0l6rr"; // Reemplaza TU_CLIENT_ID
    script.async = true;
    script.onload = () => {
      console.log("Subtotal:", subtotal);
      window.paypal.Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay'
        },
        createOrder: function(data, actions) {
          console.log('Creando orden con:',   );
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: subtotal.toFixed(2) 
              }
            }]
          });
        },
        
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            console.log(details);
            alert('Pago completado correctamente: ' + details.id);
            navigate("/carrito"); 
          });
        },
        onCancel: function(data) {
          alert('Pago cancelado.');
          navigate("/carrito"); 
        },
        onError: function(err) {
          console.error('Error en el procesamiento de la transacción:', err);
          alert('Error en el procesamiento de la transacción. Detalles: ' + JSON.stringify(err));
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }, [subtotal, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#bbeafd' }}>
      <div id="paypal-button-container"></div>
    </div>
  );
}

export default PagoCompleto;
