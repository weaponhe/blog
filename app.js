var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var route = require('./route');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var passport = require('passport');

app.set('view engine', 'ejs');

app.enable('verbose errors');
if ('production' == app.settings.env)
    app.disable('verbose errors');

app.use(require('morgan')('combined'));
app.use(express.static(path.join(__dirname, 'portal', 'public')));
app.use(express.static(path.join(__dirname, 'dashboard', 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('express-session')({secret: 'weaponhe', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
//Routing
route(app, express.Router);
var port = 3001;
app.listen(port, function () {
    console.log("the server start at port" + port);
});
