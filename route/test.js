var Post = require('../model/post');
var Book = require('../model/book');

module.exports = function(router) {
	router.get('/', function(req, res, next) {
		res.render('test/index', {
			title: '测试页面'
		});
	});

	router.get('/posts', function(req, res, next) {
		console.log("/posts")
		Post.getAll(function(err, posts) {
			if (err) {
				return next(err);
			}
			req.app.render('test/posts', {
				posts: posts
			}, function(err, html) {
				if (err) {
					return next(err);
				}
				res.json({
					success: true,
					html: html
				});
			});
		});
	});

	router.get('/posts/edit/:_id', function(req, res, next) {
		var _id = req.params._id;
		var editingPost = null;
		if (_id !== "undefined") {
			Post.getOneById(_id, function(err, post) {
				if (err) {
					return next(err);
				}
				editingPost = post;
				req.app.render('test/edit', {
					post: post
				}, function(err, html) {
					if (err) {
						return next(err);
					}
					res.json({
						success: true,
						html: html
					});
				});
			});
		} else {
			req.app.render('test/edit', {
				post: null
			}, function(err, html) {
				if (err) {
					return next(err);
				}
				res.json({
					success: true,
					html: html
				});
			});
		}
	});

	router.get('/books', function(req, res, next) {
		res.json({
			success: true,
			request_url: '/books'
		});
	});

	return router;
}