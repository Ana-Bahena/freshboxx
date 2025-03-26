import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión, por ejemplo, limpiar el localStorage y redirigir al login
    localStorage.removeItem("user"); 
    window.location.href = "/";
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <h2 className="title">Admi Panel</h2>
        <nav className="nav">
          <Link to="/users"
            className={`nav-link ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}>
            Gestión Usuarios
          </Link>
          <Link to="/products"
            className={`nav-link ${activeSection === "products" ? "active" : ""}`}
            onClick={() => setActiveSection("products")}>
            Gestión Productos
          </Link>
          <Link to="/alerts"
            className={`nav-link ${activeSection === "alerts" ? "active" : ""}`}
            onClick={() => setActiveSection("alerts")}
          >
            Gestión Alertas
          </Link>
          <Link to="/loads" className={`nav-link ${activeSection === "loads" ? "active" : ""}`} onClick={() => setActiveSection("loads")}>
            Control de Cargas
          </Link>
          <Link to="/notifications" className={`nav-link ${activeSection === "notifications" ? "active" : ""}`} onClick={() => setActiveSection("notifications")}>
            Notificaciones
          </Link>
          <Link to="/deliveries" className={`nav-link ${activeSection === "deliveries" ? "active" : ""}`} onClick={() => setActiveSection("deliveries")}>
            Entregas
          </Link>
          <Link to="/reports"
            className={`nav-link ${activeSection === "reports" ? "active" : ""}`}
            onClick={() => setActiveSection("reports")}>
            Reportes
          </Link>
          <h3>&copy; 2025 FreshBox. Todos los derechos reservados.</h3>
        </nav>
      </div>

      {/* Main Content */}
        <div className="content">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/loads" element={<Loads />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>

      {/* Estilos internos */}
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: #f4f4f4;
        }
        .sidebar {
          width: 250px;
          background-color: #1e3a8a;
          color: white;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo {
          width: 100%;
          max-width: 180px;
          margin-bottom: 15px;
        }
        .title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .nav {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .nav-link {
          display: block;
          padding: 12px;
          margin-bottom: 5px;
          background: none;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
          text-align: center;
        }
        .nav-link:hover {
          background-color: #2563eb;
        }
        .active {
          background-color: #2563eb;
        }
        .content {
          flex: 1;
          padding: 30px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer {
          background-color: #1e3a8a;
          color: white;
          text-align: center;
          padding: 15px;
          font-size: 14px;
        }
        h3 {
          font-size:10px;
          font-weight: normal; 
          color: #ffffff; 
          text-align: center; 
          margin: 5px 0; 
        }
      `}</style>
    </div>
  );
}

function Dashboard() {
  return <h1 className="text-2xl font-bold">Bienvenido al Panel de Administración</h1>;
}

function Users() {
  return <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>;
}

function Products() {
  return <h1 className="text-2xl font-bold">Gestión de Productos</h1>;
}

function Alerts() {
  return <h1 className="text-2xl font-bold">Gestión de Alertas</h1>;
}

function Loads() {
  return <h1 className="text-2xl font-bold">Control de Cargas</h1>;
}

function Notifications() {
  return <h1 className="text-2xl font-bold">Notificaciones</h1>;
}

function Deliveries() {
  return <h1 className="text-2xl font-bold">Entregas</h1>;
}

function Reports() {
  return <h1 className="text-2xl font-bold">Reportes</h1>;
}

export default AdminDashboard;
