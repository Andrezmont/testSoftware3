(function() {
  exports = module.exports = function(app, mongoose) {
        var generar = new mongoose.Schema({
            'data': {},
            'modulo': {
                type: String,
                default: ''
            },
            'usuario': {
                type: String,
                default: ''
            },
            'empresa': {
                type: String,
                default: ''
            },
            fecha_creacion: {
                type: Date,
                default: Date.now
            }
        });
        generar.plugin(require('./plugins/pagedFind'));
        generar.set('autoIndex', (app.get('env') === 'development'));
        app.db.model('cuestionario', generar);
    };
}());
