import React from "react";
import { useNavigate } from "react-router-dom";

const GraciasCompra = () => {
  const navigate = useNavigate();

  const handleFactura = () => {
    navigate("/factura"); // Puedes cambiarlo a la vista donde generas facturas
  };

  const handleNoGracias = () => {
    navigate("/homes"); // Redirige a la página principal
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>¡Gracias por tu compra!</h2>
      <p>¿Deseas solicitar una factura?</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleFactura}
          style={{
            padding: "12px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginRight: "10px",
          }}
        >
          Solicitar Factura
        </button>
        <button
          onClick={handleNoGracias}
          style={{
            padding: "12px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          No, gracias
        </button>
      </div>
    </div>
  );
};

export default GraciasCompra;
