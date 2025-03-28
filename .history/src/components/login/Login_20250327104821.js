import React, { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import freshboxLogo from "../../img/Logo Fresh Box2.png";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


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

  
    const handleGoogleLoginSuccess = async (response) => {
      console.log("Token de Google:", response.credential);
  
      try {
        const res = await axios.post("http://localhost:5001/google", {
          token: response.credential,
        });
  
        if (res.data.success) {
          localStorage.setItem("userSession", res.data.user.us_id);
          localStorage.setItem("userType", res.data.user.us_tipo);
          setIsLoggedIn(true);
          navigate(res.data.user.us_tipo === "cliente" ? "/homes" : "/dashboard");
        } else {
          console.error("Error en el inicio de sesión con Google");
        }
      } catch (error) {
        console.error("Error en la autenticación con Google:", error);
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
  
    try {
      const response = await axios.post("http://localhost:5001/login", { email, password });
      console.log("Respuesta del servidor:", response.data);
  
      if (response.data.success) {
        localStorage.setItem("userSession", response.data.us_id);
        localStorage.setItem("userType", response.data.us_tipo);
        console.log("Tipo de usuario guardado:", response.data.us_tipo);  // Verifica que el valor sea correcto
        setIsLoggedIn(true);
        setUserType(response.data.us_tipo);
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, login: "Usuario o contraseña incorrectos" }));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrors({ login: "Error al conectar con el servidor" });
    }
  };

  useEffect(() => {
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
      </div>
    </div>
  );
}

export default Login;