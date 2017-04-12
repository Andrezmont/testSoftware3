'use strict';

function formatAMPM(d) {
    var today = d;
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h ? h : 12; // the hour '0' should be '12'
    h = (h % 12 == 0) ? 12 : h % 12;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return (h + ':' + m + ':' + s + ' ' + ampm);
} 

exports.init = function(req, res) {
    if (req.user === undefined) {
      res.redirect('/login/');
    }
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        function numeroAleatorioEntero(min, max) {
            var num = Math.random() * (max - min);
            return parseInt(num + min);
        }
        var date = new Date();
        var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
        var numeroFecha = date.getDate() + '' + (date.getMonth() + 1) + "" + date.getFullYear();
        req.app.db.models.inventario.find({
            'usuario': user.username
        }).exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                var salida = '<option value="-1"> Seleccionar...</option>';
                for (var i = 0; i < doc.length; i++) {
                    salida += '<option value="' + doc[i]._id + '" class="' + doc[i].data['Valor'] + '">' + doc[i].data['Nombre'] + ' ($' + doc[i].data['Valor'] + ')</option>';
                }
                req.app.db.models.factura.find({
                    'estado': 'Activo'
                }, {
                    'usuario': user.username,
                    'numeroFactura': 1
                }).sort({
                    "numeroFactura": -1
                }).limit(1).exec(function(err, num) {
                    var factura = 0;
                    if (num.length > 0) {
                        factura = num[0].numeroFactura;
                    }
                    res.render('facturacion/index', {
                        usuario: user.username,
                        entrada: salida,
                        fecha: fecha,
                        numFactura: (parseInt(factura) + 1)
                    });
                });
            }
        });
    });
};
exports.actualizar = function(req, res) {
    var item = req.body;
    console.log(JSON.stringify(item));

    var date = new Date();
    var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);


};
exports.eliminar = function(req, res, next) {
    req.app.db.models.factura.findById(req.body.id, function(err, factura) {
        for (var i = 0; i < factura.data.length; i++) {
            req.app.db.models.inventario.update({
                    "_id": factura.data[i].productoID
                }, {
                    $inc: {
                        'data.Cantidad': factura.data[i].cantidad
                    }
                },
                function(err, results) {
                    if (err) {
                        console.log(err);
                        res.send({
                            'error': 'si'
                        });
                    } else {
                        console.log("Se actualiza Inventario");
                    }
                });
        }
    });
    req.app.db.models.factura.findByIdAndUpdate(req.body.id, {
        $set: {
            'estado': 'Anulado'
        }
    }, function(err, account) {
        if (err) {
            res.send('Error');
        } else {
            res.send('Ok');
        }
    });
};
exports.ingresar = function(req, res) {
    var item = req.body;
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.inventario.find({
            'usuario': user.username
        }, {
            '_id': 1,
            'data': 1
        }).exec(function(err, results) {
            if (err) {
                console.log(err);
                res.send({
                    'error': 'si'
                });
            }

            for (var i = 0; i < item.data.length; i++) {
                var decremento = parseInt(item.data[i].cantidad);
                /**
                 * @autor:godie007
                 * @date: 2016/12/19 17:41
                 * Se buscan el producto para actualizarle la cantidad en inventario
                 **/
                req.app.db.models.inventario.findById(item.data[i].productoID, function(err, doc) {
                    if (err) {
                        console.log(err);
                        res.send({
                            'error': 'si'
                        });
                    } else {
                        var temp = doc;
                        for (var s = 0; s < doc.data.length; s++) {
                            if (doc.data[s].titulo === "Cantidad") {
                                temp.data[s].valor = (temp.data[s].valor - decremento);
                                /**
                                 * @autor:godie007
                                 * @date: 2016/12/19 17:55
                                 * Se actualiza la catidad existente en inventario
                                 **/
                                req.app.db.models.inventario.update({
                                    '_id': doc._id
                                }, temp, function(error, res) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    console.log(res);
                                });
                                break;
                            }
                        }
                    }
                });

            }
        });
        /**
        * @autor:godie007
        * @date: 2016/12/19 17:24
        * Se crea un registro de una nueva Factura
        **/
        req.app.db.models.factura.create(item, function(err, doc) {
            if (err) {
                console.log(err);
                res.send({
                    'error': 'si'
                });
            } else {
                res.send({
                    'error': 'no'
                });
            }
        });
    });
};
exports.buscar = function(req, res) {
    req.app.db.models.factura.find({
        'data.dane': req.body.dane
    }, {
        'data.dane': 1,
        'data.direccion': 1,
        'data.nombre': 1
    }, function(err, doc) {
        console.log(JSON.stringify(doc));
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
    console.log("se recibe " + JSON.stringify(req.body));
    req.app.db.models.factura.findById(req.body.id, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.send(doc);
        }
    });
};
exports.listar = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.factura.find({
            'usuario': user.username
        }).sort({
            'fecha_creacion': -1
        }).limit(100).exec(function(err, doc) {
            var salida = doc;
            for (var i = 0; i < doc.length; i++) {
                salida[i] = {
                    _id: doc[i]._id,
                    indice: doc.length - 1 - i,
                    fecha_creacion: doc[i].fecha_creacion,
                    estado: doc[i].estado,
                    fecha: doc[i].fecha,
                    usuario: doc[i].usuario,
                    numeroFactura: doc[i].numeroFactura,
                    fechaModificacion: doc[i].fechaModificacion,
                    data: doc[i].data
                };
            }
            if (err) {
                console.log(err);
            } else {
                res.send(salida);
            }
        });
    });
};
exports.buscarCantidad = function(req, res) {
    req.app.db.models.inventario.findById(req.body.id, {
        'data': 1
    }, function(err, acc) {
        if (err) {
            console.log(err);
        } else {
            var aux = [];
            var cantidad = -1;

            for (var s = 0; s < acc.data.length; s++) {
                if (acc.data[s].titulo === "Cantidad") {
                    cantidad = parseInt(acc.data[s].valor);
                    break;
                }
            }
            res.send({
                'cantidad': cantidad,
                'indice': req.body.indice
            });
        }
    });
};

