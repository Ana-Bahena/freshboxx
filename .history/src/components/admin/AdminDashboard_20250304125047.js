import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

function AdminDashboard() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5 flex flex-col space-y-6 shadow-lg">
        <h2 className="text-3xl font-extrabold text-center border-b pb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          {[
            { path: "/users", label: "Gestión Usuarios" },
            { path: "/products", label: "Gestión Productos" },
            { path: "/alerts", label: "Gestión Alertas" },
            { path: "/reports", label: "Reportes" }
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`p-3 rounded-lg transition duration-300 ease-in-out ${
    activeSection === path ? "bg-blue-600" : "hover:bg-blue-700"
  }`}
              onClick={() => setActiveSection(path)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
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

function Dashboard() {
  return <h1 className="text-2xl font-bold text-gray-800">Bienvenido al Panel de Administración</h1>;
}

function Users() {
  return <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>;
}

function Products() {
  return <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>;
}

function Alerts() {
  return <h1 className="text-2xl font-bold text-gray-800">Gestión de Alertas</h1>;
}

function Reports() {
  return <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>;
}

export default AdminDashboard;
