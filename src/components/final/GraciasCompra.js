import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ControlCargas from "../home/Homes";

const GraciasCompra = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cliente, setCliente] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userSession"); 
    localStorage.removeItem("userType"); 
    navigate("/"); 
    window.location.reload();
  };

  const abrirModalFactura = async () => {
    setIsModalOpen(true);

    const userId = localStorage.getItem("userSession");

    if (!userId) {
      console.error("No se encontró el ID del usuario en localStorage");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/perfil?us_id=${userId}`);
      const data = await response.json();

      if (data.success) {
        setCliente(data.cliente);
      } else {
        console.error("Error obteniendo datos del cliente:", data.message);
      }
    } catch (error) {
      console.error("Error obteniendo datos del cliente:", error);
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  const irAHomes = () => {
    navigate("/homes");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userSession");
    if (!userId) {
      console.error("Error: us_id no encontrado en localStorage.");
      navigate("/");
    }
  }, [navigate]);

  const descargarFactura = async () => {
    const userId = localStorage.getItem("userSession");
  
    if (!userId) {
      console.error("No se encontró el ID del usuario.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5001/descargar-factura?us_id=${userId}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Texto del error:", errorText);
        throw new Error("No se pudo descargar la factura.");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura_${userId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la factura:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Gracias por tu compra!</h1>
      <p style={styles.text}>Esperamos verte de nuevo pronto.</p>
      <div style={styles.buttonContainer}>
        <button style={styles.greenButton} onClick={abrirModalFactura}>
          Solicitar Factura
        </button>
        <button style={styles.redButton} onClick={irAHomes}>
          No, gracias
        </button>
      </div>

      {isModalOpen && cliente && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Datos del Cliente:</h2>
            <br />
            <p><strong>Nombre:</strong> {cliente.cl_nombre}</p>
            <p><strong>Email:</strong> {cliente.cl_email}</p>
            <p><strong>Teléfono:</strong> {cliente.cl_telefono}</p>
            <p><strong>Dirección:</strong> {cliente.cl_direccion}</p>
            <p><strong>RFC:</strong> {cliente.cl_rfc}</p>
            <p><strong>Cuenta:</strong> {cliente.cl_cuenta}</p>
            <button style={styles.closeButton} onClick={cerrarModal}>Cancelar</button>
            <button style={styles.downloadButton} onClick={descargarFactura}>Descargar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: "18px",
    color: "#555",
  },
  buttonContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  greenButton: {
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  redButton: {
    padding: "12px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
  },
  downloadButton: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    marginTop: "10px",
    padding: "8px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default GraciasCompra;
