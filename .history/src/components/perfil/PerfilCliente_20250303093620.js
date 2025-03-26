import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa"; // Importamos el icono de Home
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
          </div>
      </header>

      <div style={styles.profileContainer}>
        <p><strong>Nombre:</strong> {cliente.cl_nombre}</p>
        <p><strong>Email:</strong> {cliente.cl_email}</p>
        <p><strong>Teléfono:</strong> {cliente.cl_telefono}</p>
        <p><strong>Dirección:</strong> {cliente.cl_direccion}</p>
        <p><strong>RFC:</strong> {cliente.cl_rfc}</p>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Asegura separación entre elementos
    backgroundColor: "#007bff",
    padding: "20px",
    color: "white",
    borderRadius: "0px", // Quita el borde redondeado para que cubra toda la pantalla
    width: "100vw", // 100% del ancho de la pantalla
    height: "15vh", // 100% de la altura de la pantalla
    position: "fixed", // Fija el header en la pantalla
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
  }
};



export default PerfilCliente;
