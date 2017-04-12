(function() {
  'use strict';

  exports.inicio = function(req, res) {
      req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
          if (err) {
              console.log(err);
          }
          res.render('prueba/index');
      });
  };


  exports.inicio2 = function(req, res) {
      req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
          if (err) {
              console.log(err);
          }
          res.render('prueba/index2',{'usuario':user.username,'modulo':'cliente'});
      });
  };

  exports.inicio3 = function(req, res) {
      res.send([{"id":19242,"title":"Star Wars"},{"id":19379,"title":"Darth Vader"},{"id":19631,"title":"Princess Leia"},{"id":19486,"title":"Kanan The Last Padawan"}]) ;
  };
  exports.inicio4 = function(req, res) {
      res.render('prueba/voz');
  };
}());
