var UserController = require('./controllers/UserController.js');
var CaseController = require('./controllers/CaseController.js');
var SecurityController = require('./controllers/SecurityController.js');

module.exports = function initializeRoutes(server) {
	
	// Important Security
	// This will be called before each request. Perform token validation here.
	server.ext('onRequest', SecurityController.validateToken);

	server.route({
	    method: 'POST',
	    path: '/user/investigator/signup',
	    handler: UserController.createInvestigator
	});

	server.route({
	    method: 'POST',
	    path: '/user/client/signup',
	    handler: UserController.createClient
	});

	server.route({
	    method: 'GET',
	    path: '/user/{id}',
	    handler: UserController.findById
	});

	server.route({
	    method: 'GET',
	    path: '/user/cases',
	    handler: UserController.findMyCases
	});	

	server.route({
	    method: 'POST',
	    path: '/user/login',
	    handler: UserController.login
	});

	server.route({
	    method: 'POST',
	    path: '/user/interest/{caseId}',
	    handler: UserController.interestedInCase
	});

	server.route({
	    method: 'DELETE',
	    path: '/user/interest/{caseId}',
	    handler: UserController.deleteInterestedInCase
	});

	// CaseController
	server.route({
	    method: 'POST',
	    path: '/case',
	    handler: CaseController.createCase
	});

	server.route({
	    method: 'POST',
	    path: '/case/{caseId}/assign/{assignToId}',
	    handler: CaseController.assignCase
	});

	server.route({
	    method: 'DELETE',
	    path: '/case/{caseId}/assign',
	    handler: CaseController.unassignCase
	});

	server.route({
	    method: 'PUT',
	    path: '/case/{caseId}',
	    handler: CaseController.updateCase
	});

	server.route({
	    method: 'PUT',
	    path: '/case/{caseId}/close',
	    handler: CaseController.closeCase
	});

	server.route({
	    method: 'POST',
	    path: '/case/{caseId}/message',
	    handler: CaseController.createMessage
	});

	server.route({
	    method: 'GET',
	    path: '/case/{caseId}/messages',
	    handler: CaseController.getMessages
	});

	server.route({
	   method: 'POST',
	   path: '/case/{caseId}/acceptInterest/{piId}',
	   handler: CaseController.acceptInterestInCase
	});

	server.route({
	   method: 'DELETE',
	   path: '/case/{caseId}/acceptInterest/{piId}',
	   handler: CaseController.unacceptInterestInCase
	});



}