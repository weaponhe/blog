var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var route = require('./route');
var app = express();

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.enable('verbose errors');
if ('production' == app.settings.env)
    app.disable('verbose errors');

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'portal', 'public')));
app.use(express.static(path.join(__dirname, 'dashboard', 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//Routing
route(app, express.Router);

var port = 3000;
app.listen(port, function () {
    console.log("the server start at port" + port);
})
;