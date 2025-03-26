import { useEffect, useState } from "react";
import axios from "axios";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome, FaEdit  } from "react-icons/fa";  
import { useNavigate } from "react-router-dom";

export default function GestionProductos() {
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();
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
        axios.get("http://localhost:5001/obtener-productos")  // Nuevo endpoint GET
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

    const handleHomeClick = () => {
        navigate("/admin-dashboard"); 
    };

    const handleEdit = (producto) => {
        console.log("Editar producto:", producto);
        // Aquí puedes implementar la lógica para abrir un modal o redirigir a la página de edición
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
            {/* Header */}
            <header className="header">
                <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
                <div className="header-left">
                    <h1>Gestión de Usuarios</h1>
                    <FaHome className="icon" onClick={handleHomeClick} />
                </div>
                
            </header>
            < 
            <h2>Lista de Productos</h2>

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
                        <th>Acciones</th>
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
                            <td>
                                <FaEdit className="edit-icon" onClick={() => handleEdit(producto)} />
                            </td>
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

            {/* Estilos dentro del mismo código */}
            <style>{`
                /* Estilos para el header */
                .header {
                    background-color: #007bff; /* Fondo oscuro */
                    color: white; /* Texto blanco */
                    padding: 20px; /* Espaciado interno */
                    text-align: center; /* Centrado del texto */
                    width: 100%; /* Abarca todo el ancho de la pantalla */
                    position: fixed; /* Fija el header en la parte superior */
                    top: 0; /* Lo coloca en la parte superior */
                    left: 0;
                    z-index: 1000; /* Asegura que esté por encima de otros elementos */
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-left {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 180px;
                }

                .container {
                    margin-top: 80px; /* Da espacio al contenido debajo del header fijo */
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color:rgb(235, 239, 240);
                }

                th, td {
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background-color:rgb(110, 151, 234);
                }

                input, textarea, select, button {
                    margin: 10px 0;
                    padding: 8px;
                    width: 100%;
                    box-sizing: border-box;
                }

                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    cursor: pointer;
                }

                button:hover {
                    background-color: #45a049;
                }

                .logo {
                    height: 50px;
                }

                .home-link {
                    color: white;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }

                .icon {
                    font-size: 44px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .icon:hover {
                    transform: scale(1.1);
                }

                .edit-icon {
                    color:rgb(10, 29, 242);
                    cursor: pointer;
                    font-size: 20px;
                    transition: transform 0.2s;
                }

                .edit-icon:hover {
                    transform: scale(1.2);
                }
            `}</style>
        </div>
    );
}
