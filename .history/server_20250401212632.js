const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json());

const googleClient = new OAuth2Client(
  "525052293665-d5vfajcv0ea5arl7rupojm7vi3srh4lc.apps.googleusercontent.com"
);

const db = mysql.createConnection({
  host: "134.199.211.202",
  user: "ana",
  password: "ana123",
  database: "freshBox"
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a MySQL:", err);
  } else {
    console.log("Conexión exitosa a MySQL");
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
    const { nombre, email, password, telefono, direccion, rfc, numeroCuenta } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO freshboxusuarios (us_email, us_password, us_tipo, us_estatus) VALUES (?, ?, 'cliente', 'Activo')",
        [email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ success: false, message: "Error al registrar en usuarios" });
          const us_id = result.insertId;
          console.log("Datos antes de insertar en clientes:", nombre, email, hashedPassword, telefono, direccion, rfc, us_id, numeroCuenta);

          db.query(
            "INSERT INTO freshboxclientes (cl_nombre, cl_email, cl_password, cl_telefono, cl_direccion, cl_rfc, us_id, cl_cuenta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, email, hashedPassword, telefono, direccion, rfc, us_id, numeroCuenta],
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
  
    console.log("Ejecutando consulta con el correo:", email);
  
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.json({ success: false, message: "Error en la consulta" });
        }
  
        if (results.length === 0) {
            return res.json({ success: false, message: "Usuario no encontrado" });
        }
  
        const user = results[0];
  
        if (user.us_sesion === 1) {
            return res.json({ success: false, message: "Ya tienes otra sesión activa" });
        }       
  
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
  
        db.query("UPDATE freshboxusuarios SET us_sesion = 1 WHERE us_id = ?", [user.us_id], (err) => {
            if (err) {
                console.error("Error al actualizar el estado de sesión:", err);
                return res.json({ success: false, message: "Error al actualizar el estado de sesión" });
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
  });
  
app.post("/logout", (req, res) => {
  const { us_id } = req.body;
  console.log("ID de usuario recibido para cerrar sesión:", us_id); 
  if (!us_id) {
    return res.status(400).json({ success: false, message: "ID de usuario requerido" });
  }

  db.query("UPDATE freshboxusuarios SET us_sesion = 0 WHERE us_id = ?", [us_id], (err) => {
    if (err) {
      return res.json({ success: false, message: "Error al cerrar sesión" });
    }

    res.json({ success: true, message: "Sesión cerrada exitosamente" });
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
      "SELECT cl_nombre, cl_email, cl_telefono, cl_direccion, cl_rfc, cl_cuenta FROM freshboxclientes WHERE us_id = ?",
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

    if (!carrito || carrito.length === 0 || !us_id || !vt_idFactura) {
        return res.status(400).json({ success: false, message: "Datos incompletos para finalizar la compra" });
    }

    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const total = carrito.reduce((acc, producto) => acc + parseFloat(producto.pr_precio) * producto.cantidad, 0);

    db.query("SELECT cl_cuenta, cl_saldo, cl_id FROM freshboxclientes WHERE us_id = ?", [us_id], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error al buscar cliente:", err || "Cliente no encontrado");
            return res.status(500).json({ success: false, message: "Cliente no encontrado para el usuario" });
        }

        const cliente = results[0];
        const cuentaCliente = cliente.cl_cuenta;
        const saldoCliente = cliente.cl_saldo;
        const clienteId = cliente.cl_id;
        const cuentaDefault = "123456789";

        if (saldoCliente < total) {
            return res.status(400).json({ success: false, message: "Saldo insuficiente en la cuenta del cliente" });
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

                const carritoQuery = "INSERT INTO freshboxcarritocompras (cc_cantidad, cc_subtotal, cc_precio, vt_id, pr_id, us_id) VALUES ?";
                const carritoValores = carrito.map(p => [
                    p.cantidad, 
                    parseFloat(p.pr_precio) * p.cantidad, 
                    parseFloat(p.pr_precio),  
                    vt_id, 
                    p.pr_id,
                    us_id 
                ]);

                db.query(carritoQuery, [carritoValores], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error al insertar carrito de compras:", err);
                            res.status(500).json({ success: false, message: "Error al registrar los productos del carrito" });
                        });
                    }

                    const actualizarSaldoCliente = "UPDATE freshboxclientes SET cl_saldo = cl_saldo - ? WHERE cl_cuenta = ?";
                    const actualizarSaldoDestino = "UPDATE freshboxclientes SET cl_saldo = cl_saldo + ? WHERE cl_cuenta = ?";
                    const insertarTransaccion = "INSERT INTO freshboxtransacciones (cl_id, tr_monto, tr_cuenta) VALUES (?, ?, ?)";

                    db.query(actualizarSaldoCliente, [total, cuentaCliente], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Error al actualizar saldo del cliente:", err);
                                res.status(500).json({ success: false, message: "Error al procesar la transacción" });
                            });
                        }

                        db.query(actualizarSaldoDestino, [total, cuentaDefault], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Error al actualizar saldo de la cuenta destino:", err);
                                    res.status(500).json({ success: false, message: "Error al procesar la transacción" });
                                });
                            }

                            db.query(insertarTransaccion, [clienteId, total, cuentaDefault], (err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        console.error("Error al registrar la transacción:", err);
                                        res.status(500).json({ success: false, message: "Error al registrar la transacción" });
                                    });
                                }

                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Error al confirmar la compra:", err);
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
    const doc = new PDFDocument({ margin: 50 });
    const filename = `factura_${us_id}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Encabezado
    doc.fillColor('#0000FF').fontSize(30).text("FRESHBOX", { align: "center" });
    doc.fontSize(20).fillColor('#000000').text("Factura", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${cliente.cl_nombre}`);
    doc.text(`Email: ${cliente.cl_email}`);
    doc.text(`Teléfono: ${cliente.cl_telefono}`);
    doc.text(`Dirección: ${cliente.cl_direccion}`);
    doc.text(`RFC: ${cliente.cl_rfc}`);
    doc.text(`Cuenta: ${cliente.	cl_cuenta}`);
    doc.moveDown();

    // Primera tabla: Producto, Cantidad, Precio Unitario, Subtotal
    doc.fontSize(16).text("Detalles de la Compra:", { underline: true });
    doc.moveDown();

    let startX = 50;
    let yPosition = doc.y;
    let rowHeight = 25;
    
    const table1 = [
      { title: "Producto", width: 180 },
      { title: "Cantidad", width: 80 },
      { title: "Precio Unitario", width: 120 },
      { title: "Subtotal", width: 120 }
    ];

    // Dibujar encabezado de la primera tabla
    table1.reduce((x, col) => {
      doc.rect(x, yPosition, col.width, rowHeight).stroke();
      doc.fontSize(12).text(col.title, x + 5, yPosition + 5, { width: col.width - 10, align: "center" });
      return x + col.width;
    }, startX);

    yPosition += rowHeight;
    let total = 0;

    detallesVenta.forEach((producto) => {
      const { pr_nombre, cantidad, precio } = producto;
      const precioNum = parseFloat(precio);
      const subtotal = cantidad * precioNum;
      total += subtotal;

      let xPos = startX;
      const rowData = [
        pr_nombre,
        cantidad.toString(),
        `$${precioNum.toFixed(2)}`,
        `$${subtotal.toFixed(2)}`
      ];

      rowData.forEach((text, index) => {
        doc.rect(xPos, yPosition, table1[index].width, rowHeight).stroke();
        doc.fontSize(10).text(text, xPos + 5, yPosition + 8, { width: table1[index].width - 10, align: index === 0 ? "left" : "right" });
        xPos += table1[index].width;
      });

      yPosition += rowHeight;
      if (yPosition > doc.page.height - 100) {
        doc.addPage();
        yPosition = 50;
      }
    });

    doc.moveDown();

    // Segunda tabla: Precio con IVA, Sin IVA, IVA (16%)
    doc.fontSize(16).text("Desglose de Precios:", { underline: true });
    doc.moveDown();

    yPosition = doc.y; // Ajustar posición para la segunda tabla

    const table2 = [
      { title: "Producto", width: 180 },
      { title: "Precio sin IVA", width: 120 },
      { title: "IVA (16%)", width: 120 },
      { title: "Precio con IVA", width: 120 }
    ];

    table2.reduce((x, col) => {
      doc.rect(x, yPosition, col.width, rowHeight).stroke();
      doc.fontSize(12).text(col.title, x + 5, yPosition + 5, { width: col.width - 10, align: "center" });
      return x + col.width;
    }, startX);

    yPosition += rowHeight;

    detallesVenta.forEach((producto) => {
      const { pr_nombre, precio } = producto;
      const precioConIVA = parseFloat(precio); // Precio con IVA es el original
      const precioSinIVA = precioConIVA / 1.16; // Se obtiene dividiendo entre 1.16
      const iva = precioConIVA - precioSinIVA; // IVA es la diferencia

      let xPos = startX;
      const rowData = [
        pr_nombre,
        `$${precioSinIVA.toFixed(2)}`,
        `$${iva.toFixed(2)}`,
        `$${precioConIVA.toFixed(2)}`
      ];

      rowData.forEach((text, index) => {
        doc.rect(xPos, yPosition, table2[index].width, rowHeight).stroke();
        doc.fontSize(10).text(text, xPos + 5, yPosition + 8, { width: table2[index].width - 10, align: index === 0 ? "left" : "right" });
        xPos += table2[index].width;
      });

      yPosition += rowHeight;
      if (yPosition > doc.page.height - 100) {
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
  const query = "INSERT INTO freshboxcontenedores (ct_peso, ct_status, vt_id) VALUES (?, ?, ?)";
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
    UPDATE  freshboxcontenedores 
    SET vt_id = ?, ts_id = ?, ct_cantidad = ?, ct_status = 'Ocupado'
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
    SELECT ct_id AS idContenedor, vt_id AS idVenta, ts_id AS idTransportista, ct_cantidad AS cantidadProductos 
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
      FROM freshboxventas v
      LEFT JOIN freshboxcarritocompras c ON v.vt_id = c.vt_id
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
    SELECT * FROM vista_entregas;
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
        return res.status(200).json({ 
          success: true, 
          user: {
            us_id: results[0].us_id,
            us_tipo: results[0].us_tipo,
            us_email: results[0].us_email
          }
        });
      } else {
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

app.get("/api/productos-mas-vendidos", (req, res) => {
  const query = `
    SELECT pr_nombre, 
           (SELECT SUM(cc_cantidad) 
            FROM freshboxcarritocompras cc 
            WHERE cc.pr_id = p.pr_id) AS total_vendido
    FROM freshboxproductos p
    ORDER BY total_vendido DESC
    LIMIT 5;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener productos más vendidos:", err);
      return res.status(500).json({ mensaje: "Error al obtener productos más vendidos" });
    }
    res.status(200).json(results);
  });
});

  app.listen(5001, () => console.log("Servidor corriendo en http://localhost:5001"));