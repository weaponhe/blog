var blogRoute = require('./blog');
var adminRoute = require('./admin');
module.exports = function(app, Router) {
	app.use('/', blogRoute(Router()));
	app.use('/admin', adminRoute(Router()));

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