import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { db, collection, addDoc } from "../fire/FirebaseConfig";

export default function ControlCargas() {
  const navigate = useNavigate();

  const [carga, setCarga] = useState({
    idContenedor: "",
    tempMax: "",
    tempMin: "",
    vibracion: "",
    humedadMax: "",
    humedadMin: "",
  });

  const [contenedor, setContenedor] = useState({
    peso: "",
    status: "Disponible",
    cantidad: 0  
  });

  const [cargaContenedor, setCargaContenedor] = useState({
    idVenta: "",
    idTransportista: "",
    cantidadProductos: "",
  });

  const [contenedores, setContenedores] = useState([]);

  const obtenerContenedores = async () => {
    try {
      const response = await fetch("http://localhost:5001/contenedores");
      const data = await response.json();
      setContenedores(data);
    } catch (error) {
      console.error("Error al obtener contenedores:", error);
    }
  };

  useEffect(() => {
    obtenerContenedores();
  }, []);

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

  const handleSubmitCarga = async (e) => {
    e.preventDefault();
  
    try {
      await addDoc(collection(db, "cargas"), carga);
  
      alert("Datos de carga guardados correctamente en Firebase.");
      setCarga({
        idContenedor: "",
        tempMax: "",
        tempMin: "",
        vibracion: "",
        humedadMax: "",
        humedadMin: "",
      });
    } catch (error) {
      console.error("Error al guardar los datos en Firebase:", error);
      alert("Ocurrió un error al guardar la carga. Intenta nuevamente.");
    }
  };
  
  const handleSubmitContenedor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/agregar-contenedor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       // body: JSON.stringify({ ...contenedor, cantidad: 0 }),
        body: JSON.stringify(contenedor),
      });      
      
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setContenedor({
          peso: "",
          status: "Disponible",
          cantidad: 0,
        });
        obtenerContenedores();
      } else {
        alert("Error al agregar contenedor: " + data.message);
      }
    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
  };

  const handleSubmitCargaContenedor = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5001/agregar-carga-contenedor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cargaContenedor),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCargaContenedor({
          idVenta: "",
          idTransportista: "",
          idContenedor: "",
          cantidadProductos: "",
        });
        obtenerContenedores();
      } else {
        alert("Error al agregar carga al contenedor: " + data.message);
      }
    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
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
      <div className="form-container carga-form-container center">
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
            value={contenedor.status}
            onChange={handleContenedorChange}
          >
            <option value="Disponible">Disponible</option>
            <option value="No Disponible">No Disponible</option>
          </select>
          <button type="submit">Guardar Contenedor</button>
        </form>
      </div>

        <div className="form-container carga-contenedor-form-container center">
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
              value={cargaContenedor.idContenedor}
              onChange={handleCargaContenedorChange}
            />
            <input
              type="number"
              name="cantidadProductos"
              placeholder="Cantidad de productos"
              value={cargaContenedor.cantidadProductos}
              onChange={handleCargaContenedorChange}
            />
            <button type="submit">Guardar Carga a Contenedor</button>
          </form>
        </div>

        <div className="form-container carga-form-container center ">
          <h2>Formulario 3: Asignar Datos de Carga</h2>
          <br />
          <form onSubmit={handleSubmitCarga} className="carga-form">
            <input
              type="number"
              name="idContenedor"
              placeholder="ID de Contenedor"
              value={carga.idContenedor}
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
              placeholder="Nivel Maximo de vibración"
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
            {/*
            <input
              type="number"
              name="humedadMin"
              placeholder="Humedad mínima"
              value={carga.humedadMin}
              onChange={handleCargaChange}
            />
            */}
            <button type="submit">Guardar Carga</button>
          </form>
        </div>

        <div className="contenedores-table center">
          <h2>Lista de Contenedores</h2>
          <table>
            <thead>
              <tr>
                <th>ID Contenedor</th>
                <th>Peso</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contenedores.map((contenedor) => (
                <tr key={contenedor.ct_id}>
                  <td>{contenedor.ct_id}</td>
                  <td>{contenedor.ct_peso}</td>
                  <td>{contenedor.ct_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            position: absolute;
            right: 40px;
          }

          .forms-wrapper {
            display: flex;
            justify-content: space-between;
            width: 90%;
            max-width: 1200px;
            margin-top: 30px;
            gap: 1px;
            flex-wrap: wrap;
          }

          .form-container {
            width: 30%;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 18px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
            box-sizing: border-box;
          }

          .left {
            order: 1;
          }

          .center {
            order: 2;
            text-align: center;
          }

          .right {
            order: 3;
            text-align: right;
          }

          .carga-form, .contenedor-form, .carga-contenedor-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
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

          .contenedores-table {
            margin-top: 40px;
            text-align: center;
          }

          .contenedores-table table {
            width: 80%;
            margin: auto;
            border-collapse: collapse;
          }

          .contenedores-table th, .contenedores-table td {
            border: 1px solid #ddd;
            padding: 10px;
          }

          .contenedores-table th {
            background-color: #f2f2f2;
          }

        `}
      </style>
    </div>
  );
}
