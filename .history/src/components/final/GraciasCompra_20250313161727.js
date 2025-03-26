import { useNavigate } from "react-router-dom";

const GraciasCompra = () => {
  const navigate = useNavigate();

  const solicitarFactura = () => {
    navigate("/factura"); // Redirige a la página de factura
  };

  const noGracias = () => {
    navigate("/homes"); // Redirige a la vista de Home
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Gracias por tu compra!</h1>
      <p style={styles.text}>Esperamos verte de nuevo pronto.</p>
      <div style={styles.buttonContainer}>
        <button style={styles.greenButton} onClick={solicitarFactura}>
          Solicitar Factura
        </button>
        <button style={styles.redButton} onClick={noGracias}>
          No, Gracias
        </button>
      </div>
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
};

export default GraciasCompra;
