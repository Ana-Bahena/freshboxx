  import freshboxLogo from "../../img/Logo Fresh Box2.png";
  import { Link, Route, Routes, useNavigate } from "react-router-dom";
  import { useState } from "react";
  import { FiLogOut } from "react-icons/fi"; 
  import Productos from "../product/Productos";
  //import GestionAlertas from "../alert/GestionAlertas";
  import ControlCargas from "../cargas/ControlCargas";
  import Entregas from "../entre/Entregas";
  import Reportes from "../report/Reportes";

  function AdminDashboard({ handleLogout }) {

    const logout = async () => {  // Nuevo nombre de la función
      const userSession = localStorage.getItem("userSession");
  
      if (userSession) {
        try {
          await axios.post("http://localhost:5001/logout", {
            userId: userSession,
            deviceId: deviceId,  // deviceId no está definido en tu código
          });
  
          localStorage.removeItem("userSession");
          localStorage.removeItem("userType");
  
          setIsLoggedIn(false);
          setUserType(null);
  
          navigate("/login");
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
  
          localStorage.removeItem("userSession");
          localStorage.removeItem("userType");
          setIsLoggedIn(false);
          setUserType(null);
          navigate("/");
        }
      }
  };
      useEffect(() => {
        const userSession = localStorage.getItem("userSession");
        const storedUserType = localStorage.getItem("userType");
      
        if (userSession) {
          setIsLoggedIn(true);
          setUserType(storedUserType);
        }
      }, [setIsLoggedIn]);

    const [activeSection, setActiveSection] = useState("dashboard");

    return (
      <div className="container">
        <div className="sidebar">
          <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
          <h2 className="title">Admin Panel</h2>
          <nav className="nav">
          <Link to="/usuarios"
            className={`nav-link ${activeSection === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveSection("usuarios")}>
            Gestión de Usuarios
          </Link>

            <Link to="/productos"
              className={`nav-link ${activeSection === "productos" ? "active" : ""}`}
              onClick={() => setActiveSection("productos")}>
              Gestión Productos
            </Link>
            <Link to="/control-cargas" className={`nav-link ${activeSection === "loads" ? "active" : ""}`} onClick={() => setActiveSection("loads")}>
              Control de Cargas
            </Link>

            <Link to="/deliveries" className={`nav-link ${activeSection === "deliveries" ? "active" : ""}`} onClick={() => setActiveSection("deliveries")}>
              Entregas
            </Link>
            <Link to="/reportes"
              className={`nav-link ${activeSection === "reportes" ? "active" : ""}`}
              onClick={() => setActiveSection("reportes")}>
              Reportes
            </Link>
{/*}
            <button className="logout-button" onClick={handleLogout}>
              <FiLogOut size={24} color="#ffffff" />
            </button>
            */}
            {/* Botón para cerrar sesión - Opcional, puede estar en otra parte de la aplicación */}
            {/*}
        {localStorage.getItem("userSession") && (
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={handleLogout} 
              className="login-button" 
              style={{ backgroundColor: '#d32f2f' }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
          */}
          </nav>
        </div>

        <div className="content">
          <Routes>
            <Route path="/usuarios" element={<Users />} />
            <Route path="/productos" element={<Productos />} />
            {/*
            <Route path="/alertas" element={<GestionAlertas />} />
            */}
            <Route path="/control-cargas" element={<ControlCargas />} />
            <Route path="/deliveries" element={<Entregas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>

      <style>{`
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
          max-width: 160px;
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
        .logout-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 7px;
          font-size: 14px;
          transition: transform 0.2s ease-in-out;
        }
        .logout-button:hover {
          transform: scale(1.1);
        }
        .logout-button {
          width: 40px;
          height: 40px;
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

function Deliveries() { 
  return <h1 className="text-2xl font-bold">Entregas</h1>;
}

function Reports() {
  return <h1 className="text-2xl font-bold">Reportes</h1>;
}

export default AdminDashboard;