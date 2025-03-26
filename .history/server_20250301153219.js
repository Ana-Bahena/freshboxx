const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

 const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "Fresh"
}); 

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// **Registrar un nuevo usuario**
app.post("/register", async (req, res) => {
  const { nombre, email, password, telefono, direccion, rfc } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la tabla `usuarios`
    db.query(
      "INSERT INTO freshboxusuarios (us_email, us_password, us_tipo, us_estatus) VALUES (?, ?, 'cliente', 'Activo')",
      [email, hashedPassword],    
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Error al registrar en usuarios" });

        const us_id = result.insertId; // Obtener el ID del usuario insertado

        // Insertar en la tabla `clientes`
        db.query(
          "INSERT INTO freshboxclientes (cl_nombre, cl_email, cl_password, cl_telefono, cl_direccion, cl_rfc, us_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [nombre, email, hashedPassword, telefono, direccion, rfc, us_id],
          (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error al registrar en clientes" });
            console.error("Error al registrar en usuarios:", err);
            res.json({ success: true, message: "Registro exitoso" });
          }
        );
        console.log("Resultado de la inserción en usuarios:", result);
        console.log("Datos antes de insertar en clientes:", nombre, email, hashedPassword, telefono, direccion, rfc, us_id);
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// **Iniciar Sesión**
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM freshboxusuarios WHERE us_email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error en la base de datos" });
    if (results.length === 0) return res.json({ success: false, message: "Usuario no encontrado" });

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.us_password);
      if (!isMatch) return res.json({ success: false, message: "Contraseña incorrecta" });

      res.json({ success: true, message: "Inicio de sesión exitoso", us_id: user.us_id });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al verificar la contraseña" });
    }
  });
});

app.get("/productos", (req, res) => {
  db.query("SELECT * FROM freshboxproductos", (err, results) => {
    if (err) {
      console.error("Error en la base de datos:", err);
      return res.status(500).json({ success: false, message: "Error en la base de datos" });
    }
    console.log("Productos obtenidos:", results);
    res.json({ success: true, productos: results });
  });
});

//validar cantidad disponible
app.get("/productos", (req, res) => {
  db.query("SELECT *, cantidad_disponible FROM freshboxproductos", (err, results) => {
    if (err) {
      console.error("Error en la base de datos:", err);
      return res.status(500).json({ success: false, message: "Error en la base de datos" });
    }
    console.log("Productos obtenidos:", results);
    res.json({ success: true, productos: results });
  });
});


// Dentro del endpoint '/login' en tu servidor
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM freshboxusuarios WHERE us_email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error en la base de datos" });
    if (results.length === 0) return res.json({ success: false, message: "Usuario no encontrado" });

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.us_password);
      if (!isMatch) return res.json({ success: false, message: "Contraseña incorrecta" });

      res.json({ success: true, message: "Inicio de sesión exitoso", us_id: user.us_id });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al verificar la contraseña" });
    }
  });
});



app.listen(5001, () => console.log("Servidor corriendo en http://localhost:5001"));