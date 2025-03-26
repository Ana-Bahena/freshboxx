import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import Homes from "./componentes/home/Homes"; 

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
        <Route path="/homes" element={isLoggedIn ? <Homes /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
