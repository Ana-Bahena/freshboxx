import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png"; // Asegúrate de que la ruta sea correcta
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/entregas")
      .then((response) => response.json())
      .then((data) => setEntregas(data))
      .catch((error) => console.error("Error al obtener entregas:", error));
  }, []);

  const handleHomeClick = () => {
    navigate("/admin-dashboard");
  };

  return (
    <div className="container">
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Ventas Entregadas</h1>
          <FaHome className="icon" onClick={handleHomeClick} />
        </div>
      </header>

      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>ID Contenedor</th>
              <th>Fecha de Entrega</th>
            </tr>
          </thead>
          <tbody>
            {entregas.length > 0 ? (
              entregas.map((entrega) => (
                <tr key={entrega.idVenta}>
                  <td>{entrega.idVenta}</td>
                  <td>{entrega.idContenedor}</td>
                  <td>{entrega.fechaEntrega}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No hay entregas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .container {
            max-width: 900px;
            margin: 30px auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #007bff;
            padding: 10px 20px;
            border-radius: 10px;
            color: white;
          }

          .logo {
            height: 60px;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .icon {
            cursor: pointer;
            font-size: 24px;
          }

          .tabla-container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            margin-top: 20px;
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
    </div>
  );
}
