import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import freshboxLogo from "../../img/Logo Fresh Box2.png";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/usuarios");
      setUsers(response.data.usuarios);
    } catch (error) {
      console.error("Error al obtener los usuarios", error);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
      <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
        <h1>Gestión de Usuarios</h1>
          <FaHome className="icon" />
          
        </div>
        
      </header>

      {/* Tabla de Usuarios */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.us_id}>
                <td>{user.us_id}</td>
                <td>{user.us_email}</td>
                <td>{user.us_tipo}</td>
                <td>{user.us_estatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estilos en JSX (Solo en Next.js) */}
      <style jsx>{`
  .container {
    padding: 20px;
    margin-top: 80px; /* Para evitar que el contenido quede cubierto por el header fijo */
  }

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #007bff;
    color: white;
    padding: 18px;
    border-radius: 0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Asegura que el header esté por encima del contenido */
  }

  .header-content {
    flex-grow: 1; /* Permite que el título se quede centrado */
    display: flex;
    justify-content: center; /* Centra el título horizontalmente */
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon {
    font-size: 44px;
  }

  .logo {
    height: 50px;
  }

  .table-container {
    margin-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  th {
    background-color:rgb(184, 176, 177);
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f0f0f0;
  }

  tr:hover {
    background-color:rgb(243, 250, 177);
    transition: 0.3s;
  }
`}</style>

    </div>
  );
};

export default Users;
