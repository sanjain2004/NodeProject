var moment = require('moment');
var Promise = require('bluebird');

const db = require('../database.js');
const Props = require('../Properties.js');
const Util = require('../Util.js');

const L = require('../services/LoggingService.js');
const EmailService = require('../services/EmailService.js');

var InvestigatorVO = require('../models/InvestigatorVO.js');
var ClientVO = require('../models/ClientVO.js');
var InvestigatorCaseVO = require('../models/InvestigatorCaseVO.js');
var ClientCaseVO = require('../models/ClientCaseVO.js');

var UserController = {}

// Authenticate
UserController.validateToken = function(request, reply) {

	// If the API is signup or login API, do not check for a valid x-token
	var noAuthNeeded = /signup|login/.test(request.path);
	if(noAuthNeeded) {
		return reply.continue();
	}
	var x_token = request.headers[Props.Constants.X_TOKEN];

	self.findUserByAuthToken(x_token)
		.then(function(user) {
			if(user == null) {
				return reply([{appCode: 401, message: 'Not authorized.'}]);
			}
			console.log(user);
			request.app.user = user;
			return reply.continue();
		});
}

// Login
UserController.login = function(request, reply) {

	var password = Util.createHash(request.payload.password);

	self.findUserByName(request.payload.userName)
		.then(function(user) {
			if(user == null) {
				return reply({appCode: 403, message: 'Login failed.'});
			}
			//console.log(user);

			if(user.password != password) {
				return reply({appCode: 403, message: 'Login failed.'});
			}
			else {
				self.getAuthToken(user.id)
					.then(function(token) {
						return reply({appCode: 200, data: token});
				});
			}
		});
}

UserController.createInvestigator = function(request, reply) {

	var user = new Object();
	user.firstName = request.payload.firstName;
	user.lastName = request.payload.lastName;
	user.userName = request.payload.userName;
	user.email = request.payload.email;
	user.stateCode = request.payload.state;
	user.password = Util.createHash(request.payload.password);
	user.role = Props.Constants.INVESTIGATOR;

	user.status = Props.Constants.ACTIVE;

	var pixstate = new Object();
	pixstate.stateCode = request.payload.state;
	pixstate.phone = request.payload.phone;
	pixstate.licenseNumber = request.payload.licNumber;
	pixstate.licenseExpiryDate = request.payload.licExpiry;
	pixstate.companyName = request.payload.companyName;

	var pixstatePractice = new Object();
	pixstatePractice.practice = request.payload.practice;

	var userName = request.payload.userName;

	// TODO: Validation input

	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.FIND_USER_BY_NAME, [userName]);
	})
	.then(function(rows) {
			console.log("rows len=" + rows.length);
			if(rows.length > 0) {
 				reply({appCode: 409, message: 'User already exists'});
	 			throw new Promise.CancellationError("409");				
			}
			//else {
				return scope.connection.queryAsync(Props.SqlStmts.INSERT_USER, user);
			//}
	})
	.then(function(result) {
			var o1 = new Object();
			o1.id = result.insertId;
			scope.invId = o1.id;
			return scope.connection.queryAsync(Props.SqlStmts.INSERT_INV_USER, o1);
	})
	.then(function(result) {
			pixstate.investigatorId = scope.invId;
			return scope.connection.queryAsync(Props.SqlStmts.INSERT_PI_X_STATE, pixstate);
	})		
	.then(function(result) {
			pixstatePractice.piId = scope.invId;
			return scope.connection.queryAsync(Props.SqlStmts.INSERT_PI_X_STATE_X_PRACTICE, pixstatePractice);
	})		
	.then(function() {
		scope.connection.commitAsync();
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
			//EmailService.sendMail("san", "sanjain2004@gmail.com", "sany", "sanjeev_j1@yahoo.com", "from node", "this is from node.");
 			reply({appCode: 200, data: scope.invId});
	})
	.catch(Promise.CancellationError, function(err) {
		//scope.connection.rollbackAsync();
		console.log("in CancellationError..." + err);

	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.createInvestigator: userName: ' + userName + ': ' + err);
		reply({appCode: 503, message: err});

	});
}



UserController.createClient = function(request, reply) {

	var user = new Object();
	user.firstName = request.payload.firstName;
	user.lastName = request.payload.lastName;
	user.userName = request.payload.userName;
	user.email = request.payload.email;
	user.stateCode = request.payload.state;
	user.password = Util.createHash(request.payload.password);
	user.status = Props.Constants.ACTIVE;
	user.role = Props.Constants.CLIENT;

	var userName = request.payload.userName;

	// TODO: Validate input

	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.FIND_USER_BY_NAME, [userName]);
	})
	.then(function(rows) {
			console.log("rows len=" + rows.length);
			if(rows.length > 0) {
 				//reply([{appCode: 409, message: 'User already exists'}]);
 				reply({appCode: 409, message: 'User already exists'});
	 			throw new Promise.CancellationError("409");				
			}
//			else {
			return scope.connection.queryAsync(Props.SqlStmts.INSERT_USER, user);
//			}
	})
	.then(function(result) {
			var o1 = new Object();
			o1.id = result.insertId;
			scope.cliId = o1.id;
			return scope.connection.queryAsync(Props.SqlStmts.INSERT_CLIENT_USER, o1);
	})	
	.then(function() {
		scope.connection.commitAsync();
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
 			return reply({appCode: 200, data: scope.cliId});
	})
	.catch(Promise.CancellationError, function(err) {
		//scope.connection.rollbackAsync();
		console.log("in CancellationError..." + err);

	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.createClient: userName: ' + userName + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

// Find user by id
UserController.findById = function(request, reply) {

	var userId = request.params.id;
	var scope = {};

	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.FIND_USER_BY_ID, [userId]);
	})
	.then(function(rows) {
			console.log("rows len=" + rows.length);
			if(rows.length > 0) {
				scope.user = rows[0];
				if(rows[0].role == Props.Constants.INVESTIGATOR) {
					return scope.connection.queryAsync(Props.SqlStmts.FIND_INV_USER_BY_ID, userId);
				}
				else {
					return Promise.resolve([]);
				}
			}
			else {
				return Promise.resolve([]);
			}
	})
	.then(function(rows) {
		var retVO;

		if(Util.isUndefinedOrNull(scope.user)) {
			return reply({appCode: 404, message: "User not found."})
		}
		else if(scope.user.role == Props.Constants.INVESTIGATOR) {
			retVO = new InvestigatorVO();
			retVO.firstName = scope.user.firstName;
			retVO.lastName = scope.user.lastName;
			retVO.userName = scope.user.userName;
			retVO.email = scope.user.email;
			retVO.contact = scope.user.contact;
			retVO.stateCode = scope.user.stateCode;
			retVO.street = scope.user.street;
			retVO.city = scope.user.city;
			retVO.zipcode = scope.user.zipcode;
			retVO.phone = scope.user.phone;
			if(rows.length > 0) {
				retVO.licenseNumber = rows[0].licenseNumber;
				retVO.licenseExpiryDate = rows[0].licenseExpiryDate;
				retVO.companyName = rows[0].companyName;
				retVO.practice = [];

				rows.forEach(e => retVO.practice.push(e.practice));
			}
			
		}
		else {
			retVO = new ClientVO();
			retVO.firstName = scope.user.firstName;
			retVO.lastName = scope.user.lastName;
			retVO.userName = scope.user.userName;
			retVO.email = scope.user.email;
			retVO.contact = scope.user.contact;
			retVO.stateCode = scope.user.stateCode;
		}

		return reply({appCode: 200, data: retVO});
		//reply([{appCode: 200, message: 'Username created - ' + scope.cliId}]);
	})	
	// .catch(Promise.CancellationError, function(err) {
	// 	//scope.connection.rollbackAsync();
	// 	console.log("in CancellationError..." + err);

	// })
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.findById: userId: ' + userId + ': ' + err);
		reply([{appCode: 503, message: err}]);

	});
}

UserController.findMyCases = function(request, reply) {
	if(Util.isUndefinedOrNull(request.app.user)) {
		reply([{appCode: 403, message: "You are not logged in."}])
	}

	if(request.app.user.role == Props.Constants.INVESTIGATOR) {
		self.findInvestigatorCases(request.app.user.id)
			.then(function(caseMap) {
				return reply({appCode: 200, data: caseMap});
			});
	}
	else {
		self.findClientCases(request.app.user.id)
			.then(function(caseMap) {
				return reply({appCode: 200, data:caseMap});
			});
	}
}

// Interested
UserController.interestedInCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.caseId = request.params.caseId;
	if(Util.isUndefinedOrNull(request.app.user)) {
		reply([{appCode: 403, message: "You are not logged in."}])
	}

	kase.piId = request.app.user.id;
	kase.interested = 1;
				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function(connection) {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.INSERT_CASE_INTERESTED, kase);
	})
	.then(function() {
		scope.connection.commitAsync();
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
 			reply({appCode: 200, data: true});
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.interestedInCase: userId: ' + kase.piId + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

// Interested
UserController.deleteInterestedInCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.caseId = request.params.caseId;
	if(Util.isUndefinedOrNull(request.app.user)) {
		reply([{appCode: 403, message: "You are not logged in."}])
	}

	kase.piId = request.app.user.id;
				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.DELETE_CASE_INTERESTED, [kase.caseId, kase.piId]);
	})
	.then(function() {
		scope.connection.commitAsync();
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
 			reply({appCode: 200, data: true});
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.deleteInterestedInCase: userId: ' + kase.piId + ': ' + err);
		reply({appCode: 503, message: err});

	});
}



// Find user by name
UserController.findUserByName = function(userName) {
	return new Promise
	.using(db.getSqlConnection(), function(connection) {
		return connection.queryAsync(Props.SqlStmts.FIND_USER_BY_NAME, [userName]);
	})
	.then(function(rows) {
			console.log("rows len=" + rows.length);
			if(rows.length > 0) {
				return rows[0];
			}
			else {
				return null;
			}
	})
	.catch(Promise.CancellationError, function(err) {
		//scope.connection.rollbackAsync();
		console.log("in CancellationError..." + err);

	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.findUserByName:' + err);
		//reply([{appCode: 503, message: err}]);

	});
}

UserController.findUserByAuthToken = function(token) {
	//var scope = {};
	//scope.user = null;

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
		//scope.connection.rollbackAsync();
		L.error('In UserController.findUserByAuthToken: authToken: ' + authToken + ': ' + err);
		return null;		

	});

}

UserController.getAuthToken = function(userId) {
	return new Promise
	.using(db.getSqlConnection(), function(connection) {
		//scope.connection = connection;
		return {connection: connection};
	})
	.then(function(scope) {	
		return [scope.connection, scope.connection.queryAsync(Props.SqlStmts.FIND_TOKEN_FOR_USER, [userId])];
	})
	.spread(function(connection, rows) {
			console.log("rows len=" + rows.length);
			if(rows.length > 0) { // If auth token exists send, that
				//scope.user = rows[0];
				token = rows[0].authToken;
				return Promise.resolve([token, Promise.resolve(1)]);
			}
			else { // No auth token, so create one and send that	
				var uToken = new Object();		
				uToken.userId = userId;
				uToken.authToken = Util.generateToken();
				return [uToken.authToken, connection.queryAsync(Props.SqlStmts.INSERT_USERAUTH_TOKEN, uToken)];
				
			}
	})
	.spread(function(token, result) { // success!
		//return uToken.authToken;
		return token;
		//scope.token = uToken.authToken;
	})
	.catch(Promise.CancellationError, function(err) {
		//scope.connection.rollbackAsync();
		console.log("in CancellationError..." + err);
		return null;

	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.getAuthToken: userId: ' + userId + ': ' + err);
		return null;
		//reply([{appCode: 503, message: err}]);

	});

	//return scope.token;
}

UserController.findInvestigatorCases = function(userId) {
	//var scope = {};
	//scope.user = null;

	return new Promise
	.using(db.getSqlConnection(), function(connection) {
		var scope = {};
		scope.connection = connection;
		return scope;
	})
	.then(function(scope) {	
		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_OPEN_INV_CASES, [userId])];
	})
	.spread(function(scope, rows) {
		var map = new Object();
		rows.forEach(function(e) {
			var caseVO = new InvestigatorCaseVO();
			caseVO.id = e.id;
			caseVO.desc = e.description;
			caseVO.createdBy = e.createdBy;
			caseVO.createdDate = e.createdDate;
			caseVO.budget = e.budget;
			caseVO.status = e.status;

			map[caseVO.id] = caseVO;
		});

		scope.retMap = map;
		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_ASSIGNED_INV_CASES, [userId])]
	})
	.spread(function(scope, rows) {
		rows.forEach(function(e) {
			var caseVO = new InvestigatorCaseVO();
			caseVO.id = e.id;
			caseVO.desc = e.description;
			caseVO.createdBy = e.createdBy;
			caseVO.createdDate = e.createdDate;
			caseVO.budget = e.budget;
			caseVO.status = e.status;

			scope.retMap[caseVO.id] = caseVO;
		});

		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_INTERESTED_INV_CASES, [userId])]
	})
	.spread(function(scope, rows) {
		rows.forEach(function(e) {
			scope.retMap[e.id].isInterested = e.isInterested;
			scope.retMap[e.id].isAccepted = e.isAccepted;
		});
		return scope.retMap;
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.findInvestigatorCases: userId: ' + userId + ': ' + err);
		return null;
		//reply([{appCode: 503, message: err}]);

	});

}

UserController.findClientCases = function(userId) {
	//var scope = {};
	//scope.user = null;

	return new Promise
	.using(db.getSqlConnection(), function(connection) {
		var scope = {};
		scope.connection = connection;
		return scope;
	})
	.then(function(scope) {	
		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_OPEN_CLI_CASES, [userId])];
	})
	.spread(function(scope, rows) {
		var map = new Object();
		rows.forEach(function(e) {
			var caseVO = new ClientCaseVO();
			caseVO.id = e.id;
			caseVO.desc = e.description;
			caseVO.createdDate = e.createdDate;
			caseVO.budget = e.budget;
			caseVO.status = e.status;

			map[caseVO.id] = caseVO;
		});

		scope.retMap = map;
		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_ASSIGNED_CLI_CASES, [userId])]
	})
	.spread(function(scope, rows) {
		rows.forEach(function(e) {
			var caseVO = new ClientCaseVO();
			caseVO.id = e.id;
			caseVO.desc = e.description;
			caseVO.createdDate = e.createdDate;
			caseVO.budget = e.budget;
			caseVO.status = e.status;
			caseVO.assignedToId = e.assignedTo;
			caseVO.assignedToFirstName = e.firstName;
			caseVO.assignedToLastName = e.lastName;
			caseVO.assignedToCompanyName = e.companyName;

			scope.retMap[caseVO.id] = caseVO;
		});

		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_CLOSED_CLI_CASES, [userId])]
	})
	.spread(function(scope, rows) {
		rows.forEach(function(e) {
			var caseVO = new ClientCaseVO();
			caseVO.id = e.id;
			caseVO.desc = e.description;
			caseVO.createdDate = e.createdDate;
			caseVO.budget = e.budget;
			caseVO.status = e.status;

			scope.retMap[caseVO.id] = caseVO;
		});

		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_INTERESTED_CLI_CASES, [userId])]		
	})
	.spread(function(scope, rows) {
		rows.forEach(function(e) {
			var intObj = {
				piId : e.piId,
				userName : e.userName,
				firstName : e.firstName,
				lastName : e.lastName,
				companyName : e.companyName,
				accepted : e.accepted
			};

			scope.retMap[e.id].interests.push(intObj);
		});
		
		return scope.retMap;
	})

	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In UserController.findClientCases: userId: ' + userId + ': ' + err);
		return null;
		//reply([{appCode: 503, message: err}]);

	});

}


UserController.scheduleProcess1 = function() {
	  console.log('calling process1 !' + new Date());
};

UserController.scheduleProcess2 = function() {
	  console.log('calling process2 !' + new Date());
};


var self = module.exports = UserController;