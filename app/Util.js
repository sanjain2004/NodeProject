
var crypto = require('crypto');

var Util = {}

Util.createHash = function(clearString) {
	var hash = crypto.createHash('md5').update(clearString).digest('hex');
	return hash;
}

Util.generateToken = function() {
	var token1 = crypto.randomBytes(32);
	//console.log("token =" + token1);
	var token = token1.toString('hex');
	//console.log("token =" + token);
	return token;
}

Util.isUndefinedOrNull = function(input) {
	if(input === undefined || input == null) {
		return true;
	} 
	return false;
}

Util.isStringUndefinedOrEmptyOrNull = function(input) {	
	if(input === undefined || input == null || String(input).trim().length == 0) {
		return true;
	} 
	return false;
}

// Util.isUndefinedOrEmptyOrNull = function(input) {
// 	if(input === undefined || input == null || input.trim().length == 0) {
// 		return true;
// 	} 
// 	return false;
// }

module.exports = Util;
