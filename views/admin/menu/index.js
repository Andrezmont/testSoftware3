(function() {
  'use strict';
  exports.init = function(req, res) {
      req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
          if (err) {
              console.log(err);
          }
          req.app.db.models.menu.find({},function(err, acc) {
              if (err) {
                  console.log(err);
              }
              if (acc.length === 0) {
                acc = [{
                        "id": 1,
                        "parent": "#",
                        "text": "Menu"
                    }
                ];
              }
            res.render('admin/menu/index', {
              'usuario': user.username,
              'entrada':JSON.stringify(acc)
            });
        });
      });
  };
  exports.ingresar = function(req, res) {
    var item = req.body;
    req.app.db.models.menu.create(item);
    res.send('Ok');
  };
  exports.eliminarTodo = function(req, res) {
    req.app.db.models.menu.remove({}, function(err, account) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            console.log('Eliminado');
            res.send('Ok');
        }
    });
  };
}());
