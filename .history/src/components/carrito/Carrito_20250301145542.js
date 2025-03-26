import React, { useState, useEffect } from "react";
import "./carrito.css";
import { useNavigate, useLocation } from "react-router-dom"; 

function Carrito({ carrito, setCarrito }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (location.state?.pagoExitoso) {
      setMensaje("¡Pago realizado con éxito!");
      setCarrito([]); // Vaciar carrito después del pago
    }
  }, [location.state, setCarrito]);

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((producto) => producto.pr_id !== id);
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce(
    (acc, producto) => acc + producto.pr_precio * producto.cantidad,
    0
  );

  const finalizarCompra = () => {
    navigate("/pago", { state: { subtotal: total, productos: carrito } });
  };

  return (
    <div className="carrito-container">
      <h2>🛒 Carrito de Compras</h2>
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          <ul>
            {carrito.map((producto) => (
              <li key={producto.pr_id}>
                <h3>{producto.pr_nombre}</h3>
                <p>Precio: ${producto.pr_precio}</p>
                <p>Cantidad: {producto.cantidad}</p>
                <button onClick={() => eliminarProducto(producto.pr_id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={finalizarCompra}>Finalizar Compra</button> 
        </div>
      )}
    </div>
  );
}

export default Carrito;
