var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = require('../settings').getUrl();
exports.findOne = function (query, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('user');
        col.findOne(query, function (err, doc) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, doc);
        });
    });
}
exports.findOneById = function (_id, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return callback(err);
        }
        var col = db.collection('user');
        col.findOne({_id: ObjectId(_id)}, function (err, doc) {
            db.close();
            if (err) {
                return callback(err);
            }
            callback(null, doc);
        });
    });
}