import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Reportes() {

    return (
        <>
      <header className="header">
        <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
        <div className="header-left">
          <h1>Ventas Entregadas / Ventas Realizadas</h1>
        </div>
        <FaHome className="icon" onClick={handleHomeClick} />
      </header>
    );
}