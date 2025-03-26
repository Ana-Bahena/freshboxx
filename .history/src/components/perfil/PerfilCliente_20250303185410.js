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
    position: "relative", // Hacer que el contenido de perfil no se superponga con la cabecera fija
  },
  editButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  editButtonHover: {
    backgroundColor: "#0056b3", // Cambiar color al hacer hover
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
    opacity: 0,
    transition: "opacity 0.3s ease",
    visibility: "hidden",
  },
  modalOpen: {
    opacity: 1,
    visibility: "visible",
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
  },
};

export default Perf;

