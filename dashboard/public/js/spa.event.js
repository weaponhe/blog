var
	stateMap = {
		eventMap: {}
	},

	subscribe, publish;

subscribe = function(event, cb) {
	if (!stateMap.eventMap[event]) {
		stateMap.eventMap[event] = [];
	}
	stateMap.eventMap[event].push(cb);
};

publish = function(event, data) {
	stateMap.eventMap[event].forEach(function(cb) {
		cb(data);
	});
};

module.exports = {
	subscribe: subscribe,
	publish: publish
};