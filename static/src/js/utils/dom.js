var utils = {};

utils.strToDom = function(str) {
	var obj = document.createElement('div');
	obj.innerHTML = str;
	return obj.childNodes[0];
};

module.exports = utils;
