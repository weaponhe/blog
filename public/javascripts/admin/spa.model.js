 var $ = require('jquery'),
 	Datekit = require('datekit'),
 	Event = require('./spa.event'),
 	configMap = {},
 	stateMap = {
 		id_map: {}
 	},

 	_publishListChange,
 	add, remove, update, getList, getByID,
 	initModule;

 _publishListChange = function(name, op, data) {
 	var res = {};
 	res[op] = data;
 	Event.publish('list-change-' + name, res);
 };

 add = function(name, doc) {
 	$.ajax({
 		type: 'POST',
 		url: '/admin/' + name + '/add',
 		data: doc,
 		success: function(data) {
 			data.time = Datekit.format(new Date(data.time), 'yyyy-MM-dd HH:mm:ss');
 			stateMap.id_map[name][data._id] = data;
 			_publishListChange(name, 'add', data);
 			return data;
 		},
 		error: function(err) {
 			console.log(err);
 		},
 		dataType: 'json'
 	});
 };

 remove = function(name, _id) {
 	$.ajax({
 		type: 'POST',
 		url: '/admin/' + name + '/remove/' + _id,
 		success: function(data) {
 			delete stateMap.id_map[name][_id];
 			_publishListChange(name, 'delete', _id);
 		},
 		error: function(err) {
 			console.log(err);
 		},
 		dataType: 'json'
 	});
 };

 update = function(name, doc) {
 	$.ajax({
 		type: 'POST',
 		url: '/admin/' + name + '/update/' + doc._id,
 		data: doc,
 		success: function(data) {
 			stateMap.id_map[name][doc._id] = doc;
 			_publishListChange(name, 'update', doc);
 		},
 		error: function(err) {
 			console.log(err);
 		},
 		dataType: 'json'
 	});
 };

 getList = function(name) {
 	if (!stateMap.id_map[name]) {
 		stateMap.id_map[name] = {};
 	}
 	$.ajax({
 		type: 'GET',
 		url: '/admin/' + name + '/list',
 		success: function(data) {
 			var i;
 			for (i = 0; i < data.length; i++) {
 				data[i].time = Datekit.format(new Date(data[i].time), 'yyyy-MM-dd HH:mm:ss');
 				stateMap.id_map[name][data[i]._id] = data[i];
 			}
 			_publishListChange(name, 'list', stateMap.id_map[name]);
 		},
 		error: function(err) {
 			console.log(err);
 		},
 		dataType: 'json'
 	});
 };
 getByID = function(name, _id) {
 	return stateMap.id_map[name][_id];
 };

 initModule = function() {

 	//更新id_map
 };

 module.exports = {
 	initModule: initModule,
 	add: add,
 	remove: remove,
 	update: update,
 	getList: getList,
 	getByID: getByID
 };