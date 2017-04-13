(function() {
  'use strict';
  exports = module.exports = function(app, mongoose) {
    //embeddable docs first

    require('./schema/nivel')(app, mongoose);
    require('./schema/cuestionario')(app, mongoose);
    require('./schema/indicador')(app, mongoose);
    require('./schema/area')(app, mongoose);
    require('./schema/Factura')(app, mongoose);
    require('./schema/Note')(app, mongoose);
    require('./schema/Status')(app, mongoose);
    require('./schema/StatusLog')(app, mongoose);
    require('./schema/Category')(app, mongoose);
    require('./schema/Inventario')(app, mongoose);
    require('./schema/Campo')(app, mongoose);
    require('./schema/Menu')(app, mongoose);
    require('./schema/empresa')(app, mongoose);
    //then regular docs
    require('./schema/User')(app, mongoose);
    require('./schema/Admin')(app, mongoose);
    require('./schema/AdminGroup')(app, mongoose);
    require('./schema/Account')(app, mongoose);
    require('./schema/LoginAttempt')(app, mongoose);
  };
}());
