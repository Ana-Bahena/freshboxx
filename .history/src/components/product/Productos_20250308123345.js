import { useEffect, useState } from "react";
import axios from "axios";

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    pr_nombre: "",
    pr_precio: "",
    pr_cantidad: "",
    pr_descripcion: "",
    pr_imagen: "",
    pr_temperatura: "",
    pr_status: "disponible",
    pr_peso: "",
  });

  // Cargar productos desde la API
  useEffect(() => {
    axios.get("http://localhost:5001/insert-productos")
      .then((response) => {
        if (response.data.success) {
          setProductos(response.data.productos);
        }
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar nuevo producto a la API
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/insert-productos", nuevoProducto)
      .then((response) => {
        if (response.data.success) {
          setProductos([...productos, response.data.producto]);
          setNuevoProducto({
            pr_nombre: "",
            pr_precio: "",
            pr_cantidad: "",
            pr_descripcion: "",
            pr_imagen: "",
            pr_temperatura: "",
            pr_status: "disponible",
            pr_peso: "",
          });
        }
      })
      .catch((error) => console.error("Error al agregar producto:", error));
  };

  return (
    <div className="container">
      <h2>Gestión de Productos</h2>

      {/* Tabla de productos */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Temperatura</th>
            <th>Estado</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.pr_id}>
              <td>{producto.pr_id}</td>
              <td>{producto.pr_nombre}</td>
              <td>{producto.pr_precio}</td>
              <td>{producto.pr_cantidad}</td>
              <td>{producto.pr_descripcion}</td>
              <td>
                {producto.pr_imagen ? (
                  <img src={producto.pr_imagen} alt={producto.pr_nombre} width="50" />
                ) : (
                  "No imagen"
                )}
              </td>
              <td>{producto.pr_temperatura || "N/A"}</td>
              <td>{producto.pr_status}</td>
              <td>{producto.pr_peso}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario para agregar producto */}
      <h3>Agregar Nuevo Producto</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="pr_nombre" placeholder="Nombre" value={nuevoProducto.pr_nombre} onChange={handleChange} required />
        <input type="number" name="pr_precio" placeholder="Precio" value={nuevoProducto.pr_precio} onChange={handleChange} required />
        <input type="number" name="pr_cantidad" placeholder="Cantidad" value={nuevoProducto.pr_cantidad} onChange={handleChange} required />
        <textarea name="pr_descripcion" placeholder="Descripción" value={nuevoProducto.pr_descripcion} onChange={handleChange}></textarea>
        <input type="text" name="pr_imagen" placeholder="URL Imagen" value={nuevoProducto.pr_imagen} onChange={handleChange} />
        <input type="number" step="0.1" name="pr_temperatura" placeholder="Temperatura (opcional)" value={nuevoProducto.pr_temperatura} onChange={handleChange} />
        <select name="pr_status" value={nuevoProducto.pr_status} onChange={handleChange}>
          <option value="disponible">Disponible</option>
          <option value="agotado">Agotado</option>
        </select>
        <input type="number" step="0.1" name="pr_peso" placeholder="Peso" value={nuevoProducto.pr_peso} onChange={handleChange} required />
        <button type="submit">Agregar Producto</button>
      </form>
    </div>
  );
}
