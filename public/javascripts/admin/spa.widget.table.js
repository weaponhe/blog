//---------------- BEGIN MODULE SCOPE VARIABLES --------------
var $ = require('jquery'),
	Util = require('./spa.util'),
	Event = require('./spa.event');

var Table = function() {
	this.configMap = {
		main_html: String() +
			'        <div class="container-fluid">' +
			'            <div class="row spa-table-header">' +
			'                <div class="col-xs-11"></div>' +
			'                <div class="col-xs-1">' +
			'                    <button type="button" class="btn btn-success btn-block spa-table-create"></button>' +
			'                </div>' +
			'            </div>' +
			'            <div class="row spa-table-main">' +
			'                <div class="col-xs-12">' +
			'                    <div class="panel panel-default">' +
			'                        <table class="table table-hover spa-table-list">' +
			'                            <thead> </thead>' +
			'                            <tbody> </tbody>' +
			'                        </table>' +
			'                    </div>' +
			'                </div>' +
			'            </div>' +
			'        </div>',

		attr_map: {},
		has_create_btn: true,
		has_edit_btn: true,
		has_delete_btn: true,
		settable_map: {
			name: true,
			table_model: true,
			create_widget: true,
			attr_map: true,
			has_create_btn: true,
			has_edit_btn: true,
			has_delete_btn: true,
			refresh_event: true,
			create_btn_text: true
		}
	};
	this.stateMap = {
		$container: undefined
	};
	this.jqueryMap = {};
}
var setJqueryMap, renderTableHeader, renderTableBody,
	onListChange, onCreateClick, onTablebodyClick,
	configModule, initModule;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS ------------------

//-------------------- END UTILITY METHODS -------------------

//--------------------- BEGIN DOM METHODS --------------------
setJqueryMap = function() {
	var $container = this.stateMap.$container;
	this.jqueryMap = {
		$header: $container.find('.spa-table-header'),
		$main: $container.find('.spa-table-main'),
		$create: $container.find('.spa-table-create'),
		$table: $container.find('.spa-table-list'),
		$thead: $container.find('thead'),
		$tbody: $container.find('tbody')
	};
};

renderCreateBtn = function() {
	this.jqueryMap.$create.text(this.configMap.create_btn_text);
	if (this.configMap.has_create_btn) {
		this.jqueryMap.$header.show();
	} else {
		this.jqueryMap.$header.hide();
	}
}

renderTableHeader = function() {
	$thead = this.jqueryMap.$thead;
	$thead.html('');

	var append_tr = '<tr>';
	var attr_map = this.configMap.attr_map;
	var key;
	for (key in attr_map) {
		append_tr += '<th>' + attr_map[key] + '</th>';
	}
	if (this.configMap.has_edit_btn || this.configMap.has_delete_btn) {
		append_tr += '<th>操作</th>';
	}
	append_tr += '</tr>';
	$thead.append(append_tr);
}

renderTableBody = function(data) {
	var attr_map = this.configMap.attr_map;
	$tbody = this.jqueryMap.$tbody;
	$tbody.html('');
	var _id, item, append_tr;
	for (_id in data) {
		append_tr = '<tr data-id=' + _id + ' > ';

		for (key in attr_map) {
			append_tr += '<td>' + data[_id][key] + '</td>';
		}
		if (this.configMap.has_edit_btn || this.configMap.has_delete_btn) {
			append_tr += '<td>';
			if (this.configMap.has_edit_btn) {
				append_tr += '<button type="button" class="btn btn-primary btn-xs spa-table-edit-btn"  data-id=' + _id + ' >编辑</button>'
			}
			if (this.configMap.has_delete_btn) {
				append_tr += ' <button type="button" class="btn btn-default btn-xs spa-table-del-btn" data-id=' + _id + ' >刪除</button>'
			}
			append_tr += '</td>';
		}
		append_tr += '</tr>';
		$tbody.append(append_tr);
	}
}

//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------
//dom event
onCreateClick = function(e) {
	this.configMap.create_widget.show();
	return false;
};

onTablebodyClick = function(e) {
	var target = $(e.target),
		nodeName = target[0].nodeName,
		model = this.configMap.table_model,
		name = this.configMap.name,
		_id = target.attr('data-id');

	if (nodeName === 'BUTTON') {
		if (target.hasClass('spa-table-del-btn')) {
			if (confirm("确定删除？")) {
				model.remove(name, _id);
			}
		} else if (target.hasClass('spa-table-edit-btn')) {
			var doc = model.getByID(name, _id);
			this.configMap.create_widget.show(doc);
		}
	};
	return false;
};
//global event
onListChange = function(data) {
	renderTableBody.call(this, data);
};
//-------------------- END EVENT HANDLERS --------------------

//------------------- BEGIN PUBLIC METHODS -------------------
configModule = function(input_map) {
	Util.setConfigMap({
		input_map: input_map,
		settable_map: this.configMap.settable_map,
		config_map: this.configMap
	});
	return true;
};

initModule = function($container) {
	this.stateMap.$container = $container;

	$container.html(this.configMap.main_html);
	setJqueryMap.call(this);
	renderCreateBtn.call(this);
	renderTableHeader.call(this);
	renderTableBody.call(this);

	//dom event 
	this.jqueryMap.$create.bind('click', onCreateClick.bind(this));
	this.jqueryMap.$tbody.bind('click', onTablebodyClick.bind(this));
	//global event
	Event.subscribe('list-change-' + this.configMap.name, onListChange.bind(this));

	this.configMap.table_model.getList(this.configMap.name);
};
//------------------- END PUBLIC METHODS ---------------------

Table.prototype = {
	configModule: configModule,
	initModule: initModule
};

module.exports = Table;