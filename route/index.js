var blogRoute = require('./blog');
var adminRoute = require('./admin');
module.exports = function(app, Router) {
	app.use('/', blogRoute(Router()));
	app.use('/admin', adminRoute(Router()));
}