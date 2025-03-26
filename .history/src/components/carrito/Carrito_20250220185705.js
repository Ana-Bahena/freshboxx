import React from "react";
import "./carrito.css";
import logo from "../../img/Logo Fresh Box2.png"; 
import { useNavigate } from "react-router-dom"; 


function Carrito({ carrito, setCarrito }) {
  const navigate = useNavigate();

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter((producto) => producto.pr_id !== id);
    setCarrito(nuevoCarrito);
  };

  // Calcular total a pagar
  const total = carrito.reduce(
    (acc, producto) => acc + producto.pr_precio * producto.cantidad,
    0
  );

  return (
    <div className="carrito-containeer">
      {/* Header agregado */}
     <header className="headeer">
  <div className="logo">
    <img src={logo} alt="Logo" className="logo-img" />
  </div>
  <div className="header-icons">
    <i className="fas fa-home header-icon"></i> 
    <i className="fas fa-user header-icon"></i> 
  </div>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  />
</header>


      <h2>🛒 Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((producto) => (
              <li key={producto.pr_id} className="carrito-item">
                <img src={producto.pr_imagen} alt={producto.pr_nombre} className="carrito-imagen" />
                <div className="carrito-info">
                  <h3>{producto.pr_nombre}</h3>
                  <p>Precio: ${producto.pr_precio}</p>
                  <p>Cantidad: {producto.cantidad}</p>
                </div>
                <button className="btn-eliminar" onClick={() => eliminarProducto(producto.pr_id)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <h3 className="total">Total: ${total.toFixed(2)}</h3>
          <button className="btn-comprar">Finalizar Compra</button>
        </>
      )}
      {/* Footer agregado */}
      <footer className="footer">
        <p>&copy; 2025 FreshBox. Todos los derechos reservados.</p>
        <div className="social-icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
        </div>
      </footer>
    </div>
  );
}

export default Carrito;
