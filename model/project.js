var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();
var test = require('assert');
var Datekit = require('jsuite').Datekit;

var Project = function (doc) {
    this.title = doc.title;
    this.tag = doc.tag;
    this.link = doc.link;
    this.intro = doc.intro;
};

module.exports = Project;

Project.prototype.save = function (callback) {
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
        var col = db.collection('projects');
        col.insertOne(doc, function (err, r) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, r.ops[0]);
        });
    });
};

Project.remove = function (_id, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('projects');
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

Project.update = function (_id, doc, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        delete doc.time;
        delete doc._id;
        var col = db.collection('projects');
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

Project.getList = function (callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('projects');
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
