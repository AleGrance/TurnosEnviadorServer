module.exports = (app) => {
    const Historicos = app.db.models.Historicos;
  
    app
      .route("/historicos")
      .get((req, res) => {
        Historicos.findAll()
          .then((result) => res.json(result))
          .catch((error) => {
            res.status(402).json({
              msg: error.menssage,
            });
          });
      })
      // .post((req, res) => {
      //   Historicos.create(req.body)
      //     .then((result) => res.json(result))
      //     .catch((error) => res.json(error));
      // });
  
    // app
    //   .route("/roles/:role_id")
    //   .get((req, res) => {
    //     Roles.findOne({
    //       where: req.params,
    //     })
    //       .then((result) => res.json(result))
    //       .catch((error) => {
    //         res.status(404).json({
    //           msg: error.message,
    //         });
    //       });
    //   })
    //   .put((req, res) => {
    //     Roles.update(req.body, {
    //       where: req.params,
    //     })
    //       .then((result) => res.sendStatus(204))
    //       .catch((error) => {
    //         res.status(412).json({
    //           msg: error.message,
    //         });
    //       });
    //   })
    //   .delete((req, res) => {
    //     //const id = req.params.id;
    //     Roles.destroy({
    //       where: req.params,
    //     })
    //       .then(() => res.json(req.params))
    //       .catch((error) => {
    //         res.status(412).json({
    //           msg: error.message,
    //         });
    //       });
    //   });
    
  };
  