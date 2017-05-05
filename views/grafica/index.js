(function() {
  'use strict';

  exports.grafica = function(req, res) {
      req.app.db.models.User.findById(req.user.id, {'username':1,'empresa':1}).exec(function(err, user) {
          if (err)
          req.app.db.models.area.find({},{'data':1}).exec(function(err, areas) {
              if (err) {
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
      if (err)
      var ars= [];
      var respuesta,od,oc,ob,oa,ra,rb,rc,rd,encabezado;
        for (var i = 0; i < ask.length; i++) {
          for (var s = 0; s < ask[i].data.length; s++) {
          if (ask[i].data[s].titulo === 'Encabezado') {
            encabezado = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Texto de la opción A') {
            oa = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Texto de la opción B') {
            ob = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Texto de la opción C') {
            oc = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Texto de la opción D') {
            od = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Peso A') {
            ra = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Peso B') {
            rb = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Peso C') {
            rc = ask[i].data[s].valor;
          }
          if (ask[i].data[s].titulo === 'Peso D') {
            rd = ask[i].data[s].valor;
          }
        }
        ars.push({
          'id':ask[i]._id,
          'OA':oa,
          'OB':ob,
          'OC':oc,
          'OD':od,
          'RA':parseInt(ra|0),
          'RB':parseInt(rb|0),
          'RC':parseInt(rc|0),
          'RD':parseInt(rd|0),
          'text':encabezado
        });
      }

      res.send({'ask':ars});
    });
  };
  exports.niveles = function(req, res) {
    req.app.db.models.nivel.find({},{'data':1}).exec(function(err, ask) {
      if (err)
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
            res.send('Error');
        } else {
            res.send('Ok');
        }
    });
  };
  exports.historial = function(req, res) {
    req.app.db.models.User.findById(req.user.id, {'username':1,'empresa':1}).exec(function(err, user) {
      req.app.db.models.registro.find({'empresa':user.empresa}).sort({"fecha_creacion": -1}).exec(function(err, ask) {
        if (err)
        res.render('grafica/historial',{'historial':ask});
      });
    });
  };

  exports.data = function(req, res) {
      req.app.db.models.indicador.find({'data.valor': req.body.area},{'data':1}).exec(function(err, info) {
          //{"$or": [{'data.valor': req.body.area}, {'data.valor': 'Activo'}]}
          if (err) {
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
