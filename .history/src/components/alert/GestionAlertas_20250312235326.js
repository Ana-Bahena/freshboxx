import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHome, FaTrashAlt, FaEdit } from "react-icons/fa";
import freshboxLogo from "../../img/Logo Fresh Box2.png";

export default function GestionAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertaEdit, setAlertaEdit] = useState(null);
  const [nuevaAlerta, setNuevaAlerta] = useState({
    mensaje: "",
    tipo: "", 
    estado: "activa", 
    idCarga: "",
  });
  const navigate = useNavigate();

  // Cargar alertas desde la API
  useEffect(() => {
    axios
      .get("http://localhost:5001/alertas")
      .then((response) => {
        if (response.data.success) {
          setAlertas(response.data.alertas);
        }
      })
      .catch((error) => console.error("Error al obtener alertas:", error));
  }, []);

  const handleHomeClick = () => {
    navigate("/admin-dashboard"); 
  };

  const handleChange = (e) => {
    setNuevaAlerta({
      ...nuevaAlerta,
      [e.target.name]: e.target.value,
    });
  };

  // Agregar nueva alerta
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/alertas", nuevaAlerta)
      .then((response) => {
        if (response.data.success) {
          setAlertas([...alertas, response.data.alerta]);
          setNuevaAlerta({ mensaje: "", tipo: "informativa", estado: "activa", idCarga: "", });
        }
      })
      .catch((error) => console.error("Error al agregar alerta:", error));
  };

  // Editar alerta
  const handleEdit = (alerta) => {
    setAlertaEdit(alerta);
    setModalOpen(true);
  };

  // Actualizar alerta
  const handleUpdate = () => {
    axios
      .put(`http://localhost:5001/alertas/${alertaEdit.id}`, alertaEdit)
      .then((response) => {
        if (response.data.success) {
          setAlertas(
            alertas.map((a) => (a.id === alertaEdit.id ? alertaEdit : a))
          );
          setModalOpen(false);
        }
      })
      .catch((error) => console.error("Error al actualizar alerta:", error));
  };

  // Eliminar alerta
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5001/alertas/${id}`)
      .then((response) => {
        if (response.data.success) {
          setAlertas(alertas.filter((alerta) => alerta.id !== id));
        }
      })
      .catch((error) => console.error("Error al eliminar alerta:", error));
  };

  return (
    <div className="container">
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Gestión de Alertas</h1>
          <FaHome className="icon" onClick={handleHomeClick} />
        </div>
      </header>

      <div className="form-container">
        {/* Formulario para agregar alerta */}
        <form onSubmit={handleSubmit} className="alert-form">
          <h2>Agregar Alerta</h2>
          <br/>
          <input
            type="text"
            name="mensaje"
            placeholder="Escribe el mensaje de la alerta"
            value={nuevaAlerta.mensaje}
            onChange={handleChange}
          />
          <select
            name="tipo"
            value={nuevaAlerta.tipo}
            onChange={handleChange}
          >
            <option value="aumento">Aumento</option>
            <option value="disminucion">Disminucion</option>
          </select>
          <select
            name="estado"
            value={nuevaAlerta.estado}
            onChange={handleChange}
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
          <input
            type="text"
            name="idCarga"
            placeholder="ID de carga"
            value={nuevaAlerta.idCarga}
            onChange={handleChange}
          />
          <button type="submit">Agregar Alerta</button>
        </form>
      </div>

      {/* Lista de alertas */}
      <div className="alert-list">
        {alertas.map((alerta) => (
          <div key={alerta.id} className={`alerta ${alerta.estado}`}>
            <div className="alerta-info">
              <p>{alerta.mensaje}</p>
              <span className={`alerta-${alerta.tipo}`}>{alerta.tipo}</span>
              <p><strong>ID de carga:</strong> {alerta.idCarga}</p>
            </div>
            <div className="alerta-actions">
              <button onClick={() => handleEdit(alerta)}>
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(alerta.id)}>
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para editar alerta */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Alerta</h3>
            <select
              name="estado"
              value={alertaEdit.estado}
              onChange={(e) =>
                setAlertaEdit({ ...alertaEdit, estado: e.target.value })
              }
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </select>
            <button onClick={handleUpdate}>Actualizar</button>
            <button onClick={() => setModalOpen(false)}>Cerrar</button>
          </div>

          
        </div>
      )}

      <div className="table-container">
        <h2>Lista de Alertas</h2>
        <table>
          <thead>
            <tr>
              <th>ID Alerta</th>
              <th>ID Carga</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((alerta) => (
              <tr key={alerta.id}>
                <td>{alerta.id}</td>
                <td>{alerta.idCarga}</td>
                <td>{alerta.estado}</td>
                <td>
                <button onClick={() => setAlertaEdit(alerta) & setModalOpen(true)}>
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      
      <style>
        {`
          .container {
            padding: 10px;
            margin-top: 85px;
            display: flex;
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

          .alert-form {
            margin-bottom: 20px;
          }

          .alert-form input,
          .alert-form select {
            margin: 5px 0;
            padding: 8px;
            width: 100%;
          }

          .alert-list .alerta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            margin-top: 40px;
          }

          .alerta-info {
            flex: 1;
          }

          .alert-actions {
            display: flex;
            gap: 10px;
          }

          .alerta-aumento {
            background-color: #fff3e0;
          }

          .alerta-disminucion {
            background-color: #ffcdd2;
          }

          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            width: 400px;
          }

          button {
            padding: 10px;
            margin: 5px;
            background-color:rgb(81, 228, 96);
          }

          .form-container {
            max-width: 300px;
            margin: 20px auto;
            padding: 20px;
            background-color:rgb(236, 233, 233);
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
          }

          .table-container {
            margin: 20px auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #007bff;
            color: white;
          }
          button {
            margin: 5px;
            padding: 5px 10px;
            cursor: pointer;
          } 
        `}
      </style>
    </div>
  );
}

