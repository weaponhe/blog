var Post = require('../model/post');
var test = require('assert');
module.exports = function(router) {
	router.get('/', function(req, res) {
		res.redirect('/admin/posts');
	});

	router.get('/posts', function(req, res) {
		Post.getAll(function(err, posts) {
			if (err) {
				return next(err);
			}
			res.render('admin/admin-posts', {
				title: "仪表盘-所有文章",
				posts: posts
			});
		});
	});

	router.get('/p/new', function(req, res) {
		res.render('admin/admin-write', {
			title: "仪表盘-写文章",
			post: null
		});
	});

	router.get('/p/delete/:_id', function(req, res) {
		var _id = req.params._id;
		Post.deleteOne(_id, function(err, result) {
			if (err) {
				return next(err);
			}
			if (result) {
				res.redirect('/admin/posts');
			}
		});
	});

	router.get('/p/edit/:_id', function(req, res) {
		var _id = req.params._id;
		Post.getOneById(_id, function(err, post) {
			if (err) {
				return next(err);
			}
			res.render('admin/admin-write', {
				title: '编辑',
				post: post
			});
		});
	});

	router.post('/p/new', function(req, res) {
		var post = new Post({
			title: req.body.title,
			tags: req.body.tags,
			intro: req.body.intro,
			md: req.body.md,
			html: req.body.html
		});
		post.save(function(err) {
			if (err) {
				return next(err);
			}
			res.json({
				success: "asd"
			});
		});
	});

	router.post('/p/update/:_id', function(req, res) {
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
					success: "asd"
				});
			}
		})
	});
	return router;
};