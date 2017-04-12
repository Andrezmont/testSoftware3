(function() {
    'use strict';
    // this function is strict...

    //dependencies
    var config = require('./config'),
        express = require('express'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        session = require('express-session'),
        mongoStore = require('connect-mongo')(session),
        http = require('http'),
        path = require('path'),
        passport = require('passport'),
        mongoose = require('mongoose'),
        helmet = require('helmet');

    //create express app
    var app = express();
    //var reload = require('reload');


    //keep reference to config
    app.config = config;

    //setup the web server
    app.server = http.createServer(app);

    app.io = require('socket.io').listen(app.server);

    //se configura el servidor para que se recargue simbolo
    //reload(app.server, app);
    app.use(helmet());

    //setup mongoose
    mongoose.Promise = global.Promise;
    app.db = mongoose.createConnection(config.mongodb.uri);
    app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
    app.db.once('open', function() {
        //and... we have a data store
    });

    //config data models
    require('./models')(app, mongoose);

    //settings
    app.disable('x-powered-by');
    app.set('port', config.port);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    mongoose.Promise = global.Promise;
    //middleware
    app.use(require('morgan')('dev'));
    app.use(require('compression')());
    app.use(require('serve-static')(path.join(__dirname, 'public')));
    app.use(require('method-override')());
    app.use(bodyParser.json({
        limit: '5mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '5mb'
    }));
    app.use(cookieParser(config.cryptoKey));

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    app.use(function (req, res, next) {
      // se parametriza el menu principal de la cuenta de Usuario
      app.db.models.menu.find({}).sort({"fecha_creacion": -1}).exec(function(err,doc) {
          console.log(doc.length);
          req.app.locals.menu = doc; // set your layout here
          console.log("------------->Entro");
          next(); // pass control to the next handler
      });
    });
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.cryptoKey,
        store: new mongoStore({
            clear_interval: 3600,
            url: config.mongodb.uri
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    helmet(app);

    //Variables Globales
    app.use(function(req, res, next) {
        res.locals.cuenta = {};
        res.locals.user = {};
        res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
        res.locals.user.username = req.user && req.user.username;
        next();
    });


    //global locals
    app.locals.projectName = app.config.projectName;
    app.locals.copyrightYear = new Date().getFullYear();
    app.locals.copyrightName = app.config.companyName;
    app.locals.cacheBreaker = 'br34k-01';

    //setup passport
    require('./passport')(app, passport);

    //setup routes
    require('./routes')(app, passport);
    //route sockets
    require('./sockets')(app);


    //custom (friendly) error handler
    app.use(require('./views/http/index').http500);

    //setup utilities
    app.utility = {};
    app.utility.sendmail = require('./util/sendmail');
    app.utility.slugify = require('./util/slugify');
    app.utility.workflow = require('./util/workflow');

    //listen up
    app.server.listen(app.config.port, function() {
        //and... we're live
        console.log('Servidor Corriendo en el puerto ' + config.port);
    });
}());
