var path = require('path');
var dashboardRoute = require('../dashboard/router');
var portalRoute = require('../portal/router');

module.exports = function (app, Router) {
    app.use('/', portalRoute(Router()));
    app.use('/admin', dashboardRoute(Router()));
}
