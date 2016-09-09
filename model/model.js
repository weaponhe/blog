var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();

var Model = function(doc) {
	var key;
	for (key in doc) {
		if (doc.hasOwnProperty(key)) {
			this[key] = doc[key];
		}
	}
};

Model.prototype.save = function(doc_type, callback) {
	var doc = {};
	var key;
	for (key in this) {
		if (this.hasOwnProperty(key)) {
			doc[key] = this[key];
		}
	}
	//
	if (doc_type === 'posts') {
		if (doc.tags.trim() !== '') {
			doc.tags = doc.tags.split(',');
		}
	};
	doc.time = new Date();
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection(doc_type);
		col.insertOne(doc, function(err, r) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, r.ops[0]);
		});
	});
};

Model.getList = function(doc_type, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection(doc_type);
		col.find().sort({
			time: -1
		}).toArray(function(err, docs) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, docs);
		});
	});
}

Model.remove = function(doc_type, _id, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection(doc_type);
		col.deleteOne({
			_id: ObjectId(_id)
		}, function(err, r) {
			if (err) {
				return callback(err);
			}
			callback(null, r);
		});
	});
};

Model.update = function(doc_type, _id, doc, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		//
		if (doc_type === 'posts') {
			if (doc.tags.trim() !== '') {
				doc.tags = doc.tags.split(',');
			}
		};
		delete doc.time;
		var col = db.collection(doc_type);

		col.findOneAndUpdate({
			_id: ObjectId(_id)
		}, {
			$set: doc
		}, function(err, r) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, r.value);
		})
	});
};

module.exports = Model;