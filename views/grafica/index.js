(function() {
  'use strict';

  exports.grafica = function(req, res) {
      req.app.db.models.User.findById(req.user.id, {'username':1,'empresa':1}).exec(function(err, user) {
          if (err) console.log(err);
          req.app.db.models.area.find({},{'data':1}).exec(function(err, areas) {
              if (err) {
                  console.log(err);
                }

                var ars= [];
                for (var i = 0; i < areas.length; i++) {
                  ars.push({'id':areas[i]._id,'name':areas[i].data[0].valor});
                }
          res.render('grafica/index',{'areas':ars,'usuario':user.username,'empresa':user.empresa});
        });
      });
  };
  exports.cuestionario = function(req, res) {
    req.app.db.models.cuestionario.find({'data.valor': req.body.area},{'data':1}).exec(function(err, ask) {
      if (err) console.log(err);
      var ars= [];
      for (var i = 0; i < ask.length; i++) {
        ars.push({
          'id':ask[i]._id,
          'respuesta':ask[i].data[0].valor,
          'OD':ask[i].data[2].valor,
          'OC':ask[i].data[3].valor,
          'OB':ask[i].data[4].valor,
          'OA':ask[i].data[5].valor,
          'text':ask[i].data[6].valor
        });
      }
      res.send({'ask':ars});
    });
  };
  exports.niveles = function(req, res) {
    req.app.db.models.nivel.find({},{'data':1}).exec(function(err, ask) {
      if (err) console.log(err);
      var ars= [];
      for (var i = 0; i < ask.length; i++) {
        ars.push({
          'max':parseInt(ask[i].data[0].valor),
          'min':parseInt(ask[i].data[1].valor),
          'nivel':ask[i].data[3].valor
        });
      }
      res.send({'ask':ars});
    });
  };
  exports.registro = function(req, res) {
    var item = req.body;
    //item.data.campos[0].valor = parseInt(item[0].data.campos[0].valor);
    req.app.db.models.registro.create(item, function(err, doc) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.send('Ok');
        }
    });
  };
  exports.historial = function(req, res) {
    req.app.db.models.registro.find({}).exec(function(err, ask) {
      if (err) console.log(err);
      res.render('grafica/historial',{'historial':ask});
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
            var formula;
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
              if (info[i].data[s].titulo === 'Fórmula') {
                formula = info[i].data[s].valor;
              }
            }
            if (bandera) {
              entrada.push ({'titulo' : titulo,'descripcion': descripcion,'max': parseInt(max),'min': parseInt(min),'formula':formula});
            }
          }

          res.send(entrada);
      });
  };
}());
