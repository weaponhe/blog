//---------------- BEGIN MODULE SCOPE VARIABLES --------------
var $ = require('jquery'),
	Util = require('./spa.util'),
	Event = require('./spa.event');

configMap = {
	main_html: String() +
		'        <ul id="spa-nav">' +
		'        </ul>',

	nav_map: {},
	settable_map: {
		nav_map: true
	}
};
stateMap = {
	$container: undefined
};
jqueryMap = {};
var setJqueryMap, render,
	onNavClick,
	configModule, initModule;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS ------------------

//-------------------- END UTILITY METHODS -------------------

//--------------------- BEGIN DOM METHODS --------------------
setJqueryMap = function() {
	var $container = stateMap.$container;
	jqueryMap = {
		$nav: $container.find('#spa-nav')
	};
};

render = function() {
	var key, append_a,
		nav_map = configMap.nav_map,
		$nav = jqueryMap.$nav;

	for (key in nav_map) {
		append_a = '<a href="/admin#!nav=' + key + '" ><li>' + nav_map[key] + '</li></a>'
		$nav.append(append_a);
	}
}

//---------------------- END DOM METHODS ---------------------
onNavClick = function(e) {
	var target = e.target;
	$(window).trigger('hashchange');
};
//------------------- BEGIN EVENT HANDLERS -------------------

//-------------------- END EVENT HANDLERS --------------------

//------------------- BEGIN PUBLIC METHODS -------------------
configModule = function(input_map) {
	Util.setConfigMap({
		input_map: input_map,
		settable_map: configMap.settable_map,
		config_map: configMap
	});
	return true;
};

initModule = function($container) {
	stateMap.$container = $container;
	$container.html(configMap.main_html);
	setJqueryMap();

	jqueryMap.$nav.bind('click', onNavClick);
	render();
};

updateActive = function(hash) {
	var lis = jqueryMap.$nav.find('li');
	Array.prototype.forEach.call(lis, function(li, idx, array) {
		if ($(li).hasClass('active')) {
			$(li).removeClass('active')
		}
	});
	var target = jqueryMap.$nav.find('[href="/admin' + hash + '"] li');
	target.addClass('active');
};
//------------------- END PUBLIC METHODS ---------------------

module.exports = {
	configModule: configModule,
	initModule: initModule,
	updateActive: updateActive
};