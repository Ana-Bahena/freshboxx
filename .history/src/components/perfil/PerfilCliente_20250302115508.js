import React, { useState, useEffect } from "react";
import axios from "axios";

const PerfilCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const us_id = localStorage.getItem("us_id"); // Obtener us_id desde localStorage

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!us_id) {
        console.error("Error: us_id no encontrado en localStorage.");
        setLoading(false);
        return;
      }

      try {
        console.log(`Solicitando perfil con us_id=${us_id}`);
        const response = await axios.get("http://localhost:5001/perfil", { params: { us_id } });

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
  }, [us_id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!cliente) {
    return <div>No se pudo obtener la información del perfil.</div>;
  }

  return (
    <div>
      <h1>Perfil del Cliente</h1>
      <p><strong>Nombre:</strong> {cliente.cl_nombre}</p>
      <p><strong>Email:</strong> {cliente.cl_email}</p>
      <p><strong>Teléfono:</strong> {cliente.cl_telefono}</p>
      <p><strong>Dirección:</strong> {cliente.cl_direccion}</p>
      <p><strong>RFC:</strong> {cliente.cl_rfc}</p>
    </div>
  );
};

export default PerfilCliente;
