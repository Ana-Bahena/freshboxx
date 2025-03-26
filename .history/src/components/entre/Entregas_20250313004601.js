import { useState, useEffect } from "react";

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    // Simulación de datos obtenidos del backend
    fetch("http://localhost:5000/api/entregas") // Cambia la URL según tu backend
      .then((response) => response.json())
      .then((data) => setEntregas(data))
      .catch((error) => console.error("Error al obtener entregas:", error));
  }, []);

  return (
    <div className="container">
      <h1>Ventas Entregadas</h1>
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

      <style>
        {`
          .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            text-align: center;
          }

          .tabla {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .tabla th, .tabla td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }

          .tabla th {
            background-color: #007bff;
            color: white;
          }

          .tabla tr:nth-child(even) {
            background-color: #f2f2f2;
          }
        `}
      </style>
    </div>
  );
}
