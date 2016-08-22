var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var route = require('./route');
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

route(app);

var port = 3000;
app.listen(port, () => {
	console.log("the server start at port" + port);
});