  import React, { useState } from "react";
  import "./carrito.css";
  import logo from "../../img/Logo Fresh Box2.png"; 
  import { useNavigate } from "react-router-dom"; 
  import axios from "axios";


  function Carrito({ carrito, setCarrito }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const eliminarProducto = (id) => {
      const nuevoCarrito = carrito.filter((producto) => producto.pr_id !== id);
      setCarrito(nuevoCarrito);
    };

    const total = carrito.reduce((acc, producto) => {
      if (!producto.pr_precio || !producto.cantidad) return acc;
      return acc + parseFloat(producto.pr_precio) * producto.cantidad;
    }, 0);

    const cambiarCantidad = (id, nuevaCantidad) => {
      const producto = carrito.find((producto) => producto.pr_id === id);
      const cantidadDisponible = producto ? producto.pr_cantidad : 0; 
    
      if (nuevaCantidad < 1) {
        return;
      }
    
      if (nuevaCantidad > cantidadDisponible) {
        const nuevoCarrito = carrito.map((prod) => 
          prod.pr_id === id ? { ...prod, error: `No puedes agregar más de ${cantidadDisponible} ${prod.pr_nombre} al carrito.` } : { ...prod, error: "" }
        );
        setCarrito(nuevoCarrito);
      } else {
        const nuevoCarrito = carrito.map((producto) => {
          if (producto.pr_id === id) {
            return { ...producto, cantidad: nuevaCantidad, error: "" }; 
          }
          return producto;
        });
        setCarrito(nuevoCarrito);
      }
    };
    
    const finalizarCompra = async () => {
      const userId = localStorage.getItem("userSession");
    
      if (!userId) {
        alert("No se encontró información del cliente. Inicia sesión nuevamente.");
        navigate("/login");
        return;
      }
    
      try {
        // Primero obtenemos cl_id desde backend usando userId
        const res = await axios.get("http://localhost:5001/get-cliente-id", {
          params: { us_id: userId }
        });
    
        const cl_id = res.data.cl_id;
        if (!cl_id) {
          alert("No se encontró información del cliente.");
          return;
        }
    
        // Ahora finalizamos la compra
        const response = await axios.post("http://localhost:3001/api/finalizarCompra", {
          carrito,
          cl_id: parseInt(cl_id)
        });
    
        alert("Compra realizada con éxito");
        setCarrito([]);
        navigate("/pago");
      } catch (error) {
        console.error("Error al finalizar compra:", error);
        alert("Error al finalizar la compra");
      }
    };
    
    

    const subtotal = carrito.reduce(
      (acc, producto) => acc + parseFloat(producto.pr_precio) * producto.cantidad,
      0
    );
    
    const corregirCarrito = carrito.map(producto =>
      producto.cantidad < 1 ? { ...producto, cantidad: 1 } : producto
    );
    
    return (
      <div className="carrito-containeer">
        <header className="headeer">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>
          <h2 className="carrito-title">🛒 Carrito de Compras</h2>
          <div className="header-icons">
            <i className="fas fa-home header-icon" onClick={() => navigate("/homes")} style={{ cursor: "pointer" }}></i>
            <i className="fas fa-user header-icon" onClick={() => navigate("/perfil")} style={{ cursor: "pointer"}}></i> 
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
                  {producto.error && <p className="error-message">{producto.error}</p>} 

                  <button className="btn-eliminar" onClick={() => eliminarProducto(producto.pr_id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="total">Total: ${total.toFixed(2)}</h3>
            <button className="btn-comprar" onClick={finalizarCompra}>Finalizar Compra</button> 
          </div>
        )}

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
