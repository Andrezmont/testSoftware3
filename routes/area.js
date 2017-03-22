(function() {

exports.listar = function(req, res) {
  req.app.db.models.area.find({}).sort({"fecha_creacion": -1}).exec(function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          res.send(doc);
      }
  });
};

exports.formulario = function(req, res) {

  req.app.db.models.campo.find({
      'modulo': 'area'
  }).sort({
      'indice': 1
  }).exec(function(err, doc) {

      if (err) {
          console.log("----->" + err);
      } else {
          console.log(doc);
          res.send(doc);
      }
    });
  };

}());
