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

  app.post("/register", async (req, res) => {
    const { nombre, email, password, telefono, direccion, rfc } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO freshboxusuarios (us_email, us_password, us_tipo, us_estatus) VALUES (?, ?, 'cliente', 'Activo')",
        [email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: "Error al registrar en usuarios" });
          const us_id = result.insertId;
          console.log("Datos antes de insertar en clientes:", nombre, email, hashedPassword, telefono, direccion, rfc, us_id);

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

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM freshboxusuarios WHERE us_email = ?";
    
    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.json({ success: false, message: "Error en la consulta" });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "Usuario no encontrado" });
      }

      const user = results[0];
      const storedPassword = user.us_password;

      if (storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2a$")) {
        const match = await bcrypt.compare(password, storedPassword);
        if (!match) {
          return res.json({ success: false, message: "Contraseña incorrecta" });
        }
      } else {
        if (password !== storedPassword) {
          return res.json({ success: false, message: "Contraseña incorrecta" });
        }
      }

      res.json({ 
        success: true, 
        message: "Inicio de sesión exitoso", 
        us_id: user.us_id,
        us_tipo: user.us_tipo 
      });
      console.log("Usuario autenticado:", user.us_id, user.us_tipo);
    });
  });

  app.get("/productos", (req, res) => {
    db.query("SELECT * FROM freshboxproductos", (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).json({ success: false, message: "Error en la base de datos" });
      }
      //console.log("Productos obtenidos:", results);
      res.json({ success: true, productos: results });
    });
  });

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

  app.put("/editar-perfil", (req, res) => {
    const { us_id, cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc } = req.body;

    db.query(
      "UPDATE freshboxclientes SET cl_nombre = ?, cl_email = ?, cl_telefono = ?, cl_direccion = ?, cl_rfc = ? WHERE us_id = ?",
      [cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc, us_id],
      (err, result) => {
        if (err) {
          console.error("Error al actualizar el perfil:", err);
          return res.status(500).json({ success: false, message: "Error al actualizar el perfil" });
        }

        if (result.affectedRows > 0) {
          res.json({ success: true, message: "Perfil actualizado correctamente" });
        } else {
          res.json({ success: false, message: "No se encontró el usuario para actualizar" });
        }
      }
    );
  });

  app.get("/usuarios", (req, res) => {
    db.query("SELECT * FROM freshboxusuarios", (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).json({ success: false, message: "Error al obtener los usuarios" });
      }
      res.json({ success: true, usuarios: results });
    });
  });

  app.post("/register-transportista", (req, res) => {
    const { email, password, tipo, estatus, nombre, telefono, direccion, rfc, placas } = req.body;

    if (tipo !== "transportista") {
      return res.status(400).json({ success: false, message: "Solo se pueden registrar transportistas" });
    }
  
    db.query(
      "INSERT INTO freshboxusuarios (us_email, us_password, us_tipo, us_estatus) VALUES (?, ?, ?, ?)",
      [email, password, tipo, estatus],
      (err, result) => {
        if (err) {
          console.error("Error al registrar en usuarios:", err);
          return res.status(500).json({ success: false, message: "Error al registrar transportista" });
        }
  
        const us_id = result.insertId; 

        db.query(
          "INSERT INTO freshboxtransportistas (ts_nombre, ts_email, ts_password, ts_telefono, ts_direccion, ts_rfc, ts_placas, us_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [nombre, email, password, telefono, direccion, rfc, placas, us_id],
          (err) => {
            if (err) {
              console.error("Error al registrar en transportistas:", err);
              return res.status(500).json({ success: false, message: "Error al registrar transportista en la tabla transportistas" });
            }

            res.json({ success: true, message: "Transportista registrado correctamente" });
          }
        );
      }
    );
  });

  app.post("/insert-productos", (req, res) => {
    const { pr_nombre, pr_precio, pr_cantidad, pr_descripcion, pr_imagen, pr_temperatura, pr_status, pr_peso } = req.body;
    const queryInsert = "INSERT INTO freshboxproductos (pr_nombre, pr_precio, pr_cantidad, pr_descripcion, pr_imagen, pr_temperatura, pr_status, pr_peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(queryInsert, [pr_nombre, pr_precio, pr_cantidad, pr_descripcion, pr_imagen, pr_temperatura, pr_status, pr_peso], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error al insertar el producto", error: err });
        }

        const querySelect = "SELECT * FROM freshboxproductos";
        db.query(querySelect, (err, productos) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error al obtener productos", error: err });
            }

            res.json({ success: true, message: "Producto agregado correctamente", productos });
        });
    });
});

app.get("/obtener-productos", (req, res) => {
  const query = "SELECT * FROM freshboxproductos";
  db.query(query, (err, productos) => {
      if (err) {
          return res.status(500).json({ success: false, message: "Error al obtener productos", error: err });
      }
      res.json({ success: true, productos });
  });
});

// Endpoint para editar un producto
app.put("/editar-producto/:id", (req, res) => {
  const { id } = req.params;
  const { pr_nombre, pr_precio, pr_cantidad, pr_descripcion, pr_imagen, pr_temperatura, pr_status, pr_peso } = req.body;

  const query = `
      UPDATE freshboxproductos
      SET pr_nombre = ?, pr_precio = ?, pr_cantidad = ?, pr_descripcion = ?, pr_imagen = ?, pr_temperatura = ?, pr_status = ?, pr_peso = ?
      WHERE pr_id = ?
  `;
  db.query(query, [pr_nombre, pr_precio, pr_cantidad, pr_descripcion, pr_imagen, pr_temperatura, pr_status, pr_peso, id], (err, result) => {
      if (err) {
          console.error("Error al actualizar el producto:", err);
          return res.status(500).json({ success: false, message: "Error al actualizar el producto" });
      }
      res.json({ success: true, message: "Producto actualizado correctamente" });
  });
});



  app.listen(5001, () => console.log("Servidor corriendo en http://localhost:5001"));