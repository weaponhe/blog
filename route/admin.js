var Post = require('../model/post');
var Book = require('../model/book');
var test = require('assert');
module.exports = function(router) {

	router.get('/', function(req, res, next) {
		res.render('admin/admin-index', {
			title: '仪表盘'
		});
	});

	router.get('/posts', function(req, res, next) {
		Post.getAll(function(err, posts) {
			if (err) {
				return next(err);
			}
			req.app.render('admin/admin-posts', {
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

	router.delete('/posts/:_id', function(req, res, next) {
		var _id = req.params._id;
		Post.deleteOne(_id, function(err, result) {
			if (err) {
				return next(err);
			}
			if (result) {
				res.json({
					success: true
				});
			}
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
				req.app.render('admin/admin-edit', {
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
			req.app.render('admin/admin-edit', {
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

	router.post('/posts', function(req, res) {
		var post = new Post({
			title: req.body.title,
			tags: req.body.tags,
			intro: req.body.intro,
			md: req.body.md,
			html: req.body.html
		});
		post.save(function(err, _id) {
			if (err) {
				return next(err);
			}
			res.json({
				success: true,
				_id: _id
			});
		});
	});

	router.put('/posts/:_id', function(req, res, next) {
		var _id = req.params._id;
		var post = new Post({
			title: req.body.title,
			tags: req.body.tags,
			intro: req.body.intro,
			md: req.body.md,
			html: req.body.html
		});
		Post.update(_id, post, function(err, result) {
			if (result) {
				if (err) {
					return next(err);
				}
				res.json({
					success: true
				});
			}
		})
	});

	router.get('/books', function(req, res, next) {
		console.log("/books")
		Book.getAll(function(err, books) {
			if (err) {
				return next(err);
			}
			req.app.render('admin/admin-books', {
				books: books
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

	router.post('/books', function(req, res, next) {
		var book = new Book({
			title: req.body.title,
			author: req.body.author,
			publisher: req.body.publisher,
			link: req.body.link,
			status: req.body.status,
			img: req.body.img
		});
		book.save(function(err) {
			if (err) {
				return next(err);
			}
			res.json({
				success: true
			});
		});
	});

	router.put('/books/:_id', function(req, res, next) {
		var _id = req.params._id;
	});

	router.delete('/books/:_id', function(req, res, next) {
		var _id = req.params._id;
		Book.deleteOne(_id, function(err, result) {
			if (err) {
				return next(err);
			}
			if (result) {
				res.json({
					success: true
				});
			}
		});
	});

	return router;
};