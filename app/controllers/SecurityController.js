var Promise = require('bluebird');

const db = require('../database.js');
const Props = require('../Properties.js');
const Util = require('../Util.js');

var SecurityController = {}

// Authenticate
SecurityController.validateToken = function(request, reply) {

	// If the API is signup or login API, do not check for a valid x-token
	var noAuthNeeded = /signup|login/.test(request.path);
	if(noAuthNeeded) {
		return reply.continue();
	}
	var x_token = request.headers[Props.Constants.X_TOKEN];

	self.findUserByAuthToken(x_token)
		.then(function(user) {
			if(user == null) {
				return reply([{statusCode: 401, message: 'Not authorized.'}]);
			}
			console.log(user);
			request.app.user = user;
			return reply.continue();
		});
}

SecurityController.findUserByAuthToken = function(token) {

	return new Promise
	.using(db.getSqlConnection(), function(connection) {
		return connection.queryAsync(Props.SqlStmts.FIND_USER_BY_AUTH_TOKEN, [token]);
	})
	.then(function(rows) {
			console.log("rows len=" + rows.length);
			if(rows.length > 0) {
				rows[0].password = null;
				return rows[0];
			}
			else {
				return null;
			}
	})
	.catch(function(err) {
		console.log("rejection err-" + err);
		return null;		

	});
}

var self = module.exports = SecurityController;
