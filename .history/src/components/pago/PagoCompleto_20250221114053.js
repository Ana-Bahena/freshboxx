import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PagoCompleto() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subtotal, productos } = location.state || { subtotal: 0, productos: [] };

  useEffect(() => {
    // Evitar duplicar la carga del SDK
    if (document.querySelector("#paypal-sdk")) return;

    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=MXN";
    script.id = "paypal-sdk";
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            color: "blue",
            shape: "pill",
            label: "pay",
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: subtotal.toString() } }],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              console.log(details);
              alert("Pago completado correctamente: " + details.id);
              navigate("/carrito"); // Redirigir al carrito tras pago exitoso
            });
          },
          onCancel: () => {
            alert("Pago cancelado.");
          },
          onError: (err) => {
            console.error(err);
            alert("Error en el procesamiento de la transacción.");
          },
        }).render("#paypal-button-container");
      } else {
        console.error("Error al cargar el SDK de PayPal.");
      }
    };

    document.body.appendChild(script);
  }, [subtotal, navigate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#bbeafd" }}>
      <div id="paypal-button-container"></div>
    </div>
  );
}

export default PagoCompleto;
