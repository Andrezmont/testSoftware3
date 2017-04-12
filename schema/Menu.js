(function() {
  exports = module.exports = function(app, mongoose) {
        var generar = new mongoose.Schema({
            "id": {type: String,default: ''},
            "parent": {type: String,default: ''},
            "text": {type: String,default: ''},
            "icon": {type: Boolean},
            "a_attr": {
              "href": {type: String,default: ''}
            },
            fecha_creacion: {type: Date,default: Date.now}
        });
        generar.plugin(require('./plugins/pagedFind'));
        generar.set('autoIndex', (app.get('env') === 'development'));
        app.db.model('menu', generar);
    };
}());
