import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PagoCompleto() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtotal, productos } = location.state || { subtotal: 0, productos: [] };

  useEffect(() => {
    // Cargar el SDK de PayPal
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=MXN"; // Reemplaza TU_CLIENT_ID
    script.async = true;
    script.onload = () => {
      console.log("Subtotal:", subtotal); // Verificar el subtotal
      window.paypal.Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay'
        },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: subtotal.toFixed(2) // Asegúrate de que sea un número con dos decimales
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            console.log(details);
            alert('Pago completado correctamente: ' + details.id);
            navigate("/carrito"); // Redirigir al carrito tras pago exitoso
          });
        },
        onCancel: function(data) {
          alert('Pago cancelado.');
          navigate("/carrito"); // Redirigir al carrito al cancelar el pago
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
