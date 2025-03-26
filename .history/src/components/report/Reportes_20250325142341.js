import { useState, useEffect } from "react";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
            const querySnapshot = await getDocs(collection(db, "incidentes"));
            const incidentes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(incidentes);
        };
        fetchData();
    }, []);

    const filteredData = data.filter(incident => {
        if (!startDate || !endDate) return true;
        const incidentDate = new Date(incident.fecha.split("/").reverse().join("-"));
        return incidentDate >= new Date(startDate) && incidentDate <= new Date(endDate);
    });

    return (
        <>
            <header className="header">
                <img src={freshboxLogo} alt="FreshBox Logo" className="logo" />
                <div className="header-left">
                    <h1>Reportes en Graficas</h1>
                </div>
                <FaHome className="icon" onClick={handleHomeClick} />
            </header>

            <label>Fecha Inicio:
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </label>
            <label>Fecha Fin:
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
            
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="contenedor" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>

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
