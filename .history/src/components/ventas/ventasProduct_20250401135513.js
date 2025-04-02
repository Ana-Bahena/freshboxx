import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VentasProduct() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/productos-mas-vendidos")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos más vendidos:", error);
      });
  }, []);

  return (
    <>
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Productos más Vendidos</h1>
        </div>
        <FaHome className="icon" onClick={() => navigate("/admin-dashboard")} />
      </header>

      <div className="container">
        <div className="content">
          <div className="tabla-container">
            <h2>Top 5 Productos más Vendidos</h2>
            <br />
            <table className="tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Total Vendido</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.pr_nombre}</td>
                    <td>{producto.total_vendido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
