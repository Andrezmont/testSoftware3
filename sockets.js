(function () {
   'use strict';

exports = module.exports = function(app) {
  app.io.sockets.on('connection', function(socket){
    //send data to client
    setInterval(function(){

      var procesos = app.db.models.inventario;

        procesos.find({},{'data.Nombre':1,'data.Valor':1},function(err, salida) {
          socket.emit('date', {'info': salida});
        });

    }, 6000);

    socket.on('respuesta', function(data){
      console.log(data);
    });
  });
  };
}());
