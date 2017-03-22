(function() {
  'use strict';
  /**
  * @autor:godie007
  * @date: 2017/03/14 19:33
  * Este es el controlado de la ruta /
  **/
  exports.inicio = function(req, res) {
    res.render('home/index', { title: 'Indicadores de Madurez' });
  };

  exports.grafica = function(req, res) {
    res.render('grafica/index');
  };

  exports.area = function(req, res) {
    res.render('area/index',{'modulo':'area'});
  };
}());
