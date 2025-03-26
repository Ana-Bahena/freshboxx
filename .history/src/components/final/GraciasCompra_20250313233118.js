import { useState, useEffect } from "react";

const GraciasCompra = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [cliente, setCliente] = useState(null);

  const abrirModalFactura = async () => {
    setModalOpen(true);

    // Simulando una consulta al backend
    try {
        const response = await fetch(`http://localhost:5000/cliente/${userId}`);
        const data = await response.json();
      setCliente(data);
    } catch (error) {
      console.error("Error obteniendo datos del cliente:", error);
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Gracias por tu compra!</h1>
      <p style={styles.text}>Esperamos verte de nuevo pronto.</p>
      <div style={styles.buttonContainer}>
        <button style={styles.greenButton} onClick={abrirModalFactura}>
          Solicitar Factura
        </button>
        <button style={styles.redButton} onClick={() => window.location.href = "/homes"}>
          No, Gracias
        </button>
      </div>

      {modalOpen && cliente && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Datos del Cliente</h2>
            <p><strong>Nombre:</strong> {cliente.cl_nombre}</p>
            <p><strong>Email:</strong> {cliente.cl_email}</p>
            <p><strong>Teléfono:</strong> {cliente.cl_telefono}</p>
            <p><strong>Dirección:</strong> {cliente.cl_direccion}</p>
            <p><strong>RFC:</strong> {cliente.cl_rfc}</p>
            <button style={styles.closeButton} onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos en línea
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
