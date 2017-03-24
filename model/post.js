var MongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectId;
var url         = require('../settings').getUrl();
var Datekit     = require('jsuite').Datekit;
var test        = require('assert');
var marked      = require('marked');
marked.setOptions({
  highlight: function (code)
  {
    return require('highlight.js').highlightAuto(code).value;
  }
});

var Post = function (post)
{
  this.title = post.title;
  this.tags  = post.tags;
  this.intro = post.intro;
  this.md    = post.md;
  this.html  = post.html;
  this.date  = post.date;
};

module.exports = Post;

Post.prototype.save = function (callback)
{
  var date = new Date(this.date);
  var time = {
    date: date,
    year: Datekit.format(date, 'yyyy'),
    month: Datekit.format(date, 'yyyy-MM'),
    day: Datekit.format(date, 'yyyy-MM-dd'),
    second: Datekit.format(date, 'yyyy-MM-dd HH:mm:ss'),
    month_day: Datekit.format(date, 'MM-dd')
  };
  var doc  = {
    title: this.title,
    intro: this.intro,
    tags: !!this.tags.trim() ? this.tags.trim().split(',') : [],
    md: this.md,
    html: marked(this.md),
    time: time
  };
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.insertOne(doc, function (err, r)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, r.ops[0]);
    });
  });
};

Post.remove = function (_id, callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.deleteOne({
      _id: ObjectId(_id)
    }, function (err, r)
    {
      if (err) {
        return callback(err);
      }
      callback(null, r);
    });
  });
};

Post.update = function (_id, doc, callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    delete doc.time;
    delete doc._id;
    doc.tags = !!doc.tags.trim() ? doc.tags.trim().split(',') : [];
    doc.html = marked(doc.md);

    var col = db.collection('posts');
    col.findOneAndUpdate({
      _id: ObjectId(_id)
    }, {
      $set: doc
    }, function (err, r)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, r.value);
    })
  });
};

Post.getList = function (callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.find().sort({
      time: -1
    }).toArray(function (err, docs)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, docs);
    });
  });
}

////
Post.getAll = function (callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.find().sort({
      time: -1
    }).toArray(function (err, docs)
    {
      if (err) {
        return callback(err);
      }
      callback(null, docs);
    });
  });
};

Post.getOneById = function (_id, callback)
{
  var objectId = new ObjectId(_id);
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.findOne({
      _id: objectId
    }, function (err, doc)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, doc);
    });
  });
};

Post.getTags = function (callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.distinct('tags', function (err, docs)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, docs);
    });
  });
};

Post.getArchive = function (callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.find().sort({
      time: -1
    }).toArray(function (err, docs)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, docs);
    });
  });
};

Post.getPostByTag = function (tag, callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.find({
      tags: tag
    }).sort({
      time: -1
    }).toArray(function (err, docs)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, docs);
    });
  });
};

// Post.deleteOne = function (_id, callback) {
//     MongoClient.connect(url, function (err, db) {
//         if (err) {
//             return callback(err);
//         }
//         var col = db.collection('posts');
//         col.deleteOne({
//             _id: ObjectId(_id)
//         }, function (err, r) {
//             db.close();
//             if (err) {
//                 return callback(err);
//             }
//             callback(null, true);
//         });
//     });
// };

// Post.update = function (_id, post, callback) {
//     MongoClient.connect(url, function (err, db) {
//         if (err) {
//             return callback(err);
//         }
//         var col = db.collection('posts');
//         col.findOneAndUpdate({
//             _id: ObjectId(_id)
//         }, {
//             $set: {
//                 title: post.title,
//                 tags: post.tags.split(','),
//                 intro: post.intro,
//                 md: post.md,
//                 html: post.html
//             }
//         }, function (err, r) {
//             db.close();
//             if (err) {
//                 return callback(err);
//             }
//             callback(null, true);
//         });
//     });
// };

Post.getLatestTen = function (callback)
{
  MongoClient.connect(url, function (err, db)
  {
    if (err) {
      return callback(err);
    }
    var col = db.collection('posts');
    col.find().limit(10).sort({
      time: -1
    }).toArray(function (err, docs)
    {
      db.close();
      if (err) {
        return callback(err);
      }
      callback(null, docs);
    });
  });
};

// Post.getLatestOne = function (callback) {
//     MongoClient.connect(url, function (err, db) {
//         if (err) {
//             return callback(err);
//         }
//         var col = db.collection('posts');
//         col.find().limit(1).sort({
//             time: -1
//         }).next(function (err, doc) {
//             db.close();
//             if (err) {
//                 return callback(err);
//             }
//             callback(null, doc);
//         });
//     });
// };

