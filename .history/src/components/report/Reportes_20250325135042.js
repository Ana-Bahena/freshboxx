import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Reportes() {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/admin-dashboard");
    };

    return (
        <>
            <header className="header">
                <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
                <div className="header-left">
                    <h1>Reportes de Graficas</h1>
                </div>
                <FaHome className="icon" onClick={handleHomeClick} />
            </header>

            <style>
                {`
                .header {
                    width: 100%;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: #007bff;
                    padding: 10px 20px;
                    color: white;
                    box-sizing: border-box;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                }

                .logo {
                    height: 70px;
                }

                .header-left {
                    flex-grow: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .icon {
                    cursor: pointer;
                    font-size: 60px;
                }
                `}
            </style>
        </>
    );
}
