  import React, { useState, useEffect  } from "react";
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

    useEffect(() => {
      const userId = localStorage.getItem("userSession");
      const clienteId = localStorage.getItem("clienteId");
      
      if (!userId) {
        console.error("Error: us_id no encontrado en localStorage.");
        navigate("/");
        return;
      }
      
      if (!clienteId) {
        console.error("Error: clienteId no encontrado. Redirigiendo al perfil...");
        navigate("/perfil");
        return;
      }
    }, [navigate]);

    const finalizarCompra = async () => {
      const cl_id = localStorage.getItem("clienteId");            
      const vt_idFactura = "FACT-" + Date.now(); // Generar un ID de factura único
    
      console.log("Cliente ID en carrito:", cl_id);
    
      if (!cl_id || isNaN(cl_id)) {
        alert("No se encontró información del cliente. Inicia sesión nuevamente.");
        navigate("/perfil"); // Redirigir al perfil para obtener el ID del cliente
        return;
      }
    
      const finalizarCompra = async () => {
  const cl_id = localStorage.getItem("clienteId");
  const vt_idFactura = "FACT-" + Date.now();
  
  console.log("Cliente ID en carrito:", cl_id);
  
  if (!cl_id) {
    alert("No se encontró información del cliente. Redirigiendo al perfil...");
    navigate("/perfil");
    return;
  }
  
  try {
    // Asegúrate de que cl_id sea un número
    const clienteIdNumerico = parseInt(cl_id, 10);
    
    if (isNaN(clienteIdNumerico)) {
      throw new Error("El ID del cliente no es válido");
    }
    
    const response = await axios.post("http://localhost:5001/api/finalizarcompra", {
      carrito: carrito,
      cl_id: clienteIdNumerico,
      vt_idFactura: vt_idFactura,
    });
    
    if (response.data.success) {
      alert("Compra realizada con éxito");
      setCarrito([]);
      navigate("/gracias-compra");
    } else {
      alert("Error al finalizar la compra: " + (response.data.message || "Intente nuevamente"));
    }
  } catch (error) {
    console.error("Error al finalizar compra:", error.response ? error.response.data : error.message);
    alert("Error al finalizar la compra: " + (error.response?.data?.message || error.message));
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
      <div className="carritoo-containeer">
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
          <div className="productoos-container">
            <ul className="carritoo-lista">
              {carrito.map((producto) => (
                <li key={producto.pr_id} className="carritoo-item">
                  <img src={producto.pr_imagen} alt={producto.pr_nombre} className="carritoo-imagen" />
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

