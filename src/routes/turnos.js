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

  // Trae los turnos que tengan en el campo estado_envio = 0 indica que son los que aun no se han enviado por el enviador
  app.route("/turnosPendientes").get((req, res) => {
    Turnos.findAll({
      where: { estado_envio: 0 },
      order: [["createdAt", "DESC"]],
    })
      .then((result) => res.json(result), injeccionFirebird())
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
    Firebird.attach(odontos, function (err, db) {
      if (err) throw err;

      // db = DATABASE
      db.query(
        "SELECT * FROM VW_RESUMEN_TURNOS_HOY ROWS 50",
        //"SELECT COUNT(*) FROM VW_RESUMEN_TURNOS_HOY",
        function (err, result) {
          console.log(result[0]);

          // Recorre el array que contiene los datos e inserta en la base de postgresql
          result.forEach((e) => {
            
            // if (!e.TELEFONO_MOVIL) {
            //   e.TELEFONO_MOVIL = "000000";
            // } else {
            //   e.TELEFONO_MOVIL = e.TELEFONO_MOVIL.replace(0, "595");
            // }

            if (e.TELEFONO_MOVIL) {
              e.TELEFONO_MOVIL = e.TELEFONO_MOVIL.replace(0, "595");
            }

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
};
