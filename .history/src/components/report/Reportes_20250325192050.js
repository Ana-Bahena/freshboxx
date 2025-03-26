import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs } from "../fire/FirebaseConfig";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { IconContext } from "react-icons/lib";

export default function Reportes() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleHomeClick = () => {
        navigate("/admin-dashboard");
    };

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "incidencias"));
            console.log("DB instance:", db);
            console.log("Firestore Collection:", collection(db, "incidencias"));
            const incidencias = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(incidencias);
        };
        fetchData();
    }, []);

    const filteredData = data.filter(incident => {
        if (!startDate || !endDate) return true;
        const incidentDate = incident.fecha.toDate();
        console.log("Datos obtenidos:", data);
        //const incidentDate = new Date(incident.fecha.split("/").reverse().join("-"));
        //return incidentDate >= new Date(startDate) && incidentDate <= new Date(endDate);
        return incidentDate.getTime() >= new Date(startDate).getTime() &&
       incidentDate.getTime() <= new Date(endDate).getTime();
    });

    return (
        <div className="reportes-container">
            <header className="header">
                <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
                <div className="header-left">
                    <h1>Reportes en Gráficas</h1>
                </div>
                <FaHome className="icon" onClick={handleHomeClick} />
            </header>

            {/* Filtros */}
            <div className="filters">
                <label>
                    Fecha Inicio:
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                <label>
                    Fecha Fin:
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
            </div>

            {/* Contenedor de la gráfica */}
            <div className="chart-container">
                <h2>Incidencias por Fecha en Contenedor</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="fecha" stroke="#333" />
                        <YAxis stroke="#333" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="contenedor" stroke="#007bff" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <style>
                {`
                .reportes-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 120px;
                    background-color: #f5f5f5;
                    min-height: 100vh;
                }

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

                .filters {
                    display: flex;
                    gap: 20px;
                    margin: 20px 0;
                }

                .filters label {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                }

                .filters input {
                    margin-left: 10px;
                    padding: 5px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                .chart-container {
                    width: 90%;
                    max-width: 900px;
                    background: white;
                    padding: 0px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .chart-container h2 {
                    margin-bottom: 20px;
                    color: #007bff;
                }
                `}
            </style>
        </div>
    );
}
