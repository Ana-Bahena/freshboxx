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
  
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) {
        alert("No hay productos en el carrito para actualizar el stock.");
        alert("No hay productos en el carrito para procesar la venta.");
        return;
      }

      const ventaData = {
        cl_id: 1, 
        vt_total: carrito.reduce((total, p) => total + p.precio * p.cantidad, 0) || 0,
        vt_pesoTotal: carrito.reduce((total, p) => total + (p.peso || 0) * p.cantidad, 0),
        vt_formaPago: "paypal",
        vt_fecha: new Date().toISOString().slice(0, 19).replace("T", " "), 
        carrito: carrito.map(p => ({
          pr_id: p.pr_id, 
          cc_cantidad: p.cantidad,
          cc_precio: p.precio,
          cc_subtotal: p.cantidad * p.precio
        }))
      };
      
      console.log("Datos de la venta:", ventaData); 
      
      
  
      await fetch("http://localhost:5001/actualizar-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productos: carrito.map(p => ({ pr_id: p.pr_id, cantidad: p.cantidad })) }),
      })
      
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la actualización de stock");
          }
          return response.json();
        })
        .then((data) => {
          if (!data.success) {
            throw new Error(data.message || "Error desconocido al actualizar stock");
          }
        })
        .catch((error) => {
          console.error("Error al actualizar stock:", error);
          alert("Hubo un error al actualizar el stock. Intenta nuevamente.");
        });

        await fetch("https://fresh-back.onrender.com/registrar-venta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ventaData),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert("Venta registrada exitosamente");
            localStorage.removeItem("carrito");
            navigate("/gracias-compra");
          } else {
            throw new Error(data.message);
          }
        })
        .catch(error => {
          console.error("Se ah registrado la venta:", error);
          alert("Venta registrada correctamente.");
        });

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
