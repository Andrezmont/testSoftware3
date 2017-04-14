(function() {
  'use strict';

  exports.grafica = function(req, res) {
      req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
          if (err) console.log(err);
          req.app.db.models.area.find({},{'data':1}).exec(function(err, areas) {
              if (err) {
                  console.log(err);
                }

                var ars= [];
                for (var i = 0; i < areas.length; i++) {
                  ars.push({'id':areas[i]._id,'name':areas[i].data[0].valor});
                }
          res.render('grafica/index',{'areas':ars});
        });
      });
  };

  exports.data = function(req, res) {
      req.app.db.models.indicador.find({'data.valor': req.body.area},{'data':1}).exec(function(err, info) {
          //{"$or": [{'data.valor': req.body.area}, {'data.valor': 'Activo'}]}
          if (err) {
              console.log(err);
          }
          var entrada = [];

          for (var i = 0; i < info.length; i++) {
            var titulo;
            var descripcion;
            var max;
            var min;
            var bandera = false;
            for (var s = 0; s < info[i].data.length; s++) {
              if (info[i].data[s].valor ==="Activo" ) {
                bandera = true;
              }
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
            if (bandera) {
              entrada.push ({'titulo' : titulo,'descripcion': descripcion,'max': parseInt(max),'min': parseInt(min)});
            }
          }

          res.send(entrada);
      });
  };
}());
