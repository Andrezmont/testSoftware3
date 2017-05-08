(function() {

    exports.init = function(req, res) {
        if (req.user === undefined) {
            res.redirect('/login/');
        }
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            if (err) {
            }


            var ip;
            if (req.headers['x-forwarded-for']) {
                ip = req.headers['x-forwarded-for'].split(",")[0];
            } else if (req.connection && req.connection.remoteAddress) {
                ip = req.connection.remoteAddress;
            } else {
                ip = req.ip;
            }
            res.render('generados/indicador/inicio', {
                'usuario': user.username,
                'modulo': 'indicador',
            });

        });
    };

    exports.actualizar = function(req, res) {
        var item = req.body;
        req.app.db.models.indicador.update({
            '_id': item._id
        }, item, function(err, doc) {
            if (err) {
                res.send('Error');
            } else {
                res.send('Ok');
            }
        });
    };
    exports.eliminar = function(req, res, next) {

        req.app.db.models.indicador.findByIdAndRemove(req.body.id, function(err, account) {
            if (err) {
                res.send('Error');
            } else {
                res.send('Ok');
            }
        });


    };
    exports.ingresar = function(req, res) {
        var item = req.body;
        //item.data.campos[0].valor = parseInt(item[0].data.campos[0].valor);
        req.app.db.models.indicador.create(item, function(err, doc) {
            if (err) {
                res.send('Error');
            } else {
                res.send('Ok');
            }
        });
    };
    exports.buscar = function(req, res) {

        req.app.db.models.indicador.find({
            'data.dane': req.body.dane
        }, {
            'data.dane': 1,
            'data.direccion': 1,
            'data.nombre': 1
        }, function(err, doc) {

            if (err) {
            } else {
                if (doc[0] !== undefined && doc[0] !== '') {
                    res.send(doc[0].data);
                } else {
                    res.send({});
                }
            }
        });
    };


    exports.ver = function(req, res) {
        req.app.db.models.indicador.findById(req.body.id, {
            'data': 1
        }, function(err, doc) {
            if (err) {
            } else {
                res.send(doc.data);
            }
        });
    };

    exports.listar = function(req, res) {
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            if (err) {
            }
            req.app.db.models.indicador.find({
            }).sort({
                "fecha_creacion": -1
            }).exec(function(err, indicador) {
                if (err) {
                } else {
                    req.app.db.models.area.find({}).exec(function(err, area) {
                      var doc = indicador;
                      for (var i = 0; i < doc.length; i++) {
                        for (var f = 0; f < doc[i].data.length; f++) {
                          if (doc[i].data[f].titulo ==="Área") {
                            var idArea = doc[i].data[f].valor;
                            for (var s = 0; s < area.length; s++) {
                              if (String(area[s]._id) === String(idArea)) {
                                doc[i].data[f].valor = area[s].data[0].valor;
                              }
                            }
                          }
                        }
                      }

                      res.send(doc);
                    });
                }
            });
        });
    };

    exports.init2 = function(req, res) {
        if (req.user === undefined) {
            res.redirect('/login/');
        }
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            if (err) {
            }
            res.render('generados/indicador/personalizar', {
                'usuario': user.username,
                'modulo': 'indicador'
            });
        });
    };


    exports.eliminarTodo = function(req, res, next) {
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            req.app.db.models.campo.remove({
                'modulo': 'indicador'
            }, function(err, account) {
                if (err) {
                    res.send('Error');
                } else {
                    res.send('Ok');
                }
            });
        });
    };

    exports.ingresar2 = function(req, res) {
        var item = req.body;
        req.app.db.models.campo.create(item, function(err, doc) {
            if (err) {
            } else {
                res.send({
                    'exitoso': 'si'
                });
            }
        });
    };

    exports.formulario = function(req, res) {
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            if (err) {
            }
            req.app.db.models.campo.find({
                'modulo': 'indicador'
            }).sort({
                'indice': 1
            }).exec(function(err, doc) {
                if (err) {
                } else {
                  /**
                  * @autor:godie007
                  * @date: 2017/04/14 22:56
                  * Se programa la lista de valores para Areas para el plugin FormBuilder
                  **/
                  req.app.db.models.area.find({},{'data':1},function(err,area) {
                    var temp = [];
                    for (var i = 0; i < doc.length; i++) {
                      if (doc[i].label ==="Área") {
                        for (var h = 0; h < area.length; h++) {
                          doc[i].values[h] = {'value':area[h]._id,'label':area[h].data[0].valor};
                        }
                      }
                      temp.push(doc[i]);
                    }
                    res.send(temp);
                  });
                }
            });
        });
    };

    exports.nombrar = function(req, res) {
        req.app.db.models.indicador.find({
            'usuario': req.body.usuario
        }, {
            'data': 1
        }, function(err, doc) {
            for (var i = 0; i < doc.length; i++) {
                for (var s = 0; s < doc[i].data.length; s++) {
                    if (doc[i].data[s].titulo === req.body.valorAnterior) {
                        doc[i].data[s].titulo = req.body.valorActual;
                        break;
                    }
                }
                req.app.db.models.indicador.update({
                    '_id': doc[i]._id
                }, doc[i]);
            }
            res.send('Se Renombro Exitosamente!');
        });
    };


    var Converter = require("csvtojson").Converter;
    var fs = require('fs');
    var multer = require('multer');
    var formidable = require('formidable');

    var storage = multer.diskStorage({
        destination: function(request, file, callback) {
            callback(null, './public/uploads');
        },
        filename: function(request, file, callback) {
            callback(null, file.originalname);
        }
    });

    exports.init3 = function(req, res) {
        if (req.user === undefined) {
            res.redirect('/login/');
        }
        req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
            if (err) {
            }
            res.render('generados/indicador/migrar', {
                'usuario': user.username
            });
        });
    };
    exports.subir = function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {

            var csvConverter = new Converter({});

            csvConverter.on("end_parsed", function(jsonObj) {
                /**
                 * @autor:godie007
                 * @date: 2016/12/23 00:14
                 * Se Eliminan Campos Innesesarios al Cargar la Migracion
                 **/
                for (var i = 0; i < jsonObj.length; i++) {
                    delete jsonObj[i].field1;
                    delete jsonObj[i]['N°'];
                    delete jsonObj[i]['Acción'];
                }

                req.app.db.models.User.findById(req.user.id, {
                    'username': 1
                }).exec(function(err, user) {
                    /**
                     * @autor:godie007
                     * @date: 2016/12/23 01:20
                     * Se toman los campos de la Interfaz y se compara con los campos del CSV
                     **/
                    req.app.db.models.campo.find({
                        'modulo': 'indicador'
                    }, function(err, doc) {
                        /**
                         * @autor:godie007
                         * @date: 2016/12/23 00:43
                         * Se hace la conversion de la informacion JSON al plugin Builder
                         **/
                        for (var i = jsonObj.length - 1; i >= 0; i--) {
                            var datos = [];
                            for (var s = 0; s < Object.keys(jsonObj[i]).length; s++) {
                                var id = 'otro';
                                for (var r = 0; r < doc.length; r++) {
                                    if (doc[r].label === Object.keys(jsonObj[i])[s].replace(new RegExp(" ","g"), "_")) {
                                        id = doc[r].name;
                                        break;
                                    }
                                }
                                datos[s] = {
                                    'titulo': Object.keys(jsonObj[i])[s],
                                    'valor': jsonObj[i][Object.keys(jsonObj[i])[s]],
                                    'id': id
                                };

                            }
                            var data = {
                                'data': datos,
                                'modulo': 'indicador',
                                'usuario': fields.usuario
                            };
                            /**
                             * @autor:godie007
                             * @date: 2016/12/23 00:55
                             * Se ingresan Lo Registros a la Base de Datos
                             **/
                            req.app.db.models.indicador.create(data);
                        }

                        res.send('<div class="alert alert-info">Se Importo Correctamente!</div>');
                    });
                });
            });
            //Se lee el CSV
            fs.createReadStream(files.userPhoto.path).pipe(csvConverter);
            // se elimina el archivo Cargado Temporalmente
            fs.unlinkSync(files.userPhoto.path);
        });

    };
}());
