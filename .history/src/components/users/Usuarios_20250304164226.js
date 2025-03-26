import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
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
    <div>
      <h2>Gestión de Usuarios</h2>
      <table border="1">
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
  );
};

export default Usuarios;
