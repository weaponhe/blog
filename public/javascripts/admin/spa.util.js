var setConfigMap;

setConfigMap = function(arg_map) {
	var input_map = arg_map.input_map,
		settable_map = arg_map.settable_map,
		config_map = arg_map.config_map;
	var key;
	for (key in input_map) {
		if (input_map.hasOwnProperty(key)) {
			if (settable_map.hasOwnProperty(key)) {
				config_map[key] = input_map[key];
			}
		}
	}
};

module.exports = {
	setConfigMap: setConfigMap
};