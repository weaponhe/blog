var path = require('path');
var blogRoute = require('./blog');
var spaRoute = require('./spa');

module.exports = function(app, Router) {
	app.use('/', blogRoute(Router()));
	app.get('/admin', function(req, res, next) {
		var options = {
			root: path.join(__dirname + '/../public/'),
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		var fileName = 'spa.html';
		res.sendFile(fileName, options, function(err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			} else {
				console.log('Sent:', fileName);
			}
		});
	});

	app.use('/admin', spaRoute(Router()));
	app.use(function(req, res, next) {
		res.status(404);
		if (req.accepts('html')) {
			res.render('error/404', {
				url: req.url
			});
			return;
		}
		if (req.accepts('json')) {
			res.send({
				error: 'Not found'
			});
			return;
		}
		res.type('txt').send('Not found');
	});

	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error/500', {
			error: err
		});
	});
}