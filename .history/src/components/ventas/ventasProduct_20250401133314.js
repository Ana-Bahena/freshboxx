import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0); 
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/admin-dashboard");
  };

  return (
    <>
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Productos mas Vendidos</h1>
        </div>
        <FaHome className="icon" onClick={handleHomeClick} />
      </header>

      <div className="container">
        <div className="content">
          <div className="tabla-container">
            <h2>Productos mas vendidos</h2>
            <br />
            <table className="tabla">
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

          .tabla-container.reporte {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            height: 350px; 
            overflow-y: auto;
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
            display: flex;
            justify-content: space-between;  
            gap: 10px; 
            margin-bottom: 15px;
          }

          .filtros-datos {
            display: flex;
            align-items: center; 
          }

          .filtros label {
            margin-right: 5px;
          }

          .filtros input {
            padding: 5px;
          }

          .total-ingresos {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
          }
        `}
      </style>
    </>
  );
}
