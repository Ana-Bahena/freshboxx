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
  database: process.env.DB_NAME || "fresh"
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

        console.log("Datos antes de insertar en clientes:", nombre, email, hashedPassword, telefono, direccion, rfc, us_id);

        // Insertar en la tabla `clientes`
        db.query(
          "INSERT INTO freshboxclientes (cl_nombre, cl_email, cl_password, cl_telefono, cl_direccion, cl_rfc, us_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [nombre, email, hashedPassword, telefono, direccion, rfc, us_id],
          (err) => {
            if (err) {
              console.error("Error al registrar en clientes:", err);
              return res.status(500).json({ success: false, message: "Error al registrar en clientes" });
            }
            console.log("Cliente registrado correctamente");
            res.json({ success: true, message: "Registro exitoso" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "SELECT us_email, us_password, us_tipo FROM freshboxusuarios WHERE us_email = ?";
  
  db.query(sql, [email], (err, results) => {
      if (err) {
          return res.status(500).json({ error: "Error en la base de datos" });
      }

      if (results.length === 0) {
          return res.status(401).json({ error: "Usuario no encontrado" });
      }

      const user = results[0];
      const storedPassword = user.us_password;

      // Verificar si la contraseña almacenada es encriptada (bcrypt genera siempre 60 caracteres)
      if (storedPassword.length === 60) {
          // Comparar usando bcrypt
          bcrypt.compare(password, storedPassword, (err, isMatch) => {
              if (err) {
                  return res.status(500).json({ error: "Error en la verificación de contraseña" });
              }

              if (!isMatch) {
                  return res.status(401).json({ error: "Contraseña incorrecta" });
              }

              res.json({ message: "Inicio de sesión exitoso", user });
          });
      } else {
          // Comparar como texto plano
          if (password === storedPassword) {
              return res.json({ message: "Inicio de sesión exitoso", user });
          } else {
              return res.status(401).json({ error: "Contraseña incorrecta" });
          }
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

// **Obtener detalles del perfil del cliente**
app.get("/perfil", (req, res) => {
  const { us_id } = req.query;

  if (!us_id) {
    console.error("Error: No se recibió us_id en la solicitud.");
    return res.status(400).json({ success: false, message: "ID de usuario requerido" });
  }

  console.log("us_id recibido en el backend:", us_id);

  db.query(
    "SELECT cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc FROM freshboxclientes WHERE us_id = ?",
    [us_id],
    (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).json({ success: false, message: "Error al obtener los detalles del cliente" });
      }
      if (results.length === 0) {
        console.log("Cliente no encontrado para us_id:", us_id);
        return res.status(404).json({ success: false, message: "Cliente no encontrado" });
      }

      console.log("Datos del cliente obtenidos:", results[0]);
      res.json({ success: true, cliente: results[0] });
    }
  );
});

// **Editar perfil del cliente**
app.put("/editar-perfil", (req, res) => {
  const { us_id, cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc } = req.body;

  // Actualiza la información del cliente en la tabla `freshboxclientes`
  db.query(
    "UPDATE freshboxclientes SET cl_nombre = ?, cl_email = ?, cl_telefono = ?, cl_direccion = ?, cl_rfc = ? WHERE us_id = ?",
    [cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc, us_id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el perfil:", err);
        return res.status(500).json({ success: false, message: "Error al actualizar el perfil" });
      }

      // Verificar si se actualizó algún registro
      if (result.affectedRows > 0) {
        res.json({ success: true, message: "Perfil actualizado correctamente" });
      } else {
        res.json({ success: false, message: "No se encontró el usuario para actualizar" });
      }
    }
  );
});


app.listen(5001, () => console.log("Servidor corriendo en http://localhost:5001"));