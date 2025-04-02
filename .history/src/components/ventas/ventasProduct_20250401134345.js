import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ventasProduct() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5001/api/productos-mas-vendidos")
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
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

      <style>
        {`
          .header {
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #007bff;
            padding: 10px 20px;
            color: white;
            box-sizing: border-box;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
          }

          .logo {
            height: 70px;
          }

          .header-left {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .icon {
            cursor: pointer;
            font-size: 60px;
          }

          .container {
            max-width: 1200px;
            margin: 140px auto 30px auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .content {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }

          .tabla-container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            flex: 1;
          }

          .tabla {
            width: 100%;
            border-collapse: collapse;
            border: 3px solid #007bff;
          }

          .tabla th, .tabla td {
            border: 3px solid #007bff;
            padding: 12px;
            text-align: center;
          }

          .tabla th {
            background-color: #007bff;
            color: white;
          }

          .tabla tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          .tabla tr:hover {
            background-color: #e0f7fa;
          }
        `}
      </style>
    </>
  );
}

export default ventasProduct;
