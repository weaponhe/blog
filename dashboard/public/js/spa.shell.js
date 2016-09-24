var $ = require('jquery'),
	Model = require('./spa.model'),
	Nav = require('./spa.widget.nav'),
	Table = require('./spa.widget.table'),
	Editor = require('./spa.widget.editor'),
	ModalDialog = require('./spa.widget.modal'),
	BookModalBody = require('./spa.widget.modal.book'),

	configMap = {
		main_html: String() +
			'    	<div id="mask"></div>' +
			'    	<div id="nav"></div>' +
			'    	<div id="header"><h4>活到老，学到老，改变世界。</h4></div>' +
			'    	<div id="main">' +
			'    		<div id="post_panel"></div>' +
			'    		<div id="book_panel"></div>' +
			'    		<div id="edit_panel"></div>' +
			'    		<div id="modal_panel"></div>' +
			'    	</div>'
	},

	stateMap = {
		$container: undefined,
		hash_map: {}
	},

	jqueryMap = {},

	setJqueryMap, render,
	onHashChange,
	initModule;

setJqueryMap = function() {
	$container = stateMap.$container;
	jqueryMap = {
		$mask: $container.find('#mask'),
		$nav: $container.find('#nav'),
		$main: $container.find('#main'),
		$post_panel: $container.find('#post_panel'),
		$book_panel: $container.find('#book_panel'),
		$edit_panel: $container.find('#edit_panel'),
		$modal_panel: $container.find('#modal_panel')
	};
};

render = function() {
	jqueryMap.$post_panel.hide();
	jqueryMap.$book_panel.hide();
	Editor.hide();
	// jqueryMap.$edit_panel.hide();
	switch (stateMap.hash_map.nav) {
		case 'posts':
			jqueryMap.$post_panel.show();
			break;
		case 'books':
			jqueryMap.$book_panel.show();
			break;
		default:
			console.log('default');
	}
}


onHashChange = function(e) {
	Nav.updateActive(location.hash);
	var hashStr = location.hash.slice(2),
		hashArr = hashStr.split('&'),
		hashMap = {};
	hashArr.forEach(function(item) {
		hashMap[item.split('=')[0]] = item.split('=')[1];
	});
	stateMap.hash_map = hashMap;
	render();
}

initModule = function($container) {
	stateMap.$container = $container;
	$container.html(configMap.main_html);
	setJqueryMap();

	// module init
	Nav.configModule({
		nav_map: {
			posts: '文章',
			books: '书单'
		}
	});
	Nav.initModule(jqueryMap.$nav);

	Editor.configModule({
		name: 'posts',
		model: Model
	});
	Editor.initModule(jqueryMap.$edit_panel);

	var post_table = new Table();
	post_table.configModule({
		name: 'posts',
		table_model: Model,
		create_widget: Editor,
		create_btn_text: '写文章',
		attr_map: {
			title: '标题',
			time: '日期',
			tags: '标签'
		}
	});
	post_table.initModule(jqueryMap.$post_panel);


	var book_modal = new ModalDialog();
	book_modal.configModule({
		name: 'books',
		model: Model,
		$mask: jqueryMap.$mask,
		body_html: BookModalBody.body_html,
		attr_map: {
			title: 'input',
			author: 'input',
			publisher: 'input',
			link: 'input',
			img: 'input',
			status: 'select'
		}
	});
	book_modal.initModule(jqueryMap.$modal_panel);
	var book_table = new Table();
	book_table.configModule({
		name: 'books',
		table_model: Model,
		create_btn_text: '新书单',
		create_widget: book_modal,
		attr_map: {
			title: '标题',
			author: '作者',
			publisher: '出版社',
			link: '链接',
			img: '封面',
			status: '状态',
		}
	});
	book_table.initModule(jqueryMap.$book_panel);


	$(window).bind('hashchange', onHashChange);
	$(function() {
		var hash = location.hash;
		if (hash === '') {
			location.hash = '#!nav=posts';
		} else {
			$(window).trigger('hashchange');
		}
	});
};

module.exports = {
	initModule: initModule
};