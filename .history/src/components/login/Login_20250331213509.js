import React, { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import DeviceDetector from "device-detector-js";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rfc, setRfc] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState(null);
  const [deviceId, setDeviceId] = useState("");

  // Generar un ID de dispositivo único
  useEffect(() => {
    const generateDeviceId = () => {
      const detector = new DeviceDetector();
      const userAgent = navigator.userAgent;
      const device = detector.parse(userAgent);
      /*
      // Crear un identificador basado en información disponible del dispositivo
      const browserInfo = device.client?.name || 'unknown_browser';
      const osInfo = device.os?.name || 'unknown_os';
      const deviceInfo = device.device?.type || 'unknown_device';
      
      // Generar un ID único basado en datos disponibles y una marca de tiempo
      const randomPart = Math.random().toString(36).substring(2, 10);
      const timestamp = new Date().getTime().toString(36);
      */
      const generatedId = `${browserInfo}_${osInfo}_${deviceInfo}_${randomPart}_${timestamp}`;
      localStorage.setItem('deviceId', generatedId);
      return generatedId;
    };
    
    // Usar ID existente o generar uno nuevo
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = generateDeviceId();
      setDeviceId(newDeviceId);
    }
  }, []);

  // Configurar heartbeat para mantener la sesión activa
  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    if (userSession && deviceId) {
      // Función para enviar heartbeat al servidor
      const sendHeartbeat = () => {
        axios.post("http://localhost:5001/heartbeat", {
          userId: userSession,
          deviceId: deviceId
        }).catch(err => {
          console.error("Error en heartbeat:", err);
        });
      };
      /*
      // Enviar heartbeat cada 5 minutos
      const heartbeatInterval = setInterval(sendHeartbeat, 5 * 60 * 1000);
      
      // Limpiar intervalo al desmontar
      return () => clearInterval(heartbeatInterval);
    }
  }, [deviceId]);

  const handleGoogleLoginSuccess = async (response) => {
    try {
      // Verificar primero si ya existe una sesión activa
      const userSession = localStorage.getItem("userSession");
      if (userSession) {
        setErrors({ login: "Ya tienes una sesión activa en este dispositivo" });
        return;
      }
      
      const decoded = jwtDecode(response.credential);
      const res = await axios.post("http://localhost:5001/google", {
        token: response.credential,
        deviceId: deviceId
      });        

      if (res.data.success) {
        localStorage.setItem("userSession", res.data.user.us_id);
        localStorage.setItem("userType", res.data.user.us_tipo);
        setIsLoggedIn(true);
        setUserType(res.data.user.us_tipo);
      } else {
        if (res.data.code === "session_exists") {
          setErrors({ 
            login: "Tienes una sesión activa en otro dispositivo. Cierra la otra sesión para continuar." 
          });
        } else {
          setErrors({ 
            login: "No se encontró un usuario registrado con este correo electrónico" 
          });
        }
      }
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
      setErrors({ 
        login: "Error al iniciar sesión con Google. Intente de nuevo." 
      });
    }
  };
  
  // Validaciones
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validatePhone = (telefono) => /^\d{10}$/.test(telefono);
  const validateRFC = (rfc) => /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/.test(rfc);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email, password);
    
    // Verificar si ya tenemos una sesión activa en este dispositivo
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      setErrors({ login: "Ya tienes una sesión activa en este dispositivo" });
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/login", { 
        email,
        password,
        deviceId
      });
      
      console.log("Respuesta del servidor:", response.data);
  
      if (response.data.success) {
        localStorage.setItem("userSession", response.data.us_id);
        localStorage.setItem("userType", response.data.us_tipo);
        console.log("Tipo de usuario guardado:", response.data.us_tipo); 
        setIsLoggedIn(true);
        setUserType(response.data.us_tipo);
      } else {
        if (response.data.code === "session_exists") {
          setErrors({ 
            login: "Tienes una sesión activa en otro dispositivo. Cierra la otra sesión para continuar." 
          });
        } else {
          setErrors({ login: "Usuario o contraseña incorrectos" });
        }
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrors({ login: "Error al conectar con el servidor" });
    }
  };

  const handleLogout = async () => {
    const userSession = localStorage.getItem("userSession");
    
    if (userSession) {
      try {
        // Enviar solicitud de logout al servidor
        await axios.post("http://localhost:5001/logout", { 
          userId: userSession,
          deviceId: deviceId
        });
        
        // Limpiar almacenamiento local
        localStorage.removeItem("userSession");
        localStorage.removeItem("userType");
        
        // Actualizar estado
        setIsLoggedIn(false);
        setUserType(null);
        
        // Redirigir
        navigate("/login"); 
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        
        // Incluso si hay error, limpiamos localmente
        localStorage.removeItem("userSession");
        localStorage.removeItem("userType");
        setIsLoggedIn(false);
        setUserType(null);
        navigate("/");
      }
    }
  };
  
  // Verificar sesión al cargar
  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    const storedUserType = localStorage.getItem("userType");

    if (userSession) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    }
  }, [setIsLoggedIn]);

  // Redirigir según tipo de usuario
  useEffect(() => {
    console.log("Verificando userType:", userType);
    if (userType) {
      if (userType === "admin") {
        console.log("Redirigiendo a /admin-dashboard");
        navigate("/admin-dashboard");
      } else if (userType === "cliente") {
        console.log("Redirigiendo a /homes");
        navigate("/homes");
      } else {
        console.log("Redirigiendo a /login");
        navigate("/");
      }
    }
  }, [userType, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!validateEmail(email)) newErrors.email = "Correo electrónico inválido";
    if (!validatePassword(password)) newErrors.password = "Mínimo 6 caracteres";
    if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!validatePhone(telefono)) newErrors.telefono = "Debe tener 10 dígitos";
    if (!validateRFC(rfc)) newErrors.rfc = "RFC no válido";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      axios.post("http://localhost:5001/register", { nombre, email, password, telefono, direccion, rfc })
        .then((response) => {
          if (response.data.success) {
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            setIsRegistering(false);
          } else {
            setErrors({ register: "Error al registrar usuario" });
          }
        })
        .catch(() => setErrors({ register: "Error al conectar con el servidor" }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={freshboxLogo} alt="Freshbox Logo" className="login-logo" />
        <h2 className="login-title">{isRegistering ? "Registrarse" : "Bienvenido a Freshbox"}</h2>

        {isRegistering ? (
          <form onSubmit={handleRegister}>
            <div className="register-grid">
              <div className="register-column">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label>Contraseña</label>
                  <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <input type="password" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="register-column">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                  {errors.telefono && <p className="error">{errors.telefono}</p>}
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>RFC</label>
                  <input type="text" placeholder="RFC" value={rfc} onChange={(e) => setRfc(e.target.value)} required />
                  {errors.rfc && <p className="error">{errors.rfc}</p>}
                </div>
              </div>
            </div>

            {errors.register && <p className="error">{errors.register}</p>}
            <button type="submit" className="login-button">Registrarse</button>
            <p className="toggle-form">¿Ya tienes cuenta? <span onClick={() => setIsRegistering(false)}>Inicia sesión</span></p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {errors.login && <p className="error">{errors.login}</p>}
            <button type="submit" className="login-button">Iniciar Sesión</button>
            <p className="toggle-form">¿No tienes cuenta? <span onClick={() => setIsRegistering(true)}>Regístrate</span></p>
          </form>
        )}
        <br />
        <GoogleOAuthProvider 
          clientId="525052293665-d5vfajcv0ea5arl7rupojm7vi3srh4lc.apps.googleusercontent.com"
        >
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              setErrors({ 
                login: "Error en la autenticación con Google" 
              });
            }}
          />
        </GoogleOAuthProvider>

        {/* Botón para cerrar sesión - Opcional, puede estar en otra parte de la aplicación */}
        {localStorage.getItem("userSession") && (
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleLogout} 
              className="login-button" 
              style={{ backgroundColor: '#d32f2f' }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;