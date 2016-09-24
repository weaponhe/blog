var $ = require('jquery'),
	Model = require('./spa.model'),
	shell = require('./spa.shell');

$(function() {
	Model.initModule();
	shell.initModule($('#spa'));
});