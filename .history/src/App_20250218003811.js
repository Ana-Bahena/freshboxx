import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from ".";
import Home from "./componentes/Home";  
import Homes from "./componentes/Homes"; 
import Carrito from "./componentes/Carrito";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    setIsLoggedIn(!!userSession);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
       <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/homes" element={isLoggedIn ? <Homes /> : <Navigate to="/login" />} />
        <Route path="/carrito" element={isLoggedIn ? <Carrito carrito={carrito} setCarrito={setCarrito} /> : <Navigate to="/login" />} /> 
      </Routes>
    </Router>
  );
}

export default App;
