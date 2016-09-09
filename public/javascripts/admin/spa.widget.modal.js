//---------------- BEGIN MODULE SCOPE VARIABLES --------------
var $ = require('jquery'),
	Util = require('./spa.util'),
	Event = require('./spa.event'),
	Modal = function() {
		this.configMap = {
			main_html: String() +
				'    <div class ="spa-modal">' +
				'        <div class="spa-modal-header"><h4 class="spa-modal-header-title">新建</h4></div>' +
				'        <div class="spa-modal-main"></div>' +
				'        <div class="spa-modal-footer">' +
				'            <button class="btn btn-primary spa-modal-footer-save">保存</button>' +
				'            <button class="btn btn-default spa-modal-footer-cancel">取消</button>' +
				'        </div>' +
				'    </div>',

			settable_map: {
				name: true,
				body_html: true,
				model: true,
				$mask: true,
				attr_map: true
			}
		};
		this.stateMap = {
			$container: null,
			doc: {}
		};
		this.jqueryMap = {};
	},

	updateData,
	setJqueryMap, renderBody, renderData,
	onMaskClick, onSaveClick, onCancelClick,
	configModule, initModule;


//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS ------------------
updateData = function() {
	var
		configMap = this.configMap,
		doc = this.stateMap.doc,
		jqueryMap = this.jqueryMap;
	var key;
	for (key in configMap.attr_map) {
		doc[key] = jqueryMap.$form_map[key].val();
	};
};
//-------------------- END UTILITY METHODS -------------------

//--------------------- BEGIN DOM METHODS --------------------
setJqueryMap = function() {
	var $container = this.stateMap.$container;
	this.jqueryMap = {
		$modal: $container.find('.spa-modal'),
		$header: $container.find('.spa-modal-header'),
		$main: $container.find('.spa-modal-main'),
		$footer: $container.find('.spa-modal-footer'),
		$title: $container.find('.spa-modal-header-title'),
		$save: $container.find('.spa-modal-footer-save'),
		$cancel: $container.find('.spa-modal-footer-cancel'),
		$form_map: {}
	};
};


renderBody = function() {
	this.jqueryMap.$main.html(this.configMap.body_html);
	var attr_map = this.configMap.attr_map;
	var $container = this.stateMap.$container;
	var key, id;
	for (key in attr_map) {
		id = '#spa-modal-' + this.configMap.name + '-' + key;
		this.jqueryMap.$form_map[key] = $(id);
	}
};

renderData = function() {
	var
		configMap = this.configMap,
		doc = this.stateMap.doc,
		jqueryMap = this.jqueryMap;
	var key;
	for (key in configMap.attr_map) {
		jqueryMap.$form_map[key].val(doc[key]);
	};
}

//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------

onMaskClick = function(e) {
	hide.call(this);
};
onSaveClick = function(e) {
	updateData.call(this);
	var doc = this.stateMap.doc,
		model = this.configMap.model,
		name = this.configMap.name;
	if (doc._id) {
		model.update(name, doc);
	} else {
		model.add(name, doc);
	}
	hide.call(this);
};

onCancelClick = function(e) {
	hide.call(this);
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
	renderBody.call(this);


	this.configMap.$mask.bind('click', onMaskClick.bind(this));
	this.jqueryMap.$save.bind('click', onSaveClick.bind(this));
	this.jqueryMap.$cancel.bind('click', onCancelClick.bind(this));
};

show = function(doc) {
	//显示
	this.stateMap.$container.show();
	this.configMap.$mask.show();
	//更新状态
	this.stateMap.doc = doc ? doc : {};
	//显示数据
	renderData.call(this);
};
hide = function() {
	this.stateMap.$container.hide();
	this.configMap.$mask.hide();
};
//------------------- END PUBLIC METHODS ---------------------
Modal.prototype = {
	initModule: initModule,
	configModule: configModule,
	show: show
};

module.exports = Modal;