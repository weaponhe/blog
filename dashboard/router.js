var Post = require('../model/post');
var Book = require('../model/book');
var Demo = require('../model/demo');
var Project = require('../model/project');

module.exports = function (router) {
    router.post('/posts/add', function (req, res, next) {
        var doc = new Post(req.body);
        doc.save(function (err, doc) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                doc.time = doc.time.second;
                res.status(200)
                    .json(doc);
            }
        });
    });
    router.post('/posts/remove/:_id', function (req, res, next) {
        Post.remove(req.params._id,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.post('/posts/update/:_id', function (req, res, next) {
        Post.update(req.params._id, req.body,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.get('/posts/list', function (req, res, next) {
        Post.getList(function (err, docs) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                docs.forEach(function (doc) {
                    doc.time = doc.time.second;
                });
                res.status(200)
                    .json(docs);
            }
        });
    });
    //===book===
    router.post('/books/add', function (req, res, next) {
        var doc = new Book(req.body);
        doc.save(function (err, doc) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                res.status(200)
                    .json(doc);
            }
        });
    });
    router.post('/books/remove/:_id', function (req, res, next) {
        Book.remove(req.params._id,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.post('/books/update/:_id', function (req, res, next) {
        Book.update(req.params._id, req.body,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.get('/books/list', function (req, res, next) {
        Book.getList(function (err, docs) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                res.status(200)
                    .json(docs);
            }
        });
    });
    //===demo===
    router.post('/demos/add', function (req, res, next) {
        var doc = new Demo(req.body);
        doc.save(function (err, doc) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                res.status(200)
                    .json(doc);
            }
        });
    });
    router.post('/demos/remove/:_id', function (req, res, next) {
        Demo.remove(req.params._id,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.post('/demos/update/:_id', function (req, res, next) {
        Demo.update(req.params._id, req.body,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.get('/demos/list', function (req, res, next) {
        Demo.getList(function (err, docs) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                res.status(200)
                    .json(docs);
            }
        });
    });
    //===project===
    router.post('/projects/add', function (req, res, next) {
        var doc = new Project(req.body);
        doc.save(function (err, doc) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                res.status(200)
                    .json(doc);
            }
        });
    });
    router.post('/projects/remove/:_id', function (req, res, next) {
        Project.remove(req.params._id,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.post('/projects/update/:_id', function (req, res, next) {
        Project.update(req.params._id, req.body,
            function (err, r) {
                if (err) {
                    res.status(500)
                        .json({
                            error: err
                        });
                } else {
                    res.status(200)
                        .json(r);
                }
            });
    });
    router.get('/projects/list', function (req, res, next) {
        Project.getList(function (err, docs) {
            if (err) {
                res.status(500)
                    .json({
                        error: err
                    });
            } else {
                res.status(200)
                    .json(docs);
            }
        });
    });
    return router;
};