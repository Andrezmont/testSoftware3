(function() {
  'use strict';
  exports = module.exports = function(app, mongoose) {
    //embeddable docs first
    require('./schema/Area')(app, mongoose);
    require('./schema/Campo')(app, mongoose);
  };
}());
