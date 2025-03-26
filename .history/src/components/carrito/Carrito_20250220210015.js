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

  const cambiarCantidad = (id, nuevaCantidad) => {
    // Obtener el producto correspondiente al ID
    const producto = carrito.find((producto) => producto.pr_id === id);
    
    const cantidadDisponible = producto.cantidadDisponible; // Asegúrate de que este campo esté en tu objeto producto
  
    // Validar si la nueva cantidad supera la cantidad disponible
    if (nuevaCantidad > cantidadDisponible) {
      alert(`Solo hay ${cantidadDisponible} unidades disponibles.`);
      return; // Salir de la función si la cantidad es mayor que la disponible
    }
  
    const nuevoCarrito = carrito.map((producto) => {
      if (producto.pr_id === id) {
        return { ...producto, cantidad: nuevaCantidad };
      }
      return producto;
    });
    setCarrito(nuevoCarrito);
  };  

  return (
    <div className="carrito-containeer">
      {/* Header agregado */}
      <header className="headeer">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <h2>🛒 Carrito de Compras</h2>
        <div className="header-icons">
          <i className="fas fa-home header-icon" onClick={() => navigate("/homes")} style={{ cursor: "pointer" }}></i>
          <i className="fas fa-user header-icon"></i> 
        </div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </header>

      {carrito.length === 0 ? (
      <p>Tu carrito está vacío.</p>
      ) : (
        <div className="productos-container">
          <ul className="carrito-lista">
            {carrito.map((producto) => (
              <li key={producto.pr_id} className="carrito-item">
                <img src={producto.pr_imagen} alt={producto.pr_nombre} className="carrito-imagen" />
                <div className="carrito-info">
                  <h3>{producto.pr_nombre}</h3>
                  <p>Precio: ${producto.pr_precio}</p>
                  <p>Cantidad: {producto.cantidad}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={producto.cantidad}
                  onChange={(e) => cambiarCantidad(producto.pr_id, parseInt(e.target.value))}
                  className="cantidad-input"
                />

                <button className="btn-eliminar" onClick={() => eliminarProducto(producto.pr_id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
          <h3 className="total">Total: ${total.toFixed(2)}</h3>
          <button className="btn-comprar">Finalizar Compra</button>
        </div>
      )}

      {/* Footer agregado */}
      <footer className="footeer">
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
