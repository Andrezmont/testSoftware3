(function() {
  'use strict';
  exports.init = function(req, res){
    res.render('account/index',{i18n: res});
  };
}());
