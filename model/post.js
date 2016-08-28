var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();
var test = require('assert');
MongoClient.connect(url, function(err, db) {

});

var Post = function(post) {
	this.title = post.title;
	this.tags = post.tags;
	this.intro = post.intro;
	this.md = post.md;
	this.html = post.html;
};

module.exports = Post;

Post.prototype.save = function(callback) {
	var doc = {
		title: this.title,
		tags: this.tags.split(','),
		intro: this.intro,
		md: this.md,
		html: this.html,
		time: new Date()
	};
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.insertOne(doc, function(err, r) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null);
		});
	});
};

Post.getAll = function(callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.find().sort({
			time: -1
		}).toArray(function(err, docs) {
			if (err) {
				return callback(err);
			}
			callback(null, docs);
		});
	});
};

Post.getLatestTen = function(callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.find().limit(10).sort({
			time: -1
		}).toArray(function(err, docs) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, docs);
		});
	});
};

Post.getLatestOne = function(callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.find().limit(1).sort({
			time: -1
		}).next(function(err, doc) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, doc);
		});
	});
};

Post.getOneById = function(_id, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.findOne({
			_id: ObjectId(_id)
		}, function(err, doc) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, doc);
		});
	});
};

Post.getTags = function(callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.distinct('tags', function(err, docs) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, docs);
		});
	});
};

Post.getArchive = function(callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
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
};

Post.getPostByTag = function(tag, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.find({
			tags: tag
		}).sort({
			time: -1
		}).toArray(function(err, docs) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, docs);
		});
	});
};


Post.deleteOne = function(_id, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.deleteOne({
			_id: ObjectId(_id)
		}, function(err, r) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, true);
		});
	});
};

Post.update = function(_id, post, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('posts');
		col.findOneAndUpdate({
			_id: ObjectId(_id)
		}, {
			$set: {
				title: post.title,
				tags: post.tags.split(','),
				intro: post.intro,
				md: post.md,
				html: post.html
			}
		}, function(err, r) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, true);
		});
	});
};