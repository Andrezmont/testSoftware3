(function() {
  'use strict';

  exports.grafica = function(req, res) {
      req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
          if (err) {
              console.log(err);
          }
          res.render('grafica/index');
      });
  };

  exports.data = function(req, res) {
      req.app.db.models.indicador.find({'data.valor':'Activo'},{'data':1}).exec(function(err, info) {
          if (err) {
              console.log(err);
          }
          var entrada = [];

          for (var i = 0; i < info.length; i++) {
            var titulo;
            var descripcion;
            var max;
            var min;
            for (var s = 0; s < info[i].data.length; s++) {
              if (info[i].data[s].titulo === 'Nombre') {
                titulo = info[i].data[s].valor;
              }
              if (info[i].data[s].titulo === 'Valor Minimo') {
                min = info[i].data[s].valor;
              }
              if (info[i].data[s].titulo === 'Valor Maximo') {
                max = info[i].data[s].valor;
              }
              if (info[i].data[s].titulo === 'Descripción') {
                descripcion = info[i].data[s].valor;
              }
            }
            entrada.push ({'titulo' : titulo,'descripcion': descripcion,'max': parseInt(max),'min': parseInt(min)});
          }

          res.send(entrada);
      });
  };
}());
