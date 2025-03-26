import React from "react";
import "./pago.css"; // Asegúrate de crear este archivo para los estilos

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
        Pagar con PayPal
      </button>
      <button className="btn-cancelar" onClick={manejarCancelacion}>
        Cancelar
      </button>
    </div>
  );
}

export default Pago;
