var moment = require('moment');
var Promise = require('bluebird');

const db = require('../database.js');
const Props = require('../Properties.js');
const Util = require('../Util.js');

const L = require('../services/LoggingService.js');

var CaseController = {}

CaseController.createCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.createdBy = request.app.user.id;
	kase.budget = request.payload.budget;
	kase.description = request.payload.desc;
	kase.status = Props.Constants.OPEN;
	kase.type = request.payload.type;

	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.INSERT_CASE, kase);
	})
	.then(function(result) {
			scope.caseId = result.insertId;
	})
	.then(function() {
		scope.connection.commitAsync();
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
 			reply({appCode: 200, data: scope.caseId});
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.createCase: userId: ' + kase.createdBy + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

// Update case
CaseController.updateCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.id = request.params.caseId;
	kase.createdBy = request.app.user.id;
	kase.budget = request.payload.budget;
	kase.description = request.payload.desc;
				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	}) 
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.UPDATE_CASE, [kase.budget, kase.description, kase.id, kase.createdBy]);
	})
	.then(function(result) {
		scope.changedRows = result.changedRows;
		scope.connection.commitAsync();
	})
	.then(function() { //@TODO: Check if the update was done or failed		
			//console.log("returned=" + result.insertId);
			if(scope.changedRows == 0) {
				reply({appCode: 200, message: 'Case was not updated. Check if case ' + kase.id + ' exists for ' + request.app.user.userName + ' or no fields have changed.'});
			}
			else {
 				reply({appCode: 200, data: kase.id});
 			}

	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.updateCase: userId: ' + kase.createdBy + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

// Assign case
CaseController.assignCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.id = request.params.caseId;
	kase.status = Props.Constants.ASSIGNED;
	kase.assignedTo = request.params.assignToId;
	kase.createdBy = request.app.user.id;
	kase.assignedDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.ASSIGN_CASE, [kase.assignedTo, kase.assignedDate, kase.status, kase.id, kase.createdBy]);
	})
	.then(function(result) {
		scope.changedRows = result.changedRows;
		scope.connection.commitAsync();
	})
	.then(function() { //@TODO: assigned date
			//console.log("returned=" + result.insertId);
			if(scope.changedRows == 0) {
				reply({appCode: 404, message: 'Case was not assigned. Check if case ' + kase.id + ' exists for ' + request.app.user.userName + '.'});
			}
			else {
	 			reply({appCode: 200, data: true});
 			}
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.assignCase: userId: ' + kase.createdBy + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

// Un-Assign case
CaseController.unassignCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.id = request.params.caseId;
	kase.status = Props.Constants.OPEN;
	kase.createdBy = request.app.user.id;
				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.ASSIGN_CASE, [null, null, kase.status, kase.id, kase.createdBy]);
	})
	.then(function(result) {
		scope.changedRows = result.changedRows;
		scope.connection.commitAsync();
	})
	.then(function(result) { //@TODO: Check if the assignment was done or failed		
			//console.log("returned=" + result.insertId);
			if(scope.changedRows == 0) {
				reply({appCode: 404, message: 'Case was not unassigned. Check if case ' + kase.id + ' exists for ' + request.app.user.userName + '.'});
			}
			else {
	 			reply([{appCode: 200, data: true}]);
 			}
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.unassignCase: : userId: ' + kase.createdBy + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

// Close case
CaseController.closeCase = function(request, reply) {

	// case is a key word
	var kase = new Object();
	kase.id = request.params.caseId;
	kase.createdBy = request.app.user.id;
				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.CLOSE_CASE, [Props.Constants.CLOSED, kase.id, kase.createdBy]);
	})
	.then(function(result) {
		scope.changedRows = result.changedRows;
		scope.connection.commitAsync();
	})
	.then(function(result) { //@TODO: Check if the assignment was done or failed
			//console.log("returned=" + result.insertId);
		if(scope.changedRows == 0) {
				reply({appCode: 404, message: 'Case was not closed. Check if case ' + kase.id + ' exists for ' + request.app.user.userName + ' or is already closed.'});
			}
			else {
	 			reply({appCode: 200, message: true});
 			}
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.closeCase: userId: ' + kase.createdBy + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

CaseController.acceptInterestInCase = function(request, reply) {
	return self._doAcceptInterestInCase(request, reply, 1);
}

CaseController.unacceptInterestInCase = function(request, reply) {
	return self._doAcceptInterestInCase(request, reply, 0);
}

// Accept interest
CaseController._doAcceptInterestInCase = function(request, reply, accept) {

	// case is a key word
	if(Util.isUndefinedOrNull(request.app.user)) {
		reply([{appCode: 403, message: "You are not logged in."}])
	}

	var kase = new Object();
	kase.caseId = request.params.caseId;
	kase.piId = request.params.piId;
	kase.createdBy = request.app.user.id;
				
	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function(connection) {
		scope.connection.beginTransactionAsync();
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.ACCEPT_CASE_INTEREST, [accept, kase.caseId, kase.piId, kase.createdBy]);
	})
	.then(function(result) {
		scope.changedRows = result.changedRows;
		scope.connection.commitAsync();
	})
	.then(function(result) {
		if(scope.changedRows == 0) {
			reply({appCode: 404, message: 'Case interest was not accepted. Check if case ' + kase.caseId + ' exists for ' + request.app.user.userName + ' or no fields have changed.'});
		}
		else {
			//console.log("returned=" + result.insertId);
 			reply({appCode: 200, data: true});
 		}
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController._doAcceptInterestInCase: userId: ' + kase.createdBy + ': ' + err);
		reply({appCode: 503, message: err});

	});
}

CaseController.getMessages = function(request, reply) {

	// PI is getting all messages of the case
	if(request.app.user.role == Props.Constants.INVESTIGATOR) {
		return self.getMessagesForInvestigator(request, reply);
	}
	else {
		return self.getMessagesForClient(request, reply);
	}
}

CaseController.getMessagesForInvestigator = function(request, reply) {

	var caseId = request.params.caseId;
	var piId = request.app.user.id;

	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.FIND_CASE_MSGS_FOR_PI, [caseId, piId, caseId, piId]);
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
			reply({appCode: 200, data: result});
 			//reply([{appCode: 200, message: 'Case messages - ' + accept}]);
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.getMessagesForInvestigator: userId: ' + piId + ': ' + err);
		reply({appCode: 503, message: err});

	});


}

CaseController.getMessagesForClient = function(request, reply) {

	var caseId = request.params.caseId;
	var clientId = request.app.user.id;

	var scope = {};
	var p = Promise
	.using(db.getSqlConnection(), function(connection) {
		scope.connection = connection;
	})
	.then(function() {
		return scope.connection.queryAsync(Props.SqlStmts.FIND_CASE_MSGS_FOR_CLIENT, [caseId, caseId]);
	})
	.then(function(result) {		
			//console.log("returned=" + result.insertId);
			reply({appCode: 200, data: result});
 			//reply([{appCode: 200, message: 'Case messages - ' + accept}]);
	})
	.catch(function(err) {
		//scope.connection.rollbackAsync();
		L.error('In CaseController.getMessagesForClient: userId: ' + clientId + ': ' + err);
		reply({appCode: 503, message: err});

	});


}

// Add to case conversation
// Rules for inserting a new message
// - If the creator of the message is of role investigator, then the message must be for the case creator. 
//       - Check that the investigator is assigned to the case or is in the CaseInterest table with accepted as true. This means the PI showed interest and the client
//         has accepted to talk to the PI. If the PI is not at either of the 2 places, do not insert.	
//       - No need to check the payload of the "to" attribute.
//       - Make an entry in the CaseConversationParticipants table with the PI id (Case creator is always a participant)
// - If the creator of the message is of role client, then the message must be for a PI
//       - Check the case was created by this client
//       - Case is not closed
//       - There must be a "to" attribute on the payload. It is an array of PI ids to whom the message is directed to
//       - Make sure that PI has the case assigned to them or are in the CaseInterest table with accepted as true.
//       - Make an entry in the CaseConversationParticipants table with the PI id (Case creator is always a participant)
//			
CaseController.createMessage = function(request, reply) {

	// case is a key word
	var msg = new Object();
	msg.caseId = request.params.caseId;
	msg.createdBy = request.app.user.id;
	msg.text = request.payload.text;

	var piId = null;
	var toPiId = null;
	// PI is sending this message
	if(request.app.user.role == Props.Constants.INVESTIGATOR) {
		piId = msg.createdBy;
	}
	else { // Client is sending this message
		var toArr = request.payload.to;
		if(!Util.isUndefinedOrNull(toArr)) {
			if(toArr.length > 0) {
				piId = toArr[0];
				toPiId = piId;
			}
		}		
	}

	if(piId == null) {
		var errMsg = 'The message does not have a recipient.';
		return reply({appCode: 503, message: errMsg})
	}

	self.isMessageEligible(request, piId)
		.then(function(result) {
			if(!result.eligible) {				
				//var errMsg = 'The recipient is not eligible to get the message.';
				var errMsg = result.reason;
				return reply({appCode: 503, message: errMsg})
			}
			else {
				self._saveMessage(msg, toPiId)
					.then(function(convId) {
						if(convId == null) {
							var errMsg = 'Failed to add a message. Try again.';
							return reply({appCode: 503, message: errMsg})
						}
						else {
							return reply({appCode: 200, data: convId});
						}
					});
			}

		});
}

CaseController._saveMessage = function(message, toPiId) {

	return new Promise
		.using(db.getSqlConnection(), function(connection) {
			var scope = {};
			scope.connection = connection;
			return scope;		
		})
		.then(function(scope) {
			return [scope, scope.connection.beginTransactionAsync()];
		})
		.spread(function(scope) {
			return [scope, scope.connection.queryAsync(Props.SqlStmts.INSERT_CASE_CONV, message)];
		})
		.spread(function(scope, result) {
			scope.convId = result.insertId;
			if(toPiId == null) {
				return [scope, Promise.resolve(result)];
			}
			else {
				var partObj = new Object();
				partObj.caseConversationId = result.insertId;
				partObj.userId = toPiId;
				return [scope, scope.connection.queryAsync(Props.SqlStmts.INSERT_CASE_CONV_PART, partObj)];
			}
			
		})
		.spread(function(scope, result) {		
			return [scope, scope.connection.commitAsync()];
		})
		.spread(function(scope) {		
			return scope.convId;
		})
		.catch(function(err) {
			L.error('In CaseController._saveMessage:: userId: ' + message.createdBy + ': ' + err);
			return null;
		});
}

CaseController.isMessageEligible = function(request, piId) {

	return new Promise
	.using(db.getSqlConnection(), function(connection) {
		var scope = {};
		scope.ret = {};
		scope.connection = connection;
		return scope;		
	})
	.then(function(scope) {
		return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_CASE_BY_ID, [request.params.caseId])];
	})
	.spread(function(scope, rows) {
 		if(rows.length > 0) {
 			var kase = rows[0];
 			// Check case status is closed
 			if(kase.status == Props.Constants.CLOSED) {
				scope.ret.eligible = false; 
				scope.ret.reason = 'Case - ' + kase.id + ' is closed.';
				return Promise.resolve([scope, []]);					
 			}
 			// If the message sender is client, make sure the client is the creator of the case
 			if(request.app.user.role == Props.Constants.CLIENT) {
				if(kase.createdBy != request.app.user.id) {
					scope.ret.eligible = false; 
					scope.ret.reason = 'Client is not the creator of case - ' + kase.id;
					return Promise.resolve([scope, []]);					
				}
			}
			// Check the eligiblility of PI
 			if(!Util.isUndefinedOrNull(kase.assignedTo)) {
 				if(kase.assignedTo == piId) {
					// The case is assigned to the PI, so the eligible message is eligible
					scope.ret.eligible = true;
					return Promise.resolve([scope, []]);
				}
				else {
					// The case is assigned to some other PI, so the message is not eligible
					scope.ret.eligible = false;
					scope.ret.reason = 'Case - ' + kase.id + ' is assigned to piid - ' + kase.assignedTo;
					return Promise.resolve([scope, []]);
				}
 			}
 			else {
 				return [scope, scope.connection.queryAsync(Props.SqlStmts.FIND_PI_IS_INTERESTED, [request.params.caseId, piId])];			
 			} 
		}
		else {
			// Case not found. Return false;
			scope.ret.eligible = false;
			scope.ret.reason = 'Case - ' + kase.id + ' does not exist.';
			return Promise.resolve([scope, []]);
		}
		
	})
	.spread(function(scope, rows) {
		if(!Util.isUndefinedOrNull(scope.ret.eligible)) {
			return scope.ret;
		}
		if(rows.length == 0) {
			// Interest row for PI/Case not found
			return { eligible: false, reason: 'Case id - ' + request.params.caseId + ', piid - ' + piId + ' not found in interest table.'};
		}
		if((rows[0].interested == 1) && (!Util.isUndefinedOrNull(rows[0].accepted)) && (rows[0].accepted == 1)) { // User is interested in case and was client accepted
			return { eligible: true };
		}
		return { eligible: false, reason: 'Case id - ' + request.params.caseId + ', piid - ' + piId + ' - user might be interested but client did not accept.'};
	})
	.catch(Promise.CancellationError, function(obj) {
		return obj;

	})
	.catch(function(err) {
		L.error('In CaseController.isMessageEligible: userId:' + request.app.user.id + ': ' + err);
		return { eligible: false, reason: err };
	});
}


self = module.exports = CaseController;
