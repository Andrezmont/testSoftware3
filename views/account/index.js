(function() {
  'use strict';
  exports.init = function(req, res){

    res.setLocale(req.params.locale); //for current request
    //res.cookie('idioma', req.params.locale); //for future request of that user
    res.render('account/index',{i18n: res});
  };
}());
