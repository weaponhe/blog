var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();
var test = require('assert');
var Datekit = require('jsuite').Datekit;

var Book = function (book) {
    this.title = book.title;
    this.author = book.author;
    this.publisher = book.publisher;
    this.link = book.link;
    this.status = book.status;
    this.img = book.img;
};

module.exports = Book;

Book.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        date: date,
        year: Datekit.format(date, 'yyyy'),
        month: Datekit.format(date, 'yyyy-MM'),
        day: Datekit.format(date, 'yyyy-MM-dd'),
        second: Datekit.format(date, 'yyyy-MM-dd HH:mm:ss'),
        month_day: Datekit.format(date, 'MM-dd')
    };
    var doc = {
        title: this.title,
        author: this.author,
        publisher: this.publisher,
        link: this.link,
        status: this.status,
        img: this.img,
        time: time
    };

    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('books');
        col.insertOne(doc, function (err, r) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, r.ops[0]);
        });
    });
};

Book.remove = function (_id, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('books');
        col.deleteOne({
            _id: ObjectId(_id)
        }, function (err, r) {
            if (err) {
                return callback(err);
            }
            callback(null, r);
        });
    });
};

Book.update = function (_id, doc, callback) {
    MongoClient.connect(url, function (err) {
        if (err) {
            return callback(err);
        }
        delete doc.time;
        delete doc._id;
        var col = db.collection('books');
        col.findOneAndUpdate({
            _id: ObjectId(_id)
        }, {
            $set: doc
        }, function (err, r) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, r.value);
        })
    });
};

Book.getList = function (callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('books');
        col.find().sort({
            time: -1
        }).toArray(function (err, docs) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, docs);
        });
    });
}
