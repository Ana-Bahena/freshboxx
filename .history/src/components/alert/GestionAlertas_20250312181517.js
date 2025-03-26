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
    tipo: "informativa", // "informativa", "advertencia", "error"
    estado: "activa", // "activa", "leída"
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
          setNuevaAlerta({ mensaje: "", tipo: "informativa", estado: "activa" });
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

      {/* Formulario para agregar alerta */}
      <form onSubmit={handleSubmit} className="alert-form">
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
          <option value="informativa">Informativa</option>
          <option value="advertencia">Advertencia</option>
          <option value="error">Error</option>
        </select>
        <select
          name="estado"
          value={nuevaAlerta.estado}
          onChange={handleChange}
        >
          <option value="activa">Activa</option>
          <option value="leída">Leída</option>
        </select>
        <button type="submit">Agregar Alerta</button>
      </form>

      {/* Lista de alertas */}
      <div className="alert-list">
        {alertas.map((alerta) => (
          <div key={alerta.id} className={`alerta ${alerta.estado}`}>
            <div className="alerta-info">
              <p>{alerta.mensaje}</p>
              <span className={`alerta-${alerta.tipo}`}>{alerta.tipo}</span>
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
            <input
              type="text"
              name="mensaje"
              value={alertaEdit.mensaje}
              onChange={(e) =>
                setAlertaEdit({ ...alertaEdit, mensaje: e.target.value })
              }
            />
            <select
              name="tipo"
              value={alertaEdit.tipo}
              onChange={(e) =>
                setAlertaEdit({ ...alertaEdit, tipo: e.target.value })
              }
            >
              <option value="informativa">Informativa</option>
              <option value="advertencia">Advertencia</option>
              <option value="error">Error</option>
            </select>
            <select
              name="estado"
              value={alertaEdit.estado}
              onChange={(e) =>
                setAlertaEdit({ ...alertaEdit, estado: e.target.value })
              }
            >
              <option value="activa">Activa</option>
              <option value="leída">Leída</option>
            </select>
            <button onClick={handleUpdate}>Actualizar</button>
            <button onClick={() => setModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <style>
        {`
          .container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
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
          }

          .alerta-info {
            flex: 1;
          }

          .alert-actions {
            display: flex;
            gap: 10px;
          }

          .alerta-informativa {
            background-color: #e1f5fe;
          }

          .alerta-advertencia {
            background-color: #fff3e0;
          }

          .alerta-error {
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
          }
        `}
      </style>
    </div>
  );
}

