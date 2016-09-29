var $ = require('jquery'),
    Model = require('./spa.model'),
    Nav = require('./spa.widget.nav'),
    Table = require('./spa.widget.table'),
    Editor = require('./spa.widget.editor'),
    ModalDialog = require('./spa.widget.modal'),
    BookModalBody = require('./spa.widget.modal.book'),
    DemoModalBody = require('./spa.widget.modal.demo'),
    ProjectModalBody = require('./spa.widget.modal.project'),

    configMap = {
        main_html: String() +
        '    	<div id="mask"></div>' +
        '    	<div id="nav"></div>' +
        '    	<div id="header">' +
        '           <a href="javascript:history.back()"><span class="glyphicon glyphicon-chevron-left"></span></a>' +
        '           <a target="_blank" href="/"><img src="/img/avatar.jpg" /></a>' +
        '       </div>' +
        '    	<div id="main">' +
        '    		<div id="post_panel"></div>' +
        '    		<div id="book_panel"></div>' +
        '    		<div id="demo_panel"></div>' +
        '    		<div id="project_panel"></div>' +
        '    		<div id="edit_panel"></div>' +
        '    		<div id="book_modal_panel"></div>' +
        '    		<div id="demo_modal_panel"></div>' +
        '    		<div id="project_modal_panel"></div>' +
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

setJqueryMap = function () {
    $container = stateMap.$container;
    jqueryMap = {
        $mask: $container.find('#mask'),
        $nav: $container.find('#nav'),
        $main: $container.find('#main'),
        $post_panel: $container.find('#post_panel'),
        $book_panel: $container.find('#book_panel'),
        $demo_panel: $container.find('#demo_panel'),
        $project_panel: $container.find('#project_panel'),
        $edit_panel: $container.find('#edit_panel'),
        $book_modal_panel: $container.find('#book_modal_panel'),
        $demo_modal_panel: $container.find('#demo_modal_panel'),
        $project_modal_panel: $container.find('#project_modal_panel')
    };
};

render = function () {
    jqueryMap.$post_panel.hide();
    jqueryMap.$book_panel.hide();
    jqueryMap.$demo_panel.hide();
    jqueryMap.$project_panel.hide();
    Editor.hide();
    // jqueryMap.$edit_panel.hide();
    switch (stateMap.hash_map.nav) {
        case 'posts':
            jqueryMap.$post_panel.show();
            break;
        case 'books':
            jqueryMap.$book_panel.show();
            break;
        case 'demos':
            jqueryMap.$demo_panel.show();
            break;
        case 'projects':
            jqueryMap.$project_panel.show();
            break;
        default:
            console.log('default');
    }
}


onHashChange = function (e) {
    Nav.updateActive(location.hash);
    var hashStr = location.hash.slice(2),
        hashArr = hashStr.split('&'),
        hashMap = {};
    hashArr.forEach(function (item) {
        hashMap[item.split('=')[0]] = item.split('=')[1];
    });
    stateMap.hash_map = hashMap;
    render();
}

initModule = function ($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    // module init
    Nav.configModule({
        nav_map: {
            posts: '文章',
            books: '书单',
            projects: '项目',
            demos: 'Demo'
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
    book_modal.initModule(jqueryMap.$book_modal_panel);
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


    var demo_modal = new ModalDialog();
    demo_modal.configModule({
        name: 'demos',
        model: Model,
        $mask: jqueryMap.$mask,
        body_html: DemoModalBody.body_html,
        attr_map: {
            title: 'input',
            link: 'input',
            tag: 'tag',
            intro: 'intro'
        }
    });
    demo_modal.initModule(jqueryMap.$demo_modal_panel);
    var demo_table = new Table();
    demo_table.configModule({
        name: 'demos',
        table_model: Model,
        create_btn_text: '新Demo',
        create_widget: demo_modal,
        attr_map: {
            title: '标题',
            link: '链接',
            tag: '标签',
            intro: '简介',
        }
    });
    demo_table.initModule(jqueryMap.$demo_panel);


    var project_modal = new ModalDialog();
    project_modal.configModule({
        name: 'projects',
        model: Model,
        $mask: jqueryMap.$mask,
        body_html: ProjectModalBody.body_html,
        attr_map: {
            title: 'input',
            link: 'input',
            tag: 'tag',
            intro: 'intro'
        }
    });
    project_modal.initModule(jqueryMap.$project_modal_panel);
    var project_table = new Table();
    project_table.configModule({
        name: 'projects',
        table_model: Model,
        create_btn_text: '新项目',
        create_widget: project_modal,
        attr_map: {
            title: '标题',
            link: '链接',
            tag: '标签',
            intro: '简介',
        }
    });
    project_table.initModule(jqueryMap.$project_panel);

    $(window).bind('hashchange', onHashChange);
    $(function () {
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