import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../img/Logo Fresh Box2.png"; 
import { useNavigate } from "react-router-dom";

const PerfilCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
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
        console.log(`Solicitando perfil con us_id=${userId}`);
        const response = await axios.get("http://localhost:5001/perfil", { params: { us_id: userId } });

        if (response.data.success) {
          setCliente(response.data.cliente);
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

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("userSession"); 
    localStorage.removeItem("userType"); 
    navigate("/"); 
    window.location.reload();
  };

  // Función para editar perfil
  const handleEdit = () => {
    // Redirige a la vista de edición del perfil (asegúrate de tener creada esta ruta)
    navigate("/editar-perfil");
  };

  if (loading) return <div>Cargando...</div>;
  if (!cliente) return <div>No se pudo obtener la información del perfil.</div>;

  return (
    <div>
      {/* Header con el icono de Home */}
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

      {/* Contenedor para los datos del cliente */}
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
    </div>
  );
};

const styles = {
  mainContainer: {
    paddingTop: "20vh", 
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  },
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
    left: 0
  },
  icon: {
    marginRight: "15px"
  },
  title: {
    margin: 0,
    fontSize: "24px"
  },
  profileContainer: {
    padding: "10px"
  },
  dataContainer: {
    backgroundColor: "white",
    padding: "80px",
    margin: "40px auto",
    borderRadius: "8px",
    maxWidth: "600px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
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
    marginTop: "20px"
  },
  editIcon: {
    marginRight: "8px",
    fontSize: "18px"
  }
};

export default PerfilCliente;
