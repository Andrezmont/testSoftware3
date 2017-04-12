'use strict';

exports = module.exports = function(app, mongoose) {
  var generar = new mongoose.Schema({
    'data': [{
              'cantidad': { type: Number, default: '' },
              'estado': { type: String, default: '' },
              'indice': { type: Number, default: '' },
              'fecha': { type: String, default: '' },
              'precio': { type: Number, default: '' },
              'valor': { type: Number, default: '' },
              'producto': { type: String, default: '' },
              'productoID': { type: String, default: '' }
            }],
    'numeroFactura': { type: Number, default: '' },
    'descuento': { type: Number, default: '' },
    'dinero_pagado': { type: Number, default: '' },
    'forma_pago': { type: String, default: '' },
    'usuario': { type: String, default: '' },
    'vendedor': { type: String, default: '' },
    'cliente': { type: String, default: '' },
    'fecha': { type: String, default: '' },
    'fechaModificacion': { type: String, default: '' },
    'estado': { type: String, default: 'Activo' },
    fecha_creacion: { type: Date, default: Date.now }
  });
  generar.plugin(require('./plugins/pagedFind'));
  generar.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('factura', generar);
};
