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
  app
    .route("/turnosPendientes")
    .get((req, res) => {
      Turnos.findAll({
        where: {estado_envio: 0},
        order: [["createdAt", "DESC"]],
      })
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(402).json({
            msg: error.menssage,
          });
        });
    })

  app
    .route("/turnos/:id_turno")
    .get((req, res) => {
      Turnos.findOne({
        where: req.params,
        include: [
          {
            model: Users,
            attributes: ['user_fullname']
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
};
