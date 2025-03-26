import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png"; 
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ReporteVentas() {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Si las fechas son válidas, se hace la consulta con ellas
    if (fechaInicio && fechaFin) {
      fetch(`http://localhost:5001/api/reporte-ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
        .then((response) => response.json())
        .then((data) => setVentas(data))
        .catch((error) => console.error("Error al obtener reporte de ventas:", error));
    }
  }, [fechaInicio, fechaFin]);

  const handleHomeClick = () => {
    navigate("/admin-dashboard");
  };

  return (
    <>
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Reporte de Ventas</h1>
        </div>
        <FaHome className="icon" onClick={handleHomeClick} />
      </header>

      <div className="container">
        <div className="tabla-container">
          <h2>Reporte de Ventas</h2>

          <div className="filtros">
            <label>Fecha de Inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <label>Fecha de Fin:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <br/>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre del Producto</th>
                <th>Precio</th>
                <th>Cantidad Vendida</th>
                <th>Total Venta</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length > 0 ? (
                ventas.map((venta) => (
                  <tr key={venta.idProducto}>
                    <td>{venta.nombreProducto}</td>
                    <td>{venta.precio}</td>
                    <td>{venta.cantidadVendida}</td>
                    <td>{venta.totalVenta}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay ventas en el rango de fechas seleccionado.</td>
                </tr>
              )}
            </tbody>
          </table>
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
            max-width: 900px;
            margin: 140px auto 30px auto;
            padding: 20px;
            font-family: Arial, sans-serif;
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

          .filtros {
            margin-bottom: 20px;
          }

          .filtros label {
            margin-right: 10px;
          }

          .filtros input {
            margin-right: 20px;
            padding: 5px;
          }
        `}
      </style>
    </>
  );
}
