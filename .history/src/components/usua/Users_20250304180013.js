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
    <div className="p-4">
      {/* Header */}
      <header className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <FaHome className="text-2xl" />
          <h1 className="text-xl font-semibold">Gestión de Usuarios</h1>
        </div>
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
      </header>

      {/* Tabla de Usuarios */}
      <div className="mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.us_id} className="text-center">
                <td className="border p-2">{user.us_id}</td>
                <td className="border p-2">{user.us_email}</td>
                <td className="border p-2">{user.us_tipo}</td>
                <td className="border p-2">{user.us_estatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx></style>
    </div>
  );
};

export default Users;