function separar(x, simbolo) {
    if (x !== undefined && x !== '') {
        return x.replace(/\B(?=(\d{3})+(?!\d))/g, simbolo);
    }
    return '';
}
exports.imprimir = function(req, res) {
    req.app.db.models.factura.findById(req.params.id).exec(function(err, doc) {
        if (doc !== undefined) {
            var suma = 0;
            for (var i = 0; i < doc.data.length; i++) {
                suma += doc.data[i].precio;
            }
            var date = new Date();
            var fecha = date.getDate() + '/' + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);
            req.app.db.models.Account.find({}).exec(function(err, acc) {
                var variable = [];
                var r = 0;
                for (var s = 0; s < acc.length; s++) {
                    if (acc[s].user.name === doc.usuario) {
                        variable[r] = acc[s];
                        break;
                    }
                }
                req.app.db.models.impreso.find({
                    'usuario': doc.usuario
                }).exec(function(err, acc) {
                    var imagen = 'logo-default.png';
                    var titulo = 'Configuración Pendiente';
                    var nit = '';
                    if (acc.length > 0) {
                        imagen = acc[0].foto;
                        titulo = acc[0].titulo;
                        nit = variable[0].nit;
                    }
                    res.render('facturacion/factura', {
                        'tabla': doc,
                        'total': suma,
                        'hora': doc.fecha,
                        'usuario': variable[0].name.first + ' ' + variable[0].name.middle,
                        'direccion': variable[0].zip,
                        'n_factura': doc.numeroFactura,
                        'estado': doc.estado,
                        'cliente': doc.cliente,
                        'vendedor': doc.vendedor,
                        'dinero_pagado': doc.dinero_pagado,
                        'fecha': fecha,
                        'forma_pago': doc.forma_pago,
                        'descuento': doc.descuento,
                        'imagen': imagen,
                        'titulo': titulo,
                        'nit': nit
                    });
                });
            });
        } else {
            res.send([]);
        }
    });
};
exports.buscarProducto = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.inventario.find({
            'usuario': user.username
        }, {
            'data': 1
        }).exec(function(err, acc) {
            var aux = [];
            for (var i = 0; i < acc.length; i++) {
                var nombre = '';
                var valor = '';
                var id = '';
                for (var s = 0; s < acc[i].data.length; s++) {
                    if (acc[i].data[s].titulo === "Nombre") {
                        nombre = acc[i].data[s].valor;
                    }
                    if (acc[i].data[s].titulo === "Valor") {
                        valor = acc[i].data[s].valor;
                    }
                    id = acc[i]._id;
                }
                aux.push({
                    '_id': id,
                    'nombre': nombre,
                    'valor': valor
                });
            }
            res.render('facturacion/popup', {
                'actuaciones': aux,
                'indice': req.params.indice
            });
        });
    });
};
exports.popupBuscarCliente = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.cliente.find({
            'usuario': user.username
        }).exec(function(err, acc) {
            var aux = [];
            for (var i = 0; i < acc.length; i++) {
                var nombre = '';
                var valor = '';
                var id = '';
                for (var s = 0; s < acc[i].data.length; s++) {
                    if (acc[i].data[s].titulo === "Nombre") {
                        nombre = acc[i].data[s].valor;
                    }
                    if (acc[i].data[s].titulo === "Cedula") {
                        valor = acc[i].data[s].valor;
                    }
                    id = acc[i]._id;
                }
                aux.push({
                    '_id': id,
                    'nombre': nombre,
                    'cedula': valor
                });
            }
            res.render('facturacion/popupClientes', {
                'actuaciones': aux
            });
        });
    });
};
exports.popupIngresarCliente = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.cliente.find({
            'usuario': user.username
        }).exec(function(err, acc) {
            res.render('facturacion/popupNuevoClientes', {
                'actuaciones': acc,
                'usuario': user.username
            });
        });
    });
};
exports.popupBuscarVendedor = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.vendedor.find({
            'usuario': user.username
        }).exec(function(err, acc) {
            var aux = [];
            for (var i = 0; i < acc.length; i++) {
                var nombre = '';
                var valor = '';
                var id = '';
                for (var s = 0; s < acc[i].data.campos.length; s++) {
                    if (acc[i].data.campos[s].titulo === "Nombre") {
                        nombre = acc[i].data.campos[s].valor;
                    }
                    if (acc[i].data.campos[s].titulo === "Cedula") {
                        valor = acc[i].data.campos[s].valor;
                    }
                    id = acc[i]._id;
                }
                aux.push({
                    '_id': id,
                    'nombre': nombre,
                    'cedula': valor
                });
            }
            res.render('facturacion/popupVendedor', {
                'actuaciones': aux
            });
        });
    });
};
exports.popupIngresarVendedor = function(req, res) {
    req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
        if (err) {
            console.log(err);
        }
        req.app.db.models.vendedor.find({
            'usuario': user.username
        }).exec(function(err, acc) {

            res.render('facturacion/popupNuevoVendedor', {
                'actuaciones': acc,
                'usuario': user.username
            });
        });
    });
};
