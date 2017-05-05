'use strict';

exports.init = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
        }
        req.app.db.models.impreso.find({'usuario':user.username}).exec(function(err, doc) {
          if (doc.length > 0) {
          res.render('subirImagen/index', {
            'usuario': user.username,
            'imagen':'data:image/png;base64,'+doc[0].foto,
            'titulo':doc[0].titulo
          });
        }else{
          res.render('subirImagen/index', {
            'usuario': user.username,
            'imagen':'/images/profile.png',
            'titulo':'Configuración Pendiente'
          });
        }
        });
    });
};
var formidable = require('formidable');
var fs = require('fs-extra');
var util = require('util');
var multer	=	require('multer');
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (request, file, callback) {
    callback(null, file.originalname)
  }
});
exports.subir  = function(req, res) {
  var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var data ={
        'titulo':fields.titulo,
        'usuario':fields.usuario,
        'foto': new Buffer(fs.readFileSync(files.userPhoto.path)).toString('base64'),
        fecha_creacion:new Date()
      };

      req.app.db.models.impreso.update({'usuario':fields.usuario},data,{ upsert: true },function(err, doc) {
        if(err) {
          return res.end("Error Subiendo Imagen.");
        }else{
        }
      });
      
      res.end('<img id="area" src="data:image/png;base64,'+new Buffer(fs.readFileSync(files.userPhoto.path)).toString('base64')+'"/>');
    });

    form.on('end', function(fields, files) {
      /* Temporary location of our uploaded file */
      var temp_path = this.openedFiles[0].path;
      fs.unlink(temp_path);
    });
};
