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
          <Link to="/users" className={`nav-link ${activeSection === "users" ? "active" : ""}`} onClick={() => setActiveSection("users")}>
            Gestión Usuarios
          </Link>
          <Link to="/products" className={`nav-link ${activeSection === "products" ? "active" : ""}`} onClick={() => setActiveSection("products")}>
            Gestión Productos
          </Link>
          <Link to="/alerts" className={`nav-link ${activeSection === "alerts" ? "active" : ""}`} onClick={() => setActiveSection("alerts")}>
            Gestión Alertas
          </Link>
          <Link to="/reports" className={`nav-link ${activeSection === "reports" ? "active" : ""}`} onClick={() => setActiveSection("reports")}>
            Reportes
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
        </nav>
      </div>

      {/* Main Content */}
      <div className="content">
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/loads" element={<Loads />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
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

function Loads() {
  return <h1 className="text-2xl font-bold">Control de Cargas</h1>;
}

function Notifications() {
  return <h1 className="text-2xl font-bold">Notificaciones</h1>;
}

function Deliveries() {
  return <h1 className="text-2xl font-bold">Entregas</h1>;
}

export default AdminDashboard;
