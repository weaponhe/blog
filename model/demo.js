var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();
var test = require('assert');
var Datekit = require('jsuite').Datekit;

var Demo = function (demo) {
    this.title = demo.title;
    this.tag = demo.tag;
    this.link = demo.link;
    this.intro = demo.intro;
};

module.exports = Demo;

Demo.prototype.save = function (callback) {
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
        tag: this.tag,
        link: this.link,
        intro: this.intro,
        time: time
    };

    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('demos');
        col.insertOne(doc, function (err, r) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, r.ops[0]);
        });
    });
};

Demo.remove = function (_id, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('demos');
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

Demo.update = function (_id, doc, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        delete doc.time;
        delete doc._id;
        var col = db.collection('demos');
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

Demo.getList = function (callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('demos');
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
