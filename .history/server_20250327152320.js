  const express = require("express");
  const mysql = require("mysql2");
  const cors = require("cors");
  const bcrypt = require("bcrypt");
  const dotenv = require("dotenv");
 //const mysql = require('mysql');
  const { OAuth2Client } = require('google-auth-library');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const googleClient = new OAuth2Client(
    "525052293665-d5vfajcv0ea5arl7rupojm7vi3srh4lc.apps.googleusercontent.com"
  );
/*
  const db = mysql.createConnection({
    host: process.env.DB_HOST || "sql5.freesqldatabase.com",
    user: process.env.DB_USER || "sql5769755",
    password: process.env.DB_PASSWORD || "pwjQV58Y2V",
    database: process.env.DB_NAME || "sql5769755",
  }); 

  db.connect((err) => {
    if (err) {
      console.error("Error de conexión a MySQL:", err);
    } else {
      console.log("Conectado a MySQL");
    }
  });

  app.post("/checkuser", (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ success: false, message: "Se requiere un correo electrónico" });
    }
  
    const query = `
      SELECT us_id, us_tipo FROM freshboxusuarios WHERE us_email = ?
      UNION
      SELECT cl_id AS us_id, 'cliente' AS us_tipo FROM freshboxclientes WHERE cl_email = ?;
    `;
  
    db.query(query, [email, email], (err, result) => {
      if (err) {
        console.error("Error en la consulta:", err);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
      }
    
      console.log(result); 
      if (result.length > 0) {
        return res.json({ success: true, us_id: result[0].us_id, us_tipo: result[0].us_tipo });
      } else {
        return res.json({ success: false, message: "Correo no registrado en FreshBox" });
      }
    });
    
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
    db.query(
      "SELECT * FROM freshboxproductos WHERE pr_status = 'Disponible'",
      (err, results) => {
        if (err) {
          console.error("Error en la base de datos:", err);
          return res.status(500).json({ success: false, message: "Error en la base de datos" });
        }
        res.json({ success: true, productos: results });
      }
    );
  });
  
  app.get("/perfil", (req, res) => {
    const { us_id } = req.query;

    if (!us_id) {
      console.error("Error: No se recibió us_id en la solicitud.");
      return res.status(400).json({ success: false, message: "ID de usuario requerido" });
    }
    //console.log("us_id recibido en el backend:", us_id);

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

app.get("/cliente/:us_id", (req, res) => {
  const { us_id } = req.params;

  db.query(
    "SELECT cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc FROM freshboxclientes WHERE us_id = ?",
    [us_id],
    (err, results) => {
      if (err) {
        console.error("Error en la base de datos:", err);
        return res.status(500).json({ success: false, message: "Error al obtener los datos del cliente" });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Cliente no encontrado" });
      }
      res.json({ success: true, cliente: results[0] });
    }
  );
});

app.post("/actualizar-stock", (req, res) => {
  const productos = req.body.productos; 
  if (!productos || productos.length === 0) {
    console.log("Productos recibidos:", productos);
    return res.status(400).json({ success: false, message: "No se enviaron productos" });
  }

  const queries = productos.map((producto) => {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE freshboxproductos SET pr_cantidad = pr_cantidad - ? WHERE pr_id = ?",
        [producto.cantidad, producto.pr_id],
        (err, result) => {
          if (err) {
            console.error("Error en la consulta SQL:", err);
            reject(err);
          } else {
            console.log("Consulta ejecutada con éxito para producto ID:", producto.pr_id);
            resolve(result);
          }
        }
      );
    });
  });

  Promise.all(queries)
    .then(() => {
      res.json({ success: true, message: "Stock actualizado correctamente" });
    })
    .catch((error) => {
      console.error("Error al actualizar el stock:", error);
      res.status(500).json({ success: false, message: "Error al actualizar el stock" });
    });
  });

  app.post('/api/finalizarcompra', (req, res) => {
    console.log('Solicitud recibida para finalizar compra:', req.body);
    const { carrito, us_id, vt_idFactura } = req.body;
    //console.log("Usuario ID recibido en el backend:", us_id);
  
    if (!carrito || carrito.length === 0 || !us_id || !vt_idFactura) {
      return res.status(400).json({ success: false, message: "Datos incompletos para finalizar la compra" });
    }
  
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const total = carrito.reduce((acc, producto) => acc + parseFloat(producto.pr_precio) * producto.cantidad, 0);
  
    const buscarClienteQuery = "SELECT US_id FROM freshboxusuarios WHERE us_id = ?";
    db.query(buscarClienteQuery, [us_id], (err, results) => {
      if (err || results.length === 0) {
        console.error("Error al buscar cliente:", err || "Cliente no encontrado");
        return res.status(500).json({ success: false, message: "Cliente no encontrado para el usuario" });
      }

      db.beginTransaction((err) => {
        if (err) {
          console.error("Error al iniciar la transacción:", err);
          return res.status(500).json({ success: false, message: "Error interno" });
        }
  
        const ventaQuery = `
          INSERT INTO freshboxventas (vt_total, vt_fecha, vt_status, vt_pesoTotal, vt_formaPago, us_id, vt_idFactura)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
  
        db.query(ventaQuery, [total, fechaActual, 'pendiente', 0, 'paypal', us_id, vt_idFactura], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error al insertar venta:", err);
              res.status(500).json({ success: false, message: "Error al registrar la venta" });
            });
          }
  
          const vt_id = result.insertId;
  
          const carritoQuery = "INSERT INTO freshboxcarritocompras (cc_cantidad, cc_subtotal, cc_precio, vt_id, pr_id) VALUES ?";
          const carritoValores = carrito.map(p => [
            p.cantidad, 
            parseFloat(p.pr_precio) * p.cantidad, 
            parseFloat(p.pr_precio), 
            vt_id, 
            p.pr_id
          ]);
  
          db.query(carritoQuery, [carritoValores], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error al insertar carrito de compras:", err);
                res.status(500).json({ success: false, message: "Error al registrar los productos del carrito" });
              });
            }
  
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error al confirmar la transacción:", err);
                  res.status(500).json({ success: false, message: "Error al confirmar la compra" });
                });
              }
              res.json({ success: true, message: "Compra finalizada correctamente", vt_id });
            });
          });
        });
      });
    });
  });

const obtenerCliente = async (us_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc FROM freshboxclientes WHERE us_id = ?",
      [us_id],
      (err, results) => {
        if (err) {
          reject("Error al obtener datos del cliente: " + err);
        } else if (results.length === 0) {
          reject("Cliente no encontrado.");
        } else {
          resolve(results[0]); 
        }
      }
    );
  });
};

const obtenerDetallesVenta = async (us_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT vt_id FROM freshboxventas WHERE us_id = ? ORDER BY vt_fecha DESC LIMIT 1",
      [us_id],
      (err, results) => {
        if (err) {
          reject("Error al obtener la venta: " + err);
        } else if (results.length === 0) {
          reject("No se encontró una venta para este cliente.");
        } else {
          const vt_id = results[0].vt_id;

          db.query(
            "SELECT p.pr_nombre, cc.cc_cantidad AS cantidad, cc.cc_precio AS precio, cc.cc_subtotal AS subtotal " +
            "FROM freshboxcarritocompras cc " +
            "JOIN freshboxproductos p ON cc.pr_id = p.pr_id " + 
            "WHERE cc.vt_id = ?",
            [vt_id],
            (err, results) => {
              if (err) {
                reject("Error al obtener los detalles de la venta: " + err);
              } else {
                resolve(results); 
              }
            }
          );
        }
      }
    );
  });
};

const PDFDocument = require("pdfkit");

app.get("/descargar-factura", async (req, res) => {
  const { us_id } = req.query;

  if (!us_id) {
    return res.status(400).json({ success: false, message: "Falta el ID de usuario." });
  }

  try {
    const cliente = await obtenerCliente(us_id);
    const detallesVenta = await obtenerDetallesVenta(us_id);

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();
    const filename = `factura_${us_id}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fillColor('#0000FF').fontSize(30).text("FRESHBOX", { align: "center" });
    doc.fontSize(20).fillColor('#000000').text("Factura", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${cliente.cl_nombre}`);
    doc.text(`Email: ${cliente.cl_email}`);
    doc.text(`Teléfono: ${cliente.cl_telefono}`);
    doc.text(`Dirección: ${cliente.cl_direccion}`);
    doc.text(`RFC: ${cliente.cl_rfc}`);
    doc.moveDown();

    doc.fontSize(16).text("Detalles de la Compra:", { underline: true });
    doc.moveDown();

    const itemX = 50;
    const itemWidth = 180;
    const qtyX = itemX + itemWidth;
    const qtyWidth = 80;
    const priceX = qtyX + qtyWidth;
    const priceWidth = 100;
    const subtotalX = priceX + priceWidth;
    const subtotalWidth = 100;

    const rowHeight = 20;
    let yPosition = doc.y;

    doc.fontSize(12).fillColor('#000000');
    doc.rect(itemX, yPosition, itemWidth, rowHeight).stroke();
    doc.rect(qtyX, yPosition, qtyWidth, rowHeight).stroke();
    doc.rect(priceX, yPosition, priceWidth, rowHeight).stroke();
    doc.rect(subtotalX, yPosition, subtotalWidth, rowHeight).stroke();

    doc.text("Producto", itemX + 5, yPosition + 5, { width: itemWidth - 10, align: "left" });
    doc.text("Cantidad", qtyX + 5, yPosition + 5, { width: qtyWidth - 10, align: "center" });
    doc.text("Precio", priceX + 5, yPosition + 5, { width: priceWidth - 10, align: "center" });
    doc.text("Subtotal", subtotalX + 5, yPosition + 5, { width: subtotalWidth - 10, align: "center" });

    yPosition += rowHeight;

    let total = 0;

    detallesVenta.forEach((producto) => {
      const { pr_nombre, cantidad, precio, subtotal } = producto;

      const precioNum = parseFloat(precio);
      const subtotalNum = parseFloat(subtotal);
      total += subtotalNum;

      doc.rect(itemX, yPosition, itemWidth, rowHeight).stroke();
      doc.rect(qtyX, yPosition, qtyWidth, rowHeight).stroke();
      doc.rect(priceX, yPosition, priceWidth, rowHeight).stroke();
      doc.rect(subtotalX, yPosition, subtotalWidth, rowHeight).stroke();

      doc.text(pr_nombre, itemX + 5, yPosition + 5, { width: itemWidth - 10, align: "left", ellipsis: true });
      doc.text(cantidad, qtyX + 5, yPosition + 5, { width: qtyWidth - 10, align: "center" });
      doc.text(`$${precioNum.toFixed(2)}`, priceX + 5, yPosition + 5, { width: priceWidth - 10, align: "center" });
      doc.text(`$${subtotalNum.toFixed(2)}`, subtotalX + 5, yPosition + 5, { width: subtotalWidth - 10, align: "center" });

      yPosition += rowHeight;

      if (yPosition > doc.page.height - 50) {
        doc.addPage();
        yPosition = 50;
      }
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(14).text("¡Gracias por tu compra!", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error generando la factura:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.toString() });
    }
  }
});

app.post("/agregar-contenedor", (req, res) => {
  const { peso, status } = req.body; 
  //const cantidad = 0;
  const query = "INSERT INTO freshboxcontenedores (ct_peso, ct_status) VALUES (?, ?)";
  db.query(query, [peso, status], (err, result) => {
    if (err) {
      console.error("Error al insertar contenedor:", err);
      return res.status(500).json({ message: "Error al agregar el contenedor" });
    }
    res.status(200).json({ message: "Contenedor agregado correctamente", id: result.insertId });
  });
});

app.post("/agregar-carga-contenedor", (req, res) => {
  const { idContenedor, idVenta, idTransportista, cantidadProductos } = req.body;

  const query = `
    UPDATE freshboxcontenedores 
    SET cc_id = ?, ts_id = ?, ct_cantidad = ?, ct_status = 'Ocupado'
    WHERE ct_id = ?
  `;

  db.query(query, [idVenta, idTransportista, cantidadProductos, idContenedor], (err, result) => {
    if (err) {
      console.error("Error al agregar carga al contenedor:", err);
      return res.status(500).json({ message: "Error al agregar carga al contenedor" });
    }
    res.status(200).json({ message: "Carga agregada correctamente al contenedor" });
  });
});

app.get("/contenedores", (req, res) => {
  const query = "SELECT ct_id, ct_peso, ct_status FROM freshboxcontenedores";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener contenedores:", err);
      return res.status(500).json({ message: "Error al obtener contenedores" });
    }
    res.status(200).json(results); 
  });
});

app.get("/listacargas", (req, res) => {
  const query = `
    SELECT ct_id AS idContenedor, cc_id AS idVenta, ts_id AS idTransportista, ct_cantidad AS cantidadProductos 
    FROM freshboxcontenedores
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener la lista de cargas:", err);
      return res.status(500).json({ message: "Error al obtener la lista de cargas" });
    }
    res.status(200).json(results); 
  });
});

app.get("/listaventas", (req, res) => {
  const query = `
     SELECT v.vt_id AS idVenta,
      COALESCE(SUM(c.cc_cantidad), 0) AS cantidadProductos,
      v.vt_status AS estadoVenta
      FROM Freshboxventas v
      LEFT JOIN Freshboxcarritocompras c ON v.vt_id = c.vt_id
      WHERE v.vt_status = 'pendiente' 
      GROUP BY v.vt_id, v.vt_status;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener lista de ventas:", err);
      return res.status(500).json({ mensaje: "Error al obtener lista de ventas" });
    }
    res.status(200).json(results);
  });
});

app.get('/listatransportistas', (req, res) => {
  const sql = 'SELECT ts_id, ts_nombre FROM freshboxtransportistas';
  db.query(sql, (err, result) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(result);
  });
});

app.get("/api/entregas", (req, res) => {
  const query = `
    SELECT 
      vt.vt_id AS idVenta, 
      vt.vt_status AS estadoVenta, 
      fc.cc_id AS idContenedor
      FROM freshboxventas vt
      JOIN freshboxcarritocompras fc ON vt.vt_id = fc.vt_id
      JOIN freshboxcontenedores c ON fc.cc_id = c.ct_id
      WHERE vt.vt_status = 'entregado';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener entregas:", err);
      return res.status(500).json({ mensaje: "Error al obtener entregas" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/reporte-ventas", (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  // Validar que las fechas sean correctas
  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ mensaje: "Las fechas de inicio y fin son requeridas." });
  }

  const query = `
    SELECT 
      p.pr_nombre AS nombreProducto, 
      p.pr_precio AS precio, 
      SUM(fc.cc_cantidad) AS cantidadVendida, 
      SUM(fc.cc_subtotal) AS totalVenta
      FROM freshboxcarritocompras fc
      JOIN freshboxproductos p ON fc.pr_id = p.pr_id
      JOIN freshboxventas v ON fc.vt_id = v.vt_id
      WHERE v.vt_fecha BETWEEN ? AND ?
      GROUP BY p.pr_id
  `;

  db.query(query, [fechaInicio, fechaFin], (err, results) => {
    if (err) {
      console.error("Error al obtener el reporte de ventas:", err);
      return res.status(500).json({ mensaje: "Error al obtener el reporte de ventas" });
    }
    res.status(200).json(results);
  });
});

app.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: "525052293665-d5vfajcv0ea5arl7rupojm7vi3srh4lc.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;
    console.log("Email de Google:", email);

    db.query("SELECT * FROM freshboxusuarios WHERE us_email = ?", [email], async (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Error en la base de datos", error: err });
      }

      if (results.length > 0) {
        // User exists, proceed with login
        return res.status(200).json({ 
          success: true, 
          user: {
            us_id: results[0].us_id,
            us_tipo: results[0].us_tipo,
            us_email: results[0].us_email
          }
        });
      } else {
        // User not found
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no registrado con este correo" 
        });
      }
    });
  } catch (error) {
    console.error("Error al verificar el token de Google:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error en la autenticación con Google", 
      error: error.message 
    });
  }
});


  app.listen(5001, () => console.log("Servidor corriendo en http://localhost:5001"));