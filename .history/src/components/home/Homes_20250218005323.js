import React, { useState, useEffect } from "react";
import logo from "../../"; 
import { useNavigate } from "react-router-dom";

function Homes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = productos.filter((producto) =>
    producto.pr_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetch("http://localhost:5001/productos")
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos en React:", data);
        if (data.success) {
          setProductos(data.productos);
        } else {
          console.error("Error al obtener productos:", data.message);
        }
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  }, []);
  
  // Función para agregar al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]); // Añadir producto al carrito
  };

  return (
    <div className="home-container">
      <header className="headeer">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="header-icons">
          {/* Icono de carrito que muestra la cantidad de productos en el carrito */}
          <div className="carrito-container" onClick={() => navigate("/carrito")}>
            <i className="fas fa-shopping-cart header-icon"></i>
            <span className="carrito-cantidad">{carrito.length}</span>
          </div>

          <i className="fas fa-user header-icon"></i> {/* Icono de usuario */}
        </div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />

      </header>
      <h1 className="home-title">Bienvenido a la Tienda</h1>
      <p className="home-description">Explora nuestros productos:</p>

      <div className="productos-lista">
      {filteredProducts.map((producto) => (
        <div key={producto.pr_id} className="producto-card">
          <img
            src={producto.pr_imagen}
            alt={producto.pr_nombre}
            className="producto-imagen"
          />
          <h2 className="producto-nombre">{producto.pr_nombre}</h2>
          <p className="producto-descripcion">{producto.pr_descripcion}</p>
          <span className="producto-precio">${producto.pr_precio}</span>
          <p className="producto-cantidad">Cantidad disponible: {producto.pr_cantidad}</p>
          {/* Botón de agregar al carrito */}
          <button className="agregar-carrito-btn" onClick={() => agregarAlCarrito(producto)}>
              <i className="fas fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
      ))}
    </div>

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

export default Homes;
