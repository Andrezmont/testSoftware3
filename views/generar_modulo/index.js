(function() {
    'use strict';

    exports.init = function(req, res) {
        req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
            if (err) {
            }
            res.render('generar_modulo/index');
        });
    };

    exports.generar = function(req, res) {
        req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
            if (err) {
            }

            function replaceAll(str, find, replace) {
                return str.replace(new RegExp(find, 'g'), replace);
            }
            var userid = require('userid');
            var fs = require('fs-extra');
            // si el modulo ya existe
            var raiz = './views/generados/' + req.body.nombre;
            var usuario = userid.uid("godie007");
            var grupo = userid.gid("godie007");
            if (!fs.existsSync(raiz)) {
                // crear la carpeta raiz del proyecto
                fs.mkdirSync(raiz);

                // copiar modulo base para el nuevo modulo
                fs.copySync('./views/generados/template/', raiz);

                // se dan permisos de lectura y escritura a la carpeta y sus archivos
                fs.chmodSync(raiz, '770');
                fs.chmodSync(raiz + '/index.js', '770');
                fs.chmodSync(raiz + '/inicio.jade', '770');
                fs.chmodSync(raiz + '/migrar.jade', '770');
                fs.chmodSync(raiz + '/personalizar.jade', '770');
                // se asigna el nuevo dueño del directorio y archivos
                fs.chownSync(raiz, usuario, grupo);
                fs.chownSync(raiz + '/index.js', usuario, grupo);
                fs.chownSync(raiz + '/inicio.jade', usuario, grupo);
                fs.chownSync(raiz + '/migrar.jade', usuario, grupo);
                fs.chownSync(raiz + '/personalizar.jade', usuario, grupo);

                //se reemplza la palabra template por la nueva en el archivo index.js
                fs.readFile(raiz + '/index.js', 'utf8', function(err, data) {
                    if (err) {
                        return
                    }
                    var result = replaceAll(data, 'template', req.body.nombre);
                    fs.writeFile(raiz + '/index.js', result, 'utf8', function(err) {
                        if (err) return
                    });
                });
                //se reemplza la palabra template por la nueva en el archivo inicio.jade
                fs.readFile(raiz + '/inicio.jade', 'utf8', function(err, data) {
                    if (err) {
                        return
                    }
                    var result = replaceAll(data, 'template', req.body.nombre);
                    fs.writeFile(raiz + '/inicio.jade', result, 'utf8', function(err) {
                        if (err) return
                    });
                });
                //se reemplza la palabra template por la nueva en el archivo migrar.jade
                fs.readFile(raiz + '/migrar.jade', 'utf8', function(err, data) {
                    if (err) {
                        return
                    }
                    var result = replaceAll(data, 'template', req.body.nombre);
                    fs.writeFile(raiz + '/migrar.jade', result, 'utf8', function(err) {
                        if (err) return
                    });
                });
                //se reemplza la palabra template por la nueva en el archivo personalizar.jade
                fs.readFile(raiz + '/personalizar.jade', 'utf8', function(err, data) {
                    if (err) {
                        return
                    }
                    var result = replaceAll(data, 'template', req.body.nombre);
                    fs.writeFile(raiz + '/personalizar.jade', result, 'utf8', function(err) {
                        if (err) return
                    });
                });

                // copiar el Schema de template al nuevo
                fs.copySync('./schema/template.js', './schema/' + req.body.nombre + '.js');
                // se dan permisos al nuevo archivo
                fs.chmodSync('./schema/' + req.body.nombre + '.js', '770');
                // se cambia el dueño al nuevo archivo
                fs.chownSync('./schema/' + req.body.nombre + '.js', usuario, grupo);
                //se reemplza la palabra template por la nueva en el archivo personalizar.jade
                fs.readFile('./schema/' + req.body.nombre + '.js', 'utf8', function(err, data) {
                    if (err) {
                        return
                    }
                    var result = replaceAll(data, 'template', req.body.nombre);
                    fs.writeFile('./schema/' + req.body.nombre + '.js', result, 'utf8', function(err) {
                        if (err) return
                    });

                });
                // se asocia el nuevo esquema al aplicativo
                var data = fs.readFileSync('./models.js').toString().split("\n");
                data.splice(4, 0, "    require('./schema/" + req.body.nombre + "')(app, mongoose);");
                var text = data.join("\n");
                fs.writeFile('./models.js', text);

                var salida = "    // account >" + req.body.nombre + "\n";
                salida += "    app.get('/account/" + req.body.nombre + "/dinamica/', require('./views/generados/" + req.body.nombre + "/index').init2);\n";
                salida += "    app.post('/account/" + req.body.nombre + "/dinamica/', require('./views/generados/" + req.body.nombre + "/index').ingresar2);\n";
                salida += "    app.delete('/account/" + req.body.nombre + "Todo/', require('./views/generados/" + req.body.nombre + "/index').eliminarTodo);\n";
                salida += "    app.post('/account/formulario/" + req.body.nombre + "/', require('./views/generados/" + req.body.nombre + "/index').formulario);\n";
                salida += "    app.get('/account/" + req.body.nombre + "/migrar', require('./views/generados/" + req.body.nombre + "/index').init3);\n";
                salida += "    app.post('/account/" + req.body.nombre + "/migrar', require('./views/generados/" + req.body.nombre + "/index').subir);\n";
                salida += "    app.put('/account/" + req.body.nombre + "/nombrar', require('./views/generados/" + req.body.nombre + "/index').nombrar);\n";
                salida += "    app.get('/account/" + req.body.nombre + "/', require('./views/generados/" + req.body.nombre + "/index').init);\n";
                salida += "    app.put('/account/" + req.body.nombre + "/', require('./views/generados/" + req.body.nombre + "/index').actualizar);\n";
                salida += "    app.post('/account/" + req.body.nombre + "/', require('./views/generados/" + req.body.nombre + "/index').ingresar);\n";
                salida += "    app.delete('/account/" + req.body.nombre + "/', require('./views/generados/" + req.body.nombre + "/index').eliminar);\n";
                salida += "    app.post('/account/" + req.body.nombre + "/ver', require('./views/generados/" + req.body.nombre + "/index').ver);\n";
                salida += "    app.get('/account/" + req.body.nombre + "/listar', require('./views/generados/" + req.body.nombre + "/index').listar);\n";

                // se agregan las nuevas rutas
                var info = fs.readFileSync('./routes.js').toString().split("\n");
                info.splice(160, 0, salida);
                var resp = info.join("\n");
                fs.writeFile('./routes.js', resp);
                res.send('Ok');


            } else {
                res.send('El Modulo Ya Existe');
            }

        });
    };

    exports.eliminar = function(req, res) {
        req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
            if (err) {
            }
            var fs = require('fs-extra');
            // si el modulo ya existe
            var raiz = './views/generados/' + req.body.nombre;

            if (fs.existsSync(raiz)) {
                fs.removeSync('./schema/' + req.body.nombre + '.js');
                fs.readFile('./models.js', 'utf8', function(err, data) {
                    if (err) {
                        return
                    }
                    var salida = "";
                    for (var i = 0; i < data.split("\n").length; i++) {
                        if (data.split("\n")[i].indexOf(req.body.nombre) === -1) {
                            salida += data.split("\n")[i] + "\n";
                        }
                    }
                    if (salida !== "") {
                        fs.writeFile('./models.js', salida, function(err) {
                            if (err) {
                            }
                        });
                    }
                });

                fs.readFile('./routes.js', 'utf8', function(err, data) {
                    if (err) {
                    }
                    var salida = "";
                    for (var i = 0; i < data.split("\n").length; i++) {
                        if (data.split("\n")[i].indexOf(req.body.nombre) === -1) {
                            salida += data.split("\n")[i] + "\n";
                        }
                    }
                    if (salida !== "") {
                        fs.writeFile('./routes.js', salida, function(err) {
                          if (err) {
                          }
                        });
                    }
                });

                fs.removeSync(raiz);
                res.send([]);
            }
        });
    };
}());
