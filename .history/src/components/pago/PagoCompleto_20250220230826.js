import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import paypalIcon from "../../img/paypal.png";

function PagoCompleto() {
  const location = useLocation();
  const { subtotal, productos } = location.state || { subtotal: 0, productos: [] };

  useEffect(() => {
    // Cargar el SDK de PayPal
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AXkiDIlIWRI4m-ZhD0EqfxQbupBB-NHqJ4zHSO41EIO2UXR-YJHmvt2qkLvSEDZdnzz3EUptRYSsNxIB&currency=MXN&disable-funding=card";
    script.async = true;
    script.onload = () => {
      // Inicializar los botones de PayPal después de que el script se haya cargado
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
                value: subtotal.toString() // Convertir a string
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            console.log(details);
            alert('Pago completado correctamente: ' + details.id);
            // Aquí podrías enviar los detalles al servidor para finalizar la venta
            // ...
          });
        },
        onCancel: function(data) {
          alert('Pago cancelado.');
        },
        onError: function(err) {
          console.error(err);
          alert('Error en el procesamiento de la transacción.');
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }, [subtotal, productos]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#bbeafd' }}>
      <div id="paypal-button-container"></div>
      <a href="/carrito" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', textDecoration: 'none' }}>Cancelar</a>
    </div>
  );
}

export default PagoCompleto;
