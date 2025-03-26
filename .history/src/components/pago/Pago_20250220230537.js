import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pago.css"; 
import paypalIcon from "../../img/paypal.png"; 

function Pago({ carrito }) {
  const navigate = useNavigate(); // Inicializar el hook

  // Calcular el subtotal
  const subtotal = carrito.reduce((acc, producto) => acc + producto.pr_precio * producto.cantidad, 0);

  const manejarPago = () => {
    // Redirigir a la vista de PagoCompleto pasando el subtotal y productos
    navigate("/pago-completo", { state: { subtotal, productos: carrito } });
  };

  const manejarCancelacion = () => {
    // Redirigir a la vista de carrito
    navigate("/carrito");
  };

  return (
    <div className="pago-container">
      <button className="btn-pagar" onClick={manejarPago}>
        <img src={paypalIcon} alt="PayPal" className="paypal" />
        Pagar con PayPal
      </button>
      <button className="btn-cancelar" onClick={manejarCancelacion}>
        Cancelar
      </button>
    </div>
  );
}

export default Pago;
