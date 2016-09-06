var test = {
	run: initialize
}

function initialize() {
	$('.nav-menu-list').on('click', function(e) {
		$('.menu-active').removeClass('menu-active');
		$(e.target).addClass('menu-active');
	});
	$(window).on('hashchange', function() {
		var path = location.pathname;
		var hash = hashDestringfy(location.hash);
		//#nav:posts - 文章列表页 - /%path%/posts
		//#nav:posts,edit:edit - 文章新建页 - /%path%/edit
		//#nav:posts,edit:edit,post_id:asd921jek19 - 文章编辑页 -/%path%/edit/asd921jek19
		//#nav:books - 书单列表页
		var url = path + hash.nav;
		if (hash.edit) {
			url += '/' + hash.edit;
		}
		if (hash.post_id) {
			url += '/' + hash.post_id;
		}
		console.log(url);
		$.ajax({
			type: 'GET',
			url: url,
			success: function(data) {
				console.log('res = ', data);
				$('.main').html(data.html);
			},
			dataType: 'json'
		});

	});
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

test.run();