'use strict';


exports.init = function(req, res) {
  if (req.user === undefined) {
    res.redirect('/login/');
  }
  req.app.db.models.User.findById(req.user.id, 'username').exec(function(err, user) {
      if (err) {
          console.log(err);
      }
      res.render('reportesImpresos/index',{'usuario':user.username});
  });
};
