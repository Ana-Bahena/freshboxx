import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerfilCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const us_id = localStorage.getItem('us_id');  // Usamos el ID del usuario almacenado en localStorage

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('http://localhost:5001/perfil', { params: { us_id } });
        setCliente(response.data.cliente);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    if (us_id) {
      fetchPerfil();
    }
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
