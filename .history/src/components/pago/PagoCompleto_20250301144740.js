import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PagoCompleto() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtotal, productos } = location.state || { subtotal: 0, productos: [] };

  useEffect(() => {
    if (!subtotal) return; // Evita ejecutar si subtotal es 0

    // Verifica si el script de PayPal ya está cargado
    if (!document.querySelector("script[src*='paypal.com/sdk/js']")) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AeeXXQ2QxzE0qAgb96RX4Ri7CGztz4gv8qx8RrApoKp87iOzl6WIiXqhbuS_ywEa5A64dxLlYNo0l6rr";
      script.async = true;
      script.onload = () => iniciarPago();
      document.body.appendChild(script);
    } else {
      iniciarPago();
    }

    function iniciarPago() {
      window.paypal.Buttons({
        style: {
          color: 'blue',
          shape: 'pill',
          label: 'pay'
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: subtotal.toFixed(2) } }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Pago completado correctamente: ' + details.id);
            navigate("/carrito");
          });
        },
        onCancel: () => {
          alert('Pago cancelado.');
          navigate("/carrito");
        },
        onError: (err) => {
          console.error('Error en la transacción:', err);
          alert('Error en la transacción. Detalles: ' + JSON.stringify(err));
        }
      }).render('#paypal-button-container');
    }
  }, [subtotal, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#bbeafd' }}>
      <div id="paypal-button-container"></div>
    </div>
  );
}

export default PagoCompleto;
