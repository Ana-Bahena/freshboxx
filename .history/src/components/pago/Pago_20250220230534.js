import React from "react";
import "./Pago.css"; 
import paypalIcon from "../../img/paypal.png"; 

function Pago() {
  const manejarPago = () => {
    // Lógica para manejar el pago con PayPal
    console.log("Pago con PayPal");
  };

  const manejarCancelacion = () => {
    // Lógica para manejar la cancelación
    console.log("Pago cancelado");
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
