const { Op } = require("sequelize");
var Firebird = require("node-firebird");

var odontos = {};

odontos.host = "192.168.10.247";
odontos.port = 3050;
odontos.database = "c:\\\\jakemate\\\\base\\\\ODONTOS64.fdb";
odontos.user = "SYSDBA";
odontos.password = "masterkey";
odontos.lowercase_keys = false; // set to true to lowercase keys
odontos.role = null; // default
odontos.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
odontos.blobAsText = false;

// Horario laboral del enviador
var horaEntrada = "7"; //AM
var horaSalida = "20"; //PM
//var tiempoRetrasoSQL = 10000;
var tiempoRetrasoSQL = 10000 * 60;

module.exports = (app) => {
  const Turnos = app.db.models.Turnos;
  const Users = app.db.models.Users;

  app
    .route("/turnos")
    .get((req, res) => {
      Turnos.findAll({
        order: [["createdAt", "DESC"]],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    })
    .post((req, res) => {
      console.log(req.body);
      Turnos.create(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.json(error));
    });

  // Trae los turnos que tengan en el campo estado_envio = 0
  app.route("/turnosPendientes").get((req, res) => {
    Turnos.findAll({
      where: { estado_envio: 0 },
      order: [["FECHA_CREACION", "ASC"]],
      //limit: 5
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Trae los turnos que ya fueron notificados hoy
  app.route("/turnosNotificados").get((req, res) => {
    // Fecha de hoy 2022-02-30
    let fechaHoy = new Date().toISOString().slice(0, 10);

    Turnos.count({
      where: {
        [Op.and]: [
          { estado_envio: 1 },
          {
            updatedAt: {
              [Op.between]: [fechaHoy + " 00:00:00", fechaHoy + " 23:59:59"],
            },
          },
        ],
      },
      //order: [["FECHA_CREACION", "DESC"]],
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Trae la cantidad de turnos enviados por rango de fecha desde hasta
  app.route("/turnosNotificadosFecha").post((req, res) => {
    let fechaHoy = new Date().toISOString().slice(0, 10);
    let { fecha_desde, fecha_hasta } = req.body;

    if (fecha_desde === "" && fecha_hasta === "") {
      fecha_desde = fechaHoy;
      fecha_hasta = fechaHoy;
    }

    if (fecha_hasta == "") {
      fecha_hasta = fecha_desde;
    }

    if (fecha_desde == "") {
      fecha_desde = fecha_hasta;
    }

    console.log(req.body);

    Turnos.count({
      where: {
        [Op.and]: [
          { estado_envio: 1 },
          {
            updatedAt: {
              [Op.between]: [
                fecha_desde + " 00:00:00",
                fecha_hasta + " 23:59:59",
              ],
            },
          },
        ],
      },
      //order: [["createdAt", "DESC"]],
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Turnos no enviados - estado_envio 2 o 3
  app.route("/turnosNoNotificados").get((req, res) => {
    // Fecha de hoy 2022-02-30
    let fechaHoy = new Date().toISOString().slice(0, 10);
    Turnos.count({
      where: {
        [Op.and]: [
          { estado_envio: { [Op.in]: [2, 3] } },
          {
            updatedAt: {
              [Op.between]: [fechaHoy + " 00:00:00", fechaHoy + " 23:59:59"],
            },
          },
        ],
      },
      //order: [["FECHA_CREACION", "DESC"]],
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  // Trae la cantidad de turnos enviados por rango de fecha desde hasta
  app.route("/turnosNoNotificadosFecha").post((req, res) => {
    let fechaHoy = new Date().toISOString().slice(0, 10);
    let { fecha_desde, fecha_hasta } = req.body;

    if (fecha_desde === "" && fecha_hasta === "") {
      fecha_desde = fechaHoy;
      fecha_hasta = fechaHoy;
    }

    if (fecha_hasta == "") {
      fecha_hasta = fecha_desde;
    }

    if (fecha_desde == "") {
      fecha_desde = fecha_hasta;
    }

    console.log(req.body);

    Turnos.count({
      where: {
        [Op.and]: [
          { estado_envio: { [Op.in]: [2, 3] } },
          {
            updatedAt: {
              [Op.between]: [
                fecha_desde + " 00:00:00",
                fecha_hasta + " 23:59:59",
              ],
            },
          },
        ],
      },
      //order: [["createdAt", "DESC"]],
    })
      .then((result) => res.json(result))
      .catch((error) => {
        res.status(402).json({
          msg: error.menssage,
        });
      });
  });

  app
    .route("/turnos/:id_turno")
    .get((req, res) => {
      Turnos.findOne({
        where: req.params,
        include: [
          {
            model: Users,
            attributes: ["user_fullname"],
          },
        ],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(404).json({
            msg: error.message,
          });
        });
    })
    .put((req, res) => {
      Turnos.update(req.body, {
        where: req.params,
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    })
    .delete((req, res) => {
      //const id = req.params.id;
      Turnos.destroy({
        where: req.params,
      })
        .then(() => res.json(req.params))
        .catch((error) => {
          res.status(412).json({
            msg: error.message,
          });
        });
    });

  function injeccionFirebird() {
    console.log("Se actualiza el PSQL");
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
        // Trae los ultimos 50 registros de turnos del JKMT
        "SELECT * FROM VW_RESUMEN_TURNOS_HOY ROWS 50",
        //"SELECT COUNT(*) FROM VW_RESUMEN_TURNOS_HOY",
        function (err, result) {
          console.log("Cant de turnos obtenidos del JKMT:", result.length);

          // Recorre el array que contiene los datos e inserta en la base de postgresql
          result.forEach((e) => {
            // Si el nro de cert trae NULL cambiar por 000000
            if (!e.NRO_CERT) {
              e.NRO_CERT = " ";
            }
            // Si no tiene plan
            if (!e.PLAN_CLIENTE) {
              e.PLAN_CLIENTE = " ";
            }
            // Si la hora viene por ej: 11:0 entonces agregar el 0 al final
            if (e.HORA[3] === "0") {
              e.HORA = e.HORA + "0";
            }
            // Si la hora viene por ej: 10:3 o 11:2 entonces agregar el 0 al final
            if (e.HORA.length === 4 && e.HORA[0] === "1") {
              e.HORA = e.HORA + "0";
            }
            // Si el nro de tel trae NULL cambiar por 595000 y cambiar el estado a 2
            // Si no reemplazar el 0 por el 595
            if (!e.TELEFONO_MOVIL) {
              e.TELEFONO_MOVIL = "595000";
              e.estado_envio = 2;
            } else {
              e.TELEFONO_MOVIL = e.TELEFONO_MOVIL.replace(0, "595");
            }

            // Reemplazar por mi nro para probar el envio
            // if (!e.TELEFONO_MOVIL) {
            //   e.TELEFONO_MOVIL = "595000";
            //   e.estado_envio = 2;
            // } else {
            //   e.TELEFONO_MOVIL = "595986153301";
            // }

            Turnos.create(e)
              //.then((result) => res.json(result))
              .catch((error) => console.log(error.message));
          });

          // IMPORTANTE: cerrar la conexion
          db.detach();
        }
      );
    });
  }

  setInterval(() => {
    let hoyAhora = new Date();
    let horaAhora = hoyAhora.getHours();
    let diaHoy = hoyAhora.toString().slice(0, 3);
    console.log("Hoy es:", diaHoy, "la hora es:", horaAhora);

    if (horaAhora >= horaEntrada && horaAhora <= horaSalida) {
      //this.mood = "Trabajando! ???????????????";
      injeccionFirebird();
    } else {
      //this.mood = "Durmiendo! ????";
      console.log("Ya no se consulta al JKMT!");
    }
  }, tiempoRetrasoSQL);
};
