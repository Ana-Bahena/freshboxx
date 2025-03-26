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
    return actions.order.capture().then(function (details) {
      alert("Pago generado con éxito!! " + details.payer.name.given_name);
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
