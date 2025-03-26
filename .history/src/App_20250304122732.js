import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Homes from "./components/home/Homes";
import Carrito from "./components/carrito/Carrito";
import Pago from "./components/pago/Pago";
import PagoCompleto from "./components/pago/PagoCompleto";
import PerfilCliente from "./components/perfil/PerfilCliente";
import AdminDashboard from "./components/admin/AdminDashboard";  

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    const userType = localStorage.getItem("userType");
    setIsLoggedIn(!!userSession);
    setIsAdmin(userType === "admin");  // Verifica que esto esté evaluando correctamente
  }, []);
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/homes" element={isLoggedIn ? <Homes carrito={carrito} setCarrito={setCarrito} /> : <Navigate to="/" />} />
        <Route path="/carrito" element={isLoggedIn ? <Carrito carrito={carrito} setCarrito={setCarrito} /> : <Navigate to="/" />} />
        <Route path="/pago" element={isLoggedIn ? <Pago /> : <Navigate to="/" />} />
        <Route path="/pago-completo" element={isLoggedIn ? <PagoCompleto /> : <Navigate to="/" />} /> 
        <Route path="/perfil" element={isLoggedIn ? <PerfilCliente /> : <Navigate to="/" />} />  
        <Route path="/admin-dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
