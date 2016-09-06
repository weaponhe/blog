var app = {
	autoSave: true,
	run: initialize
}

function initialize() {
	$('.nav-menu-list').on('click', function(e) {
		$('.menu-active').removeClass('menu-active');
		$(e.target).addClass('menu-active');
	});
	$(window).on('hashchange', function(e) {

		var hash = hashDestringfy(location.hash);
		route(hash);
	});
	$(document).ready(function() {
		$(window).trigger("hashchange");
	});
	if (app.autoSave) {

	}
}

function hashStringfy(hash) {
	var res = "";
	var key;
	for (key in hash) {
		res += key + ':' + hash[key] + ','
	}
	return '#' + res.substr(0, res.length - 1);
}

function hashDestringfy(hash) {
	hash = hash.substr(1);
	var res = {};
	var array = hash.split(',');
	array.forEach(function(item) {
		var temp = item.split(':');
		res[temp[0]] = temp[1];
	});
	return res;
}

function changeHash(hash) {
	location.hash = hashStringfy(hash);
}

function getPostData() {
	return {
		title: $("#titleInput").val(),
		tags: $("#tagsInput").val(),
		intro: $("#introInput").val(),
		md: editor.getMarkdown(),
		html: editor.getHTML()
	};
}

function getBookData() {
	return {
		title: $('#inputBookname').val(),
		author: $('#inputAuthor').val(),
		publisher: $('#inputPublisher').val(),
		link: $('#inputLink').val(),
		img: $('#inputImg').val(),
		status: $('#inputStatus').val()
	};
}

/**
 * [route description]
 	文章页面，共有三个页面，
	文章列表页 - #nav:posts,target: - GET/%path%/posts
	文章新建页 - #nav:posts,target:edit,post_id:undefined - GET /%path%/%nav%/edit/undefined
	文章编辑页 - #nav:posts,target:edit,post_id:asd921jek19 - GET /%path%/%nav%/edit/%post_id%
	书单页面，共有一个页面
	书单列表页 - #nav:books,target: - GET/%path%/books

	插 - #nav:posts,method:post - 插入文章 -POST /%path%/%nav%/create
	删 - #nav:posts,method:delete,post_id:asd921jek19 - 删除文章 -DELETE /%path%/%nav%/_id
	改 - #nav:posts,method:put,post_id:asd921jek19 - 修改文章 -PUT /%path%/%nav%/_id
 */
function route(hash) {
	if (!hash.nav) {
		return;
	}
	var path = location.pathname;
	var url = path + hash.nav + '/' +
		(hash.target ? (function() {
			return hash.target + '/';
		})() : '') +
		(hash._id ? (function() {
			return hash._id + '/';
		})() : '');
	var data;
	if (hash.method == 'post' || hash.method == 'put') {
		if (hash.nav == "posts") {
			data = getPostData();
		} else if (hash.nav == "books") {
			data = getBookData();
		}
	}
	var newHash = hash.method ? {
		nav: hash.nav
	} : null;
	console.info(hash.method || 'get', '-', url);
	$.ajax({
		type: hash.method || 'get',
		url: url,
		data: data,
		success: function(data) {
			if (newHash) {
				changeHash(newHash);
			}
			if (data.html) {
				$('.main').html(data.html);
			}

		},
		dataType: 'json'
	});
}

$(document).ready(function() {
	app.run()
});