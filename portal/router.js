var path = require('path');
var Post = require('../model/post'),
    Book = require('../model/book');
module.exports = function (app) {
    app.get('/', function (req, res, next) {
        Post.getLatestTen(function (err, posts) {
            if (err) {
                return next(err);
            }
            posts.tags = posts.tags || [];
            res.render(path.join(__dirname, 'views/index'), {
                title: "首页",
                posts: posts
            });
        });
    });

    app.get('/post/:_id', function (req, res, next) {
        var _id = req.params._id;
        Post.getOneById(_id, function (err, post) {
            if (err) {
                return next(err);
            }
            if (post) {
                res.render(path.join(__dirname, 'views/post'), {
                    title: "文章-" + post.title,
                    post: post
                });
            } else {
                next();
            }
        });
    });


    app.get('/archive', function (req, res, next) {
        Post.getArchive(function (err, posts) {
            if (err) {
                return next(err);
            }
            posts.tags = posts.tags || [];
            res.render(path.join(__dirname, 'views/archive'), {
                title: "文章-归档",
                posts: posts
            });
        });
    });

    app.get('/tag', function (req, res, next) {
        Post.getTags(function (err, tags) {
            if (err) {
                return next(err);
            }
            res.redirect('/tag/' + tags[0]);
        });
    });
    app.get('/tag/:tag', function (req, res, next) {
        var tag = req.params.tag;
        Post.getTags(function (err, tags) {
            if (err) {
                return next(err);
            }
            if (tags.indexOf(tag) == -1) {
                return next();
            }
            Post.getPostByTag(tag, function (err, posts) {
                if (err) {
                    return next(err);
                }
                res.render(path.join(__dirname, 'views/tag'), {
                    title: "文章-分类",
                    tags: tags,
                    posts: posts
                });
            });
        });
    });

    app.get('/book', function (req, res, next) {
        Book.getAll(function (err, books) {
            if (err) {
                return next(err);
            }
            res.render(path.join(__dirname, 'views/book'), {
                title: '书单',
                books: books
            });
        });
    });
    app.get('/project', function (req, res, next) {
        res.render(path.join(__dirname, 'views/project'), {
            title: "项目"
        });
    });
    app.get('/demo', function (req, res, next) {
        res.render(path.join(__dirname, 'views/demo'), {
            title: "Demo平台"
        });
    });

    return app;
}