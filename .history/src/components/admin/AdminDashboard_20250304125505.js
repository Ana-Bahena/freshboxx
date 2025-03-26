import { Link, Route, Routes } from "react-router-dom";
import { useState } from "react";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-5 space-y-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            to="/users"
            className={`block p-2 hover:bg-blue-600 ${activeSection === "users" ? "bg-blue-600" : ""}`}
            onClick={() => setActiveSection("users")}
          >
            Gestión Usuarios
          </Link>
          <Link
            to="/products"
            className={`block p-2 hover:bg-blue-600 ${activeSection === "products" ? "bg-blue-600" : ""}`}
            onClick={() => setActiveSection("products")}
          >
            Gestión Productos
          </Link>
          <Link
            to="/alerts"
            className={`block p-2 hover:bg-blue-600 ${activeSection === "alerts" ? "bg-blue-600" : ""}`}
            onClick={() => setActiveSection("alerts")}
          >
            Gestión Alertas
          </Link>
          <Link
            to="/reports"
            className={`block p-2 hover:bg-blue-600 ${activeSection === "reports" ? "bg-blue-600" : ""}`}
            onClick={() => setActiveSection("reports")}
          >
            Reportes
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-white rounded-lg shadow-md">
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
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