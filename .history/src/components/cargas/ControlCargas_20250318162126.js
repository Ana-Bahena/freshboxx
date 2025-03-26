import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import freshboxLogo from "../../img/Logo Fresh Box2.png";

export default function ControlCargas() {
  const navigate = useNavigate();

  const [carga, setCarga] = useState({
    idConductor: "",
    idVenta: "",
    tempMax: "",
    tempMin: "",
    vibracion: "",
    humedadMax: "",
    humedadMin: "",
  });

  const [contenedor, setContenedor] = useState({
    peso: "",
    status: "Disponible",  
  });

  const [cargaContenedor, setCargaContenedor] = useState({
    idVenta: "",
    idTransportista: "",
    cantidadProductos: "",
  });

  const handleHomeClick = () => {
    navigate("/admin-dashboard");
  };

  const handleCargaChange = (e) => {
    setCarga({
      ...carga,
      [e.target.name]: e.target.value,
    });
  };

  const handleContenedorChange = (e) => {
    setContenedor({
      ...contenedor,
      [e.target.name]: e.target.value,
    });
  };

  const handleCargaContenedorChange = (e) => {
    setCargaContenedor({
      ...cargaContenedor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCarga = (e) => {
    e.preventDefault();
    console.log("Datos de carga enviados:", carga);
  };

  const handleSubmitContenedor = (e) => {
    e.preventDefault();
    console.log("Datos del contenedor enviados:", contenedor);
  };

  const handleSubmitCargaContenedor = (e) => {
    e.preventDefault();
    console.log("Datos de carga a contenedor enviados:", cargaContenedor);
  };

  return (
    <div className="container">
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Control de Cargas</h1>
          <FaHome className="icon" onClick={handleHomeClick} />
        </div>
      </header>

      <div className="forms-wrapper">
        <div className="form-container carga-form-container">
          <h2>Formulario 3: Asignar Datos de Carga</h2>
          <br />
          <form onSubmit={handleSubmitCarga} className="carga-form">
            {/*
            <input
              type="number"
              name="idconductor"
              placeholder="ID del conductor"
              value={carga.idconductor}
              onChange={handleCargaChange}
            />
            */}
            <input
              type="number"
              name="idContenedor"
              placeholder="ID de Contenedor"
              value={carga.idVenta}
              onChange={handleCargaChange}
            />
            <input
              type="number"
              name="tempMax"
              placeholder="Temperatura máxima"
              value={carga.tempMax}
              onChange={handleCargaChange}
            />
            <input
              type="number"
              name="tempMin"
              placeholder="Temperatura mínima"
              value={carga.tempMin}
              onChange={handleCargaChange}
            />
            <input
              type="number"
              name="vibracion"
              placeholder="Nivel de vibración"
              value={carga.vibracion}
              onChange={handleCargaChange}
            />
            <input
              type="number"
              name="humedadMax"
              placeholder="Humedad máxima"
              value={carga.humedadMax}
              onChange={handleCargaChange}
            />
            <input
              type="number"
              name="humedadMin"
              placeholder="Humedad mínima"
              value={carga.humedadMin}
              onChange={handleCargaChange}
            />
            <button type="submit">Guardar Carga</button>
          </form>
        </div>

        <div className="form-container contenedor-form-container">
          <h2>Formulario 1: Agregar Contenedor</h2>
          <br />
          <form onSubmit={handleSubmitContenedor} className="contenedor-form">
            <input
              type="number"
              name="peso"
              placeholder="Peso del contenedor"
              value={contenedor.peso}
              onChange={handleContenedorChange}
            />
            <select
              name="status"
              value={contenedor.status || "Disponible"}
              onChange={handleContenedorChange}
            >
              <option value="Disponible">Disponible</option>
            </select>
            <button type="submit">Guardar Contenedor</button>
          </form>
        </div>
      </div>

      <div className="form-container carga-contenedor-form-container">
        <h2>Formulario 2: Agregar Carga a Contenedor</h2>
        <br />
        <form onSubmit={handleSubmitCargaContenedor} className="carga-contenedor-form">
          <input
            type="number"
            name="idVenta"
            placeholder="ID de venta"
            value={cargaContenedor.idVenta}
            onChange={handleCargaContenedorChange}
          />
          <input
            type="number"
            name="idTransportista"
            placeholder="ID del transportista"
            value={cargaContenedor.idTransportista}
            onChange={handleCargaContenedorChange}
          />
          <input
            type="number"
            name="idContenedor"
            placeholder="ID del Contenedor"
            value={cargaContenedor.cantidadProductos}
            onChange={handleCargaContenedorChange}
          />
          <button type="submit">Guardar Carga a Contenedor</button>
        </form>
      </div>

      <style>
        {`
          .container {
            padding: 20px;
            margin-top: 85px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .header {
            background-color: #007bff;
            color: white; 
            padding: 20px; 
            text-align: center; 
            width: 100%; 
            position: fixed; 
            top: 0; 
            left: 0;
            z-index: 1000; 
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .header-left {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 150px;
          }

          .logo {
            height: 50px;
          }

          .icon {
            font-size: 44px;
            cursor: pointer;
            transition: transform 0.2s;
          }

          .forms-wrapper {
            display: flex;
            justify-content: space-around;
            width: 90%;
            max-width: 1200px;
            margin-top: 30px;
          }

          .form-container {
            width: 45%;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
          }

          .carga-form, .contenedor-form, .carga-contenedor-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .carga-contenedor-form-container {
            width: 90%;
            max-width: 600px;
          }

          input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 100%;
          }

          button {
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
          }

          button:hover {
            background-color: #218838;
          }

          select {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            width: 100%;
            background-color: white;
          }
        `}
      </style>
    </div>
  );
}
