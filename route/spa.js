var Model = require('../model/model');
module.exports = function(router) {
	router.post('/:doc_type/add', function(req, res, next) {
		var doc = new Model(req.body);
		doc.save(req.params.doc_type, function(err, doc) {
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

	router.post('/:doc_type/remove/:_id', function(req, res, next) {
		Model.remove(req.params.doc_type, req.params._id,
			function(err, r) {
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


	router.post('/:doc_type/update/:_id', function(req, res, next) {
		delete req.body._id;
		Model.update(req.params.doc_type, req.params._id, req.body,
			function(err, r) {
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

	router.get('/:doc_type/list', function(req, res, next) {
		Model.getList(req.params.doc_type, function(err, docs) {
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
	})


	return router;
};