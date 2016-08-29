var Post = require('../model/post');
var test = require('assert');
module.exports = function(app) {

	app.get('/', function(req, res) {
		//如何避免这种多层嵌套的写法
		Post.getLatestTen(function(err1, archive_posts) {
			Post.getLatestOne(function(err2, latest_post) {
				Post.getTags(function(err3, tags) {
					if (err1 || err2 || err3) {
						return handle500(req, res);
					}
					res.render('index', {
						title: "首页",
						latest_post: latest_post,
						archive_posts: archive_posts,
						tags: tags
					});
				});
			});
		});
	});

	app.get('/archive', function(req, res) {
		Post.getArchive(function(err, posts) {
			if (err) {
				return handle500(req, res);
			}
			res.render('archive', {
				title: "归档",
				posts: posts
			});
		});
	});

	app.get('/tags/:tag', function(req, res) {
		var tag = req.params.tag;
		if (!tag) {
			tag = 'Javascript';
		}
		Post.getTags(function(err1, tags) {
			Post.getPostByTag(tag, function(err2, posts) {
				if (err1 || err2) {
					return handle500(req, res);
				}
				res.render('tags', {
					title: "分类",
					tags: tags,
					posts: posts
				});
			});
		});
	});

	app.get('/p/:_id', function(req, res) {
		var _id = req.params._id;
		Post.getOneById(_id, function(err, post) {
			if (err) {
				return handle500(req, res);
			}
			res.render('post', {
				title: "文章-" + post.title,
				post: post
			});
		});
	});

	var handle500 = function(req, res) {
		res.render('error', {
			title: '500 error'
		});
	}

	return app;

}