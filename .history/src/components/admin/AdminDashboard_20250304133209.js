import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <h2 className="title">Admin Panel</h2>
        <nav className="nav">
          <Link
            to="/users"
            className={`nav-link ${activeSection === "users" ? "active" : ""}`}
            onClick={() => setActiveSection("users")}
          >
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
          <Link
            to="/reports"
            className={`nav-link ${activeSection === "reports" ? "active" : ""}`}
            onClick={() => setActiveSection("reports")}
          >
            Reportes
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="content">
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/alerts" element={<Alerts />} />
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

function Reports() {
  return <h1 className="text-2xl font-bold">Reportes</h1>;
}

export default AdminDashboard;
