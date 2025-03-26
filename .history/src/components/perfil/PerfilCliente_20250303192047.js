import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../img/Logo Fresh Box2.png"; 
import { useNavigate } from "react-router-dom";

const PerfilCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({
    cl_nombre: "",
    cl_email: "",
    cl_telefono: "",
    cl_direccion: "",
    cl_rfc: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userSession"); // Obtener el ID del usuario
    if (!userId) {
      console.error("Error: us_id no encontrado en localStorage.");
      setLoading(false);
      navigate("/");
      return;
    }

    const fetchPerfil = async () => {
      try {
        const response = await axios.get("http://localhost:5001/perfil", { params: { us_id: userId } });

        if (response.data.success) {
          setCliente(response.data.cliente);
          setEditedData(response.data.cliente); // Seteamos los datos iniciales para editar
        } else {
          console.error("Error en la respuesta del servidor:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession"); 
    localStorage.removeItem("userType"); 
    navigate("/"); 
    window.location.reload();
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userSession");

    try {
      const response = await axios.put("http://localhost:5001/editar-perfil", { ...editedData, us_id: userId });
      if (response.data.success) {
        alert("Perfil actualizado correctamente");
        setCliente(editedData); // Actualizamos el estado con los datos editados
        setIsModalOpen(false); // Cerramos el modal
      } else {
        alert("Error al actualizar el perfil");
      }
    } catch (error) {
      console.log(error);
      console.error("Error al actualizar el perfil:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!cliente) return <div>No se pudo obtener la información del perfil.</div>;

  return (
    <div>
      <header style={styles.header}>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <h1 style={styles.title}>Perfil del Cliente</h1>
        <div className="header-icons">
          <i className="fas fa-home header-icon" onClick={() => navigate("/homes")} style={{ cursor: "pointer" }}></i>
          <i className="fas fa-sign-out-alt header-icon" onClick={handleLogout} style={styles.icon} title="Cerrar sesión"></i>
        </div>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </header>

      <div style={styles.dataContainer}>
        <p><strong>Nombre:</strong> {cliente.cl_nombre}</p>
        <p><strong>Email:</strong> {cliente.cl_email}</p>
        <p><strong>Teléfono:</strong> {cliente.cl_telefono}</p>
        <p><strong>Dirección:</strong> {cliente.cl_direccion}</p>
        <p><strong>RFC:</strong> {cliente.cl_rfc}</p>
        <button style={styles.editButton} onClick={handleEdit}>
          <i className="fas fa-edit" style={styles.editIcon}></i> Editar
        </button>
      </div>

      {/* Modal de edición */}
      {isModalOpen && (
  <div style={styles.modal}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalTitle}>Editar Perfil</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nombre:</label>
          <input
            type="text"
            name="cl_nombre"
            value={editedData.cl_nombre}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="cl_email"
            value={editedData.cl_email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Teléfono:</label>
          <input
            type="text"
            name="cl_telefono"
            value={editedData.cl_telefono}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Dirección:</label>
          <input
            type="text"
            name="cl_direccion"
            value={editedData.cl_direccion}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>RFC:</label>
          <input
            type="text"
            name="cl_rfc"
            value={editedData.cl_rfc}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.modalActions}>
          <button type="submit" style={{ ...styles.modalButton, ...styles.saveButton }}>Guardar</button>
          <button type="button" onClick={() => setIsModalOpen(false)} style={{ ...styles.modalButton, ...styles.cancelButton }}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007bff",
    padding: "20px",
    color: "white",
    borderRadius: "0px",
    width: "100vw",
    height: "15vh",
    position: "fixed",
    top: 0,
    left: 0,
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  dataContainer: {
    backgroundColor: "white",
    padding: "80px",
    margin: "40px auto",
    borderRadius: "8px",
    maxWidth: "600px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
  editIcon: {
    marginRight: "8px",
    fontSize: "18px",
  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "500px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  modalButton: {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s ease",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "white",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  }
};

export default PerfilCliente;
