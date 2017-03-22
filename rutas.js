(function () {
   'use strict';
   /**
  * @autor:godie007
  * @date: 2017/03/14 19:32
  * Este es el controlador de rutas, tiene como proposito
  * apuntar a los diferentes controladores  del sistema
  **/
  exports = module.exports = function(app) {

    app.get('/', require('./routes/inicio').inicio);
    app.post('/grafica/', require('./routes/inicio').grafica);
    app.get('/empresa/', require('./routes/inicio').inicio);


    // area
    app.post('/area/', require('./routes/inicio').area);
    app.get('/area/listar', require('./routes/area').listar);
    app.post('/formulario/area/', require('./routes/area').formulario);
  };
}());
