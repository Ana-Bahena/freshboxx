import { useState, useEffect } from "react";

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/entregas") 
      .then((response) => response.json())
      .then((data) => setEntregas(data))
      .catch((error) => console.error("Error al obtener entregas:", error));
  }, []);

  return (
    <div className="container">
      <h1>Ventas Entregadas</h1>

      {/* Contenedor de la tabla */}
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
            text-align: center;
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
            border: 3px solidrgb(2, 12, 22); /* Borde exterior más grueso y azul */
          }

          .tabla th, .tabla td {
            border: 3px solidrgb(4, 135, 30); /* Borde más grueso y azul en celdas */
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
