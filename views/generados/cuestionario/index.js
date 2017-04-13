(function() {

    exports.init = function(req, res) {
        if (req.user === undefined) {
            res.redirect('/login/');
        }
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
            }


            var ip;
            if (req.headers['x-forwarded-for']) {
                ip = req.headers['x-forwarded-for'].split(",")[0];
            } else if (req.connection && req.connection.remoteAddress) {
                ip = req.connection.remoteAddress;
            } else {
                ip = req.ip;
            }
            console.log("cliente->" + ip);
            res.render('generados/cuestionario/inicio', {
                'usuario': user.username,
                'modulo': 'cuestionario',
            });

        });
    };

    exports.actualizar = function(req, res) {
        var item = req.body;
        req.app.db.models.cuestionario.update({
            '_id': item._id
        }, item, function(err, doc) {
            if (err) {
                console.log(err);
                res.send('Error');
            } else {
                res.send('Ok');
            }
        });
    };
    exports.eliminar = function(req, res, next) {
        console.log("delete " + JSON.stringify(req.body));

        req.app.db.models.cuestionario.findByIdAndRemove(req.body.id, function(err, account) {
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
        req.app.db.models.cuestionario.create(item, function(err, doc) {
            if (err) {
                console.log(err);
                res.send('Error');
            } else {
                res.send('Ok');
            }
        });
    };
    exports.buscar = function(req, res) {

        req.app.db.models.cuestionario.find({
            'data.dane': req.body.dane
        }, {
            'data.dane': 1,
            'data.direccion': 1,
            'data.nombre': 1
        }, function(err, doc) {

            if (err) {
                console.log(err);
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
        req.app.db.models.cuestionario.findById(req.body.id, {
            'data': 1
        }, function(err, doc) {
            if (err) {
                console.log(err);
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
                console.log(err);
            }
            req.app.db.models.cuestionario.find({
            }).sort({
                "fecha_creacion": -1
            }).exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {

                    res.send(doc);
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
                console.log(err);
            }
            res.render('generados/cuestionario/personalizar', {
                'usuario': user.username,
                'modulo': 'cuestionario'
            });
        });
    };


    exports.eliminarTodo = function(req, res, next) {
        req.app.db.models.User.findById(req.user.id, {
            'username': 1
        }).exec(function(err, user) {
            req.app.db.models.campo.remove({
                'modulo': 'cuestionario'
            }, function(err, account) {
                if (err) {
                    console.log(err);
                    res.send('Error');
                } else {
                    console.log('Eliminado');
                    res.send('Ok');
                }
            });
        });
    };

    exports.ingresar2 = function(req, res) {
        var item = req.body;
        console.log(item);
        req.app.db.models.campo.create(item, function(err, doc) {
            if (err) {
                console.log("--->" + err);
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
                console.log(err);
            }
            req.app.db.models.campo.find({
                'modulo': 'cuestionario'
            }).sort({
                'indice': 1
            }).exec(function(err, doc) {

                if (err) {
                    console.log("----->" + err);
                } else {
                    res.send(doc);
                }
            });
        });
    };

    exports.nombrar = function(req, res) {
        req.app.db.models.cuestionario.find({
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
                req.app.db.models.cuestionario.update({
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
            console.log(file);
            callback(null, file.originalname);
        }
    });

    exports.init3 = function(req, res) {
        if (req.user === undefined) {
            res.redirect('/login/');
        }
        req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
            if (err) {
                console.log(err);
            }
            res.render('generados/cuestionario/migrar', {
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
                        'modulo': 'cuestionario'
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
                                    if (doc[r].label === Object.keys(jsonObj[i])[s]) {
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
                                'modulo': 'cuestionario',
                                'usuario': fields.usuario
                            };
                            /**
                             * @autor:godie007
                             * @date: 2016/12/23 00:55
                             * Se ingresan Lo Registros a la Base de Datos
                             **/
                            req.app.db.models.cuestionario.create(data);
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
