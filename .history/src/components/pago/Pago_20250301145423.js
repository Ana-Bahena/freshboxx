import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pago.css"; 
import paypalIcon from "../../img/paypal.png"; 

function Pago({ carrito }) {
  const navigate = useNavigate(); 

  const subtotal = Array.isArray(carrito) 
      ? carrito.reduce((acc, producto) => acc + producto.pr_precio * producto.cantidad, 0) 
      : 0; 

  const manejarPago = () => {
    if (subtotal <= 0) {
      alert("No puedes pagar un carrito vacío.");
      return;
    }
    navigate("/pago-completo", { state: { subtotal, productos: carrito } });
  };

  const manejarCancelacion = () => {
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
