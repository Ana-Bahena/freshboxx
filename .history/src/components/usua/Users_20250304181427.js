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
        <div className="header-left">
          <FaHome className="icon" />
          <h1>Gestión de Usuarios</h1>
        </div>
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
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
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #007bff;
          color: white;
          padding: 5px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          font-size: 24px;
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
          background-color: #b0b4b8;
          font-weight: bold;
        }

        tr:nth-child(even) {
          background-color: #f0f0f0;
        }

        tr:hover {
          background-color: #e0e0e0;
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default Users;
