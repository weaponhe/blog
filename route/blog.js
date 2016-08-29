var Post = require('../model/post');
var test = require('assert');
module.exports = function(app) {

	app.get('/', function(req, res, next) {
		Post.getLatestTen(function(err, archive_posts) {
			if (err) {
				return next(err);
			}
			Post.getLatestOne(function(err, latest_post) {
				if (err) {
					return next(err);
				}
				Post.getTags(function(err, tags) {
					if (err) {
						return next(err);
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

	app.get('/archive', function(req, res, next) {
		Post.getArchive(function(err, posts) {
			if (err) {
				return next(err);
			}
			res.render('archive', {
				title: "文章-归档",
				posts: posts
			});
		});
	});

	app.get('/tags/:tag', function(req, res, next) {
		var tag = req.params.tag;
		Post.getTags(function(err, tags) {
			if (err) {
				return next(err);
			}
			if (tags.indexOf(tag) == -1) {
				return next();
			}
			Post.getPostByTag(tag, function(err, posts) {
				if (err) {
					return next(err);
				}
				res.render('tags', {
					title: "文章-分类",
					tags: tags,
					posts: posts
				});
			});
		});
	});

	app.get('/p/:_id', function(req, res, next) {
		var _id = req.params._id;
		Post.getOneById(_id, function(err, post) {
			if (err) {
				return next(err);
			}
			if (post) {
				res.render('post', {
					title: "文章-" + post.title,
					post: post
				});
			} else {
				next();
			}
		});
	});

	return app;

}