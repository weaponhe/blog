//---------------- BEGIN MODULE SCOPE VARIABLES --------------
var $ = require('jquery'),
	Util = require('./spa.util'),
	Event = require('./spa.event'),

	configMap = {
		main_html: String() +
			'        <div class="container-fluid">' +
			'            <div class="row">' +
			'                <div class="col-xs-6">' +
			'                    <input type="text" class="form-control" placeholder="请输入文章标题" id="spa-editor-title" />' +
			'                </div>' +
			'                <div class="col-xs-4">' +
			'                    <input type="text" class="form-control" placeholder="请输入标签，用逗号隔开" id="spa-editor-tags" />' +
			'                </div>' +
			'                <div class="col-xs-1">' +
			'                    <div class="checkbox">' +
			'                        <label>' +
			'                            <input type="checkbox" checked="checked" id="spa-editor-sync"> 自动同步' +
			'                        </label>' +
			'                    </div>' +
			'                </div>' +
			'                <div class="col-xs-1">' +
			'                    <button class="btn btn-success btn-block" id="spa-editor-submit">发布</button>' +
			'                </div>' +
			'            </div>' +
			'            <div class="row">' +
			'                <div class="col-xs-12">' +
			'                    <textarea class="form-control" rows="2" placeholder="请输入文章概述" id="spa-editor-intro">' +
			'                    </textarea>' +
			'                </div>' +
			'            </div>' +
			'            <div class="row">' +
			'                <div class="col-xs-12">' +
			'                    <div id="spa-editor-post">' +
			'                        <textarea style="display:none;" id="test"></textarea>' +
			'                    </div>' +
			'                </div>' +
			'            </div>' +
			'        </div>',
		settable_map: {
			name: true,
			model: true
		}
	},
	stateMap = {
		$container: undefined,
		editor: undefined,
		post: {}
	},
	jqueryMap = {},

	updatePostData,
	setJqueryMap, initEditor,
	initEditor, render,
	onSubmitClick,
	configModule, initModule, show, hide;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS ------------------
updatePostData = function() {
	stateMap.post.title = jqueryMap.$title.val();
	stateMap.post.tags = jqueryMap.$tags.val();
	stateMap.post.intro = jqueryMap.$intro.val();
	stateMap.post.md = stateMap.editor.getMarkdown();
	stateMap.post.html = stateMap.editor.getHTML();
};
//-------------------- END UTILITY METHODS -------------------

//--------------------- BEGIN DOM METHODS --------------------
setJqueryMap = function() {
	var $container = stateMap.$container;
	jqueryMap = {
		$title: $container.find('#spa-editor-title'),
		$tags: $container.find('#spa-editor-tags'),
		$sync: $container.find('#spa-editor-sync'),
		$submit: $container.find('#spa-editor-submit'),
		$intro: $container.find('#spa-editor-intro'),
		$post: $container.find('#spa-editor-post'),
		$postarea: $container.find('.editormd-html-textarea')
	};
};

initEditor = function() {
	stateMap.editor = editormd('spa-editor-post', {
		weight: "100%",
		height: 840,
		path: "/libs/editor.md/lib/",
		saveHTMLToTextarea: true,
		emoji: true,
		taskList: true,
		tocm: true,
		tex: true,
		toolbarAutoFixed: false,
		toolbarIcons: function() {
			return ["undo", "redo", "|",
				"ucwords", "uppercase", "lowercase", "|",
				"list-ul", "list-ol", "hr", "|",
				"link", "reference-link", "image", "code", "code-block", "table", "emoji", "html-entities", "|",
				"watch", "preview", "search", "help"
			]
		}
	});
}

render = function() {
	jqueryMap.$title.val(stateMap.post.title);
	jqueryMap.$tags.val(stateMap.post.tags);
	jqueryMap.$intro.val(stateMap.post.intro);
	stateMap.editor.setMarkdown(stateMap.post.md);
}

//---------------------- END DOM METHODS ---------------------

//------------------- BEGIN EVENT HANDLERS -------------------
onSubmitClick = function(e) {
	updatePostData();
	var name = configMap.name,
		post = stateMap.post,
		model = configMap.model;
	if (post._id) {
		model.update(name, post);
	} else {
		model.add(name, post);
	}
	hide();
};
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
	initEditor();

	jqueryMap.$submit.bind('click', onSubmitClick);
};

show = function(post) {
	stateMap.$container.show();
	stateMap.editor.resize();
	stateMap.post = post ? post : {};
	render();
};

hide = function() {
	stateMap.$container.hide();
};
//------------------- END PUBLIC METHODS ---------------------

module.exports = {
	configModule: configModule,
	initModule: initModule,
	show: show,
	hide: hide
};