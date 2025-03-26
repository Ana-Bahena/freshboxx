  import React from "react";
  import { useNavigate, useLocation } from "react-router-dom";

  import "./Pago.css"; 
  import paypalIcon from "../../img/paypal.png"; 

  function Pago() { 
    const navigate = useNavigate(); 
    const location = useLocation();
    const { carrito = [] } = location.state || { carrito: [] }; 
  

    const subtotal = carrito.reduce((acc, producto) => acc + producto.pr_precio * producto.cantidad, 0);


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
