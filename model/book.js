var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();
var test = require('assert');

var Book = function(book) {
	this.title = book.title;
	this.author = book.author;
	this.publisher = book.publisher;
	this.link = book.link;
	this.status = book.status;
	this.img = book.img;
};

module.exports = Book;

Book.prototype.save = function(callback) {
	var doc = {
		title: this.title,
		author: this.author,
		publisher: this.publisher,
		link: this.link,
		status: this.status,
		img: this.img
	}
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('books');
		col.insertOne(doc, function(err, r) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null);
		});
	});
}

Book.getAll = function(callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('books');
		col.find().toArray(function(err, docs) {
			db.close();
			if (err) {
				return callback(err);
			}
			callback(null, docs);
		});
	});
}

Book.deleteOne = function(_id, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			return callback(err);
		}
		var col = db.collection('books');
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