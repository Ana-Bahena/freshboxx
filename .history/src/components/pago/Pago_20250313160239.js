import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButtonComponent = ({ onCancel }) => {
  const initialOptions = {
    "client-id": "AVJGNRWGCQEms6Rxoat2y1UZhEUCfZY1DDPIJCzdKeFt4W1U4dBAU0EvqWwggTv-pYXpVMj3ARXoa98Q",
    currency: "MXN",
    intent: "capture",
    "disable-funding": "card" // Esto elimina la opción de pago con tarjeta
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
    });
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
            height: 55, // Botón más grande
          }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
        <button
          onClick={onCancel}
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
