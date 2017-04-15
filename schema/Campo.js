'use strict';

exports = module.exports = function(app, mongoose) {
  var generar = new mongoose.Schema(
  {
    'type': { type: String, default: '' },
    'label': { type: String, default: '' },
    'placeholder': { type: String, default: '' },
    'rows': { type: String, default: '' },
    'className': { type: String, default: '' },
    'name': { type: String, default: '' },
    'maxlength': { type: String, default: '' },
    'toggle': { type: Boolean},
    'value': { type: String, default: '' },
    'min': { type: String, default: '' },
    'max': { type: String, default: '' },
    'step': { type: String, default: '' },
    'values': [
      {
        'label': { type: String, default: '' },
        'value': { type: String, default: '' },
        'selected': { type: Boolean}
      }
    ],
    'indice': { type: Number},
    'usuario': { type: String, default: '' },
    'modulo': { type: String, default: '' },
    fecha_creacion: { type: Date, default: Date.now }
  }
);
  generar.plugin(require('./plugins/pagedFind'));
  generar.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('campo', generar);
};
