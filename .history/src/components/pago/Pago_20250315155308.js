import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom"; 

const PayPalButtonComponent = () => {
  const navigate = useNavigate(); 

  const initialOptions = {
    "client-id": "AVJGNRWGCQEms6Rxoat2y1UZhEUCfZY1DDPIJCzdKeFt4W1U4dBAU0EvqWwggTv-pYXpVMj3ARXoa98Q",
    currency: "MXN",
    intent: "capture",
    "disable-funding": "card" 
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "MXN",
            value: "5"
          }
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      alert("Pago generado con éxito!! " + details.payer.name.given_name);
  
      // Suponiendo que los productos están en localStorage o en un estado global
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
      // Enviar productos comprados al backend para actualizar stock
      await fetch("http://localhost:5000/actualizar-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productos: carrito }),
      });
  
      // Vaciar el carrito después de la compra
      localStorage.removeItem("carrito");
  
      navigate("/gracias-compra");
    });
  };
  

  const handleCancel = () => {
    navigate("/carrito"); 
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div style={{ textAlign: "center" }}>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 55, 
          }}
          createOrder={createOrder}
          onApprove={onApprove} 
        />
        <button
          onClick={handleCancel}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Cancelar
        </button>
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalButtonComponent;
