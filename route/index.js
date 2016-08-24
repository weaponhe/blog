var Post = require('../model/post');
var test = require('assert');
module.exports = function(app) {
	app.get('/test', function(req, res) {
		Post.test(function() {});
		res.end("hello");
	});

	app.get('/', function(req, res) {
		Post.getLatestTen(function(err, archive_posts) {
			Post.getLatestOne(function(err, latest_post) {
				Post.getTags(function(err, tags) {
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
		Post.getTags(function(err, tags) {
			Post.getPostByTag(tag, function(err, posts) {
				console.log(posts);
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
			test.equal(null, err);
			res.render('post', {
				title: "文章-" + post.title,
				post: post
			});
		});
	});

	app.get('/admin/editor', function(req, res) {
		res.render('editor');
	});


	app.post('/admin/post', function(req, res) {
		var post = new Post({
			title: req.body.title,
			tags: req.body.tags,
			intro: req.body.intro,
			md: req.body.md,
			html: req.body.html
		});
		console.log(req.body.intro);
		post.save(function(err) {
			if (err) {
				console.log('err');
			}
			res.json({
				success: "asd"
			});
		});
	});
}