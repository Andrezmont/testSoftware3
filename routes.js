(function () {
   'use strict';
   // this function is strict...

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.set('X-Auth-Required', 'true');
    req.session.returnUrl = req.originalUrl;
    res.redirect('/login/');
  }

  function ensureAdmin(req, res, next) {
    if (req.user.canPlayRoleOf('admin')) {
      return next();
    }
    res.redirect('/login/');
  }

  function ensureAccount(req, res, next) {
    if (req.user.canPlayRoleOf('account')) {
      if (req.app.config.requireAccountVerification) {
        if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
          return res.redirect('/account/verification/');
        }
      }
      return next();
    }
    res.redirect('/login/');
  }

  exports = module.exports = function(app, passport) {

    //front end
    app.get('/', require('./views/index').init);
    app.get('/about/', require('./views/about/index').init);
    app.get('/contact/', require('./views/contact/index').init);
    app.post('/contact/', require('./views/contact/index').sendMessage);

    //sign up
    app.get('/admin/signup/', require('./views/signup/index').init);
    app.post('/admin/signup/', require('./views/signup/index').signup);

    //login/out
    app.get('/login/', require('./views/login/index').init);
    app.post('/login/', require('./views/login/index').login);
    app.get('/login/forgot/', require('./views/login/forgot/index').init);
    app.post('/login/forgot/', require('./views/login/forgot/index').send);
    app.get('/login/reset/', require('./views/login/reset/index').init);
    app.get('/login/reset/:email/:token/', require('./views/login/reset/index').init);
    app.put('/login/reset/:email/:token/', require('./views/login/reset/index').set);
    app.get('/logout/', require('./views/logout/index').init);

    //admin
    app.all('/admin*', ensureAuthenticated);
    app.all('/admin*', ensureAdmin);
    app.get('/admin/', require('./views/admin/index').init);

    //admin > users
    app.get('/admin/users/', require('./views/admin/users/index').find);
    app.post('/admin/users/', require('./views/admin/users/index').create);
    app.get('/admin/users/:id/', require('./views/admin/users/index').read);
    app.put('/admin/users/:id/', require('./views/admin/users/index').update);
    app.put('/admin/users/:id/password/', require('./views/admin/users/index').password);
    app.put('/admin/users/:id/role-admin/', require('./views/admin/users/index').linkAdmin);
    app.delete('/admin/users/:id/role-admin/', require('./views/admin/users/index').unlinkAdmin);
    app.put('/admin/users/:id/role-account/', require('./views/admin/users/index').linkAccount);
    app.delete('/admin/users/:id/role-account/', require('./views/admin/users/index').unlinkAccount);
    app.delete('/admin/users/:id/', require('./views/admin/users/index').delete);

    //admin > administrators
    app.get('/admin/administrators/', require('./views/admin/administrators/index').find);
    app.post('/admin/administrators/', require('./views/admin/administrators/index').create);
    app.get('/admin/administrators/:id/', require('./views/admin/administrators/index').read);
    app.put('/admin/administrators/:id/', require('./views/admin/administrators/index').update);
    app.put('/admin/administrators/:id/permissions/', require('./views/admin/administrators/index').permissions);
    app.put('/admin/administrators/:id/groups/', require('./views/admin/administrators/index').groups);
    app.put('/admin/administrators/:id/user/', require('./views/admin/administrators/index').linkUser);
    app.delete('/admin/administrators/:id/user/', require('./views/admin/administrators/index').unlinkUser);
    app.delete('/admin/administrators/:id/', require('./views/admin/administrators/index').delete);

    //admin > admin groups
    app.get('/admin/admin-groups/', require('./views/admin/admin-groups/index').find);
    app.post('/admin/admin-groups/', require('./views/admin/admin-groups/index').create);
    app.get('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').read);
    app.put('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').update);
    app.put('/admin/admin-groups/:id/permissions/', require('./views/admin/admin-groups/index').permissions);
    app.delete('/admin/admin-groups/:id/', require('./views/admin/admin-groups/index').delete);
    //admin > accounts
    app.get('/admin/menu/', require('./views/admin/menu/index').init);
    app.post('/admin/menu/', require('./views/admin/menu/index').ingresar);
    app.delete('/admin/menu/', require('./views/admin/menu/index').eliminarTodo);
    //admin > accounts
    app.get('/admin/accounts/', require('./views/admin/accounts/index').find);
    app.post('/admin/accounts/', require('./views/admin/accounts/index').create);
    app.get('/admin/accounts/:id/', require('./views/admin/accounts/index').read);
    app.put('/admin/accounts/:id/', require('./views/admin/accounts/index').update);
    app.put('/admin/accounts/:id/user/', require('./views/admin/accounts/index').linkUser);
    app.delete('/admin/accounts/:id/user/', require('./views/admin/accounts/index').unlinkUser);
    app.post('/admin/accounts/:id/notes/', require('./views/admin/accounts/index').newNote);
    app.post('/admin/accounts/:id/status/', require('./views/admin/accounts/index').newStatus);
    app.delete('/admin/accounts/:id/', require('./views/admin/accounts/index').delete);

    //generar PDF de Facturas
    app.get('/facturar/:id', require('./views/facturacion/index').imprimir);
    app.get('/imprimir/:id', function(req, res){
      var conversion = require("phantom-html-to-pdf")();
      conversion({url: req.protocol + '://'+req.get('host')+"/facturar/"+req.params.id }, function(err, pdf) {
        pdf.stream.pipe(res);
      });
    });
    //admin > statuses
    app.get('/admin/statuses/', require('./views/admin/statuses/index').find);
    app.post('/admin/statuses/', require('./views/admin/statuses/index').create);
    app.get('/admin/statuses/:id/', require('./views/admin/statuses/index').read);
    app.put('/admin/statuses/:id/', require('./views/admin/statuses/index').update);
    app.delete('/admin/statuses/:id/', require('./views/admin/statuses/index').delete);

    //admin > categories
    app.get('/admin/categories/:id/', require('./views/admin/categories/index').read);
    app.get('/admin/categories/', require('./views/admin/categories/index').find);
    app.post('/admin/categories/', require('./views/admin/categories/index').create);
    app.put('/admin/categories/:id/', require('./views/admin/categories/index').update);
    app.delete('/admin/categories/:id/', require('./views/admin/categories/index').delete);

    //admin > search
    app.get('/admin/search/', require('./views/admin/search/index').find);

    // admin >Personalizacion del modulo de Incentario
    app.get('/admin/generarModulo/', require('./views/generar_modulo/index').init);
    app.post('/admin/generarModulo/', require('./views/generar_modulo/index').generar);
    app.delete('/admin/generarModulo/', require('./views/generar_modulo/index').eliminar);

    // account >template
    app.get('/account/template/dinamica/', require('./views/generados/template/index').init2);
    app.post('/account/template/dinamica/', require('./views/generados/template/index').ingresar2);
    app.delete('/account/templateTodo/', require('./views/generados/template/index').eliminarTodo);
    app.post('/account/formulario/template/', require('./views/generados/template/index').formulario);
    app.get('/account/template/migrar', require('./views/generados/template/index').init3);
    app.post('/account/template/migrar', require('./views/generados/template/index').subir);
    app.put('/account/template/nombrar', require('./views/generados/template/index').nombrar);
    app.get('/account/template/', require('./views/generados/template/index').init);
    app.put('/account/template/', require('./views/generados/template/index').actualizar);
    app.post('/account/template/', require('./views/generados/template/index').ingresar);
    app.delete('/account/template/', require('./views/generados/template/index').eliminar);
    app.post('/account/template/ver', require('./views/generados/template/index').ver);
    // account >nivel
    app.get('/admin/nivel/dinamica/', require('./views/generados/nivel/index').init2);
    app.post('/admin/nivel/dinamica/', require('./views/generados/nivel/index').ingresar2);
    app.delete('/admin/nivelTodo/', require('./views/generados/nivel/index').eliminarTodo);
    app.post('/admin/formulario/nivel/', require('./views/generados/nivel/index').formulario);
    app.get('/admin/nivel/migrar', require('./views/generados/nivel/index').init3);
    app.post('/admin/nivel/migrar', require('./views/generados/nivel/index').subir);
    app.put('/admin/nivel/nombrar', require('./views/generados/nivel/index').nombrar);
    app.get('/admin/nivel/', require('./views/generados/nivel/index').init);
    app.put('/admin/nivel/', require('./views/generados/nivel/index').actualizar);
    app.post('/admin/nivel/', require('./views/generados/nivel/index').ingresar);
    app.delete('/admin/nivel/', require('./views/generados/nivel/index').eliminar);
    app.post('/admin/nivel/ver', require('./views/generados/nivel/index').ver);
    // account >empresa
    app.get('/admin/empresa/dinamica/', require('./views/generados/empresa/index').init2);
    app.post('/admin/empresa/dinamica/', require('./views/generados/empresa/index').ingresar2);
    app.delete('/admin/empresaTodo/', require('./views/generados/empresa/index').eliminarTodo);
    app.post('/admin/formulario/empresa/', require('./views/generados/empresa/index').formulario);
    app.get('/admin/empresa/migrar', require('./views/generados/empresa/index').init3);
    app.post('/admin/empresa/migrar', require('./views/generados/empresa/index').subir);
    app.put('/admin/empresa/nombrar', require('./views/generados/empresa/index').nombrar);
    app.get('/admin/empresa/', require('./views/generados/empresa/index').init);
    app.put('/admin/empresa/', require('./views/generados/empresa/index').actualizar);
    app.post('/admin/empresa/', require('./views/generados/empresa/index').ingresar);
    app.delete('/admin/empresa/', require('./views/generados/empresa/index').eliminar);
    app.post('/admin/empresa/ver', require('./views/generados/empresa/index').ver);
    app.get('/admin/empresa/listar', require('./views/generados/empresa/index').listar);

    app.get('/admin/nivel/listar', require('./views/generados/nivel/index').listar);


    // account >cuestionario
    app.get('/admin/cuestionario/dinamica/', require('./views/generados/cuestionario/index').init2);
    app.post('/admin/cuestionario/dinamica/', require('./views/generados/cuestionario/index').ingresar2);
    app.delete('/admin/cuestionarioTodo/', require('./views/generados/cuestionario/index').eliminarTodo);
    app.post('/admin/formulario/cuestionario/', require('./views/generados/cuestionario/index').formulario);
    app.get('/admin/cuestionario/migrar', require('./views/generados/cuestionario/index').init3);
    app.post('/admin/cuestionario/migrar', require('./views/generados/cuestionario/index').subir);
    app.put('/admin/cuestionario/nombrar', require('./views/generados/cuestionario/index').nombrar);
    app.get('/admin/cuestionario/', require('./views/generados/cuestionario/index').init);
    app.put('/admin/cuestionario/', require('./views/generados/cuestionario/index').actualizar);
    app.post('/admin/cuestionario/', require('./views/generados/cuestionario/index').ingresar);
    app.delete('/admin/cuestionario/', require('./views/generados/cuestionario/index').eliminar);
    app.post('/admin/cuestionario/ver', require('./views/generados/cuestionario/index').ver);
    app.get('/admin/cuestionario/listar', require('./views/generados/cuestionario/index').listar);

    // account >indicador
    app.get('/admin/indicador/dinamica/', require('./views/generados/indicador/index').init2);
    app.post('/admin/indicador/dinamica/', require('./views/generados/indicador/index').ingresar2);
    app.delete('/admin/indicadorTodo/', require('./views/generados/indicador/index').eliminarTodo);
    app.post('/admin/formulario/indicador/', require('./views/generados/indicador/index').formulario);
    app.get('/admin/indicador/migrar', require('./views/generados/indicador/index').init3);
    app.post('/admin/indicador/migrar', require('./views/generados/indicador/index').subir);
    app.put('/admin/indicador/nombrar', require('./views/generados/indicador/index').nombrar);
    app.get('/admin/indicador/', require('./views/generados/indicador/index').init);
    app.put('/admin/indicador/', require('./views/generados/indicador/index').actualizar);
    app.post('/admin/indicador/', require('./views/generados/indicador/index').ingresar);
    app.delete('/admin/indicador/', require('./views/generados/indicador/index').eliminar);
    app.post('/admin/indicador/ver', require('./views/generados/indicador/index').ver);
    app.get('/admin/indicador/listar', require('./views/generados/indicador/index').listar);

    // account >area
    app.get('/admin/area/dinamica/', require('./views/generados/area/index').init2);
    app.post('/admin/area/dinamica/', require('./views/generados/area/index').ingresar2);
    app.delete('/admin/areaTodo/', require('./views/generados/area/index').eliminarTodo);
    app.post('/admin/formulario/area/', require('./views/generados/area/index').formulario);
    app.get('/admin/area/migrar', require('./views/generados/area/index').init3);
    app.post('/admin/area/migrar', require('./views/generados/area/index').subir);
    app.put('/admin/area/nombrar', require('./views/generados/area/index').nombrar);
    app.get('/admin/area/', require('./views/generados/area/index').init);
    app.put('/admin/area/', require('./views/generados/area/index').actualizar);
    app.post('/admin/area/', require('./views/generados/area/index').ingresar);
    app.delete('/admin/area/', require('./views/generados/area/index').eliminar);
    app.post('/admin/area/ver', require('./views/generados/area/index').ver);
    app.get('/admin/area/listar', require('./views/generados/area/index').listar);



    app.get('/account/template/listar', require('./views/generados/template/index').listar);

    // account >Facturacion
    app.get('/account/facturacion/', require('./views/facturacion/index').init);
    app.put('/account/facturacion/', require('./views/facturacion/index').actualizar);
    app.post('/account/facturacion/', require('./views/facturacion/index').ingresar);
    app.delete('/account/facturacion/', require('./views/facturacion/index').eliminar);
    app.post('/account/facturacion/ver', require('./views/facturacion/index').ver);
    app.get('/account/facturacion/listar', require('./views/facturacion/index').listar);
    app.post('/account/facturacion/producto', require('./views/facturacion/index').buscarCantidad);
    app.get('/account/facturacion/ventana/:indice', require('./views/facturacion/index').buscarProducto);

    //Upload Files
    app.get('/account/facturacion/dinamica/', require('./views/subirImagen/index').init);
    app.post('/account/facturacion/dinamica/', require('./views/subirImagen/index').subir);

    app.get('/prueba/', require('./views/prueba/index').inicio);
    app.get('/build/', require('./views/prueba/index').inicio2);
    app.get('/api/', require('./views/prueba/index').inicio3);
    app.get('/voz/', require('./views/prueba/index').inicio4);

    //account
    app.all('/account*', ensureAuthenticated);
    app.all('/account*', ensureAccount);
    app.get('/account/', require('./views/account/index').init);

    //account > verification
    app.get('/account/verification/', require('./views/account/verification/index').init);
    app.post('/account/verification/', require('./views/account/verification/index').resendVerification);
    app.get('/account/verification/:token/', require('./views/account/verification/index').verify);

    //account > settings
    app.get('/account/settings/', require('./views/account/settings/index').init);
    app.put('/account/settings/', require('./views/account/settings/index').update);
    app.put('/account/settings/identity/', require('./views/account/settings/index').identity);
    app.put('/account/settings/password/', require('./views/account/settings/index').password);

    //route not found
    app.all('*', require('./views/http/index').http404);

  };
}());
