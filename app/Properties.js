// SQL STATEMENTS
// User
const FIND_USER_BY_NAME = 'SELECT * from User where userName = ?';
const FIND_USER_BY_ID = 'SELECT * from User where id = ?';
const FIND_INV_USER_BY_ID = 'SELECT s.*, p.* from PiXState s, PiXStateXPractice p where s.investigatorId = ? and p.piId = s.investigatorId';
const INSERT_USER = 'INSERT INTO User set?';
const INSERT_INV_USER = 'INSERT INTO InvestigatorUser set?';
const INSERT_PI_X_STATE = 'INSERT INTO PiXState set?';
const INSERT_PI_X_STATE_X_PRACTICE = 'INSERT INTO PiXStateXPractice set?';
const INSERT_CLIENT_USER = 'INSERT INTO ClientUser set?';
const INSERT_CASE = 'INSERT INTO PILCase set?';
const FIND_TOKEN_FOR_USER = 'SELECT * from UserAuthToken where userId = ?';
const INSERT_USERAUTH_TOKEN = 'INSERT INTO UserAuthToken set?';
const FIND_USER_BY_AUTH_TOKEN = 'SELECT u.* from User u, UserAuthToken a where a.authToken = ? and u.id = a.userId';

// Case
const ASSIGN_CASE = 'UPDATE PILCase set assignedTo = ?, assignedDate = ?, status = ? where id = ? and createdBy = ? and status != \'closed\'';
const CLOSE_CASE = 'UPDATE PILCase set status = ? where id = ? and createdBy = ? and status != \'closed\'';
const UPDATE_CASE = 'UPDATE PILCase set budget = ?, description = ? where id = ? and createdBy = ?';
const FIND_PI_IS_INTERESTED = 'SELECT * from CaseInterest where caseId = ? and piId = ?';
const INSERT_CASE_INTERESTED = 'INSERT IGNORE INTO CaseInterest set?';
const DELETE_CASE_INTERESTED = 'DELETE from CaseInterest where caseId = ? and piId = ?';
const ACCEPT_CASE_INTEREST = 'UPDATE CaseInterest ci, PILCase c set ci.accepted = ? \
									where ci.caseId = ? and ci.piId = ? and ci.interested = 1 and c.createdBy = ? and ci.caseId = c.id and c.status = \'open\'';
const FIND_CASE_BY_ID = 'SELECT * from PILCase where id = ?';
const FIND_CASE_MSGS_FOR_PI = 'SELECT t.*, u2.username as fromName, u1.username as toName from (\
								(select cc.*, c.createdBy as msgTo from PILCase c, CaseConversation cc where cc.caseId = ? and cc.createdBy = ? and c.id = cc.caseId) \
								union \
								(select cc.*, p.userId as msgTo from CaseConversation cc, CaseConversationParticipants p where caseId = ? and  p.userId = ? and cc.id = p.caseConversationId) \
							   ) t, User u1, User u2 where t.msgTo = u1.id and t.createdBy = u2.id order by t.createdDate desc';

const FIND_CASE_MSGS_FOR_CLIENT = 'select t.*, u2.username as fromName, u1.username as toName from (\
									(select cc.*, c.createdBy as msgTo from PILCase c, CaseConversation cc where caseId = ? and cc.createdBy != c.createdBy  and c.id = cc.caseId) \
    								union \
									(select cc.*, p.userId as msgTo from PILCase c, CaseConversation cc, CaseConversationParticipants p where cc.caseId = ? and \
															c.id = cc.caseId and cc.createdBy = c.createdBy and cc.id = p.caseConversationId) \
								   ) t, User u1, User u2 where t.msgTo = u1.id and t.createdBy = u2.id order by t.createdDate desc';


// Case conversation
const INSERT_CASE_CONV = 'INSERT INTO CaseConversation set?';
const INSERT_CASE_CONV_PART = 'INSERT INTO CaseConversationParticipants set?';

// Get all cases for investigator user
const FIND_OPEN_INV_CASES = 'SELECT c.id, c.description, c.budget, c.status, c.updatedDate, c.type \
									from PILCase c, User cliU \
									where cliU.stateCode = (select stateCode from User where id = ?) \
									and c.status = \'open\' and c.createdBy = cliU.id and cliU.role = \'client\' order by c.updatedDate desc';

const FIND_ASSIGNED_INV_CASES = 'SELECT c.id, c.description, c.budget, c.status, c.updatedDate, c.type from PILCase c where assignedTo = ?';

const FIND_INTERESTED_INV_CASES = 'SELECT c.id, c.description, c.budget, c.status, c.updatedDate, c.type, i.accepted \
										from PILCase c, CaseInterest i where i.piId = ? and c.id = i.caseId and c.status != \'closed\'';

// Get all cases for a client user
const FIND_OPEN_CLI_CASES = 'SELECT c.id, c.description, c.budget, c.status, c.updatedDate, c.type from PILCase c where status = \'open\' and createdBy = ?';
const FIND_ASSIGNED_CLI_CASES = 'SELECT c.id, c.description, c.budget, c.status, c.updatedDate, c.assignedTo, c.type, u.firstName, u.lastName, s.companyName \
									from PILCase c, User u, PiXState s \
									where c.status = \'assigned\' and createdBy = ? and s.investigatorId = u.id and u.id = c.assignedTo';

const FIND_INTERESTED_CLI_CASES = 'SELECT c.id, u.id as piId, u.userName, u.firstName, u.lastName, s.companyName, i.accepted \
										from PILCase c, CaseInterest i, User u, PiXState s \
										where c.id = i.caseId and c.createdBy = ? \
										and u.id = i.piId and u.id = s.investigatorId';
const FIND_CLOSED_CLI_CASES = 'SELECT c.id, c.description, c.budget, c.status, c.updatedDate, c.type from PILCase c where status = \'closed\' and createdBy = ?';

const SqlStmts = {	
	FIND_USER_BY_NAME, 
	FIND_USER_BY_ID,
	FIND_INV_USER_BY_ID,
	FIND_USER_BY_AUTH_TOKEN,
	FIND_OPEN_INV_CASES,
	FIND_ASSIGNED_INV_CASES,
	FIND_INTERESTED_INV_CASES,
	FIND_OPEN_CLI_CASES,
	FIND_ASSIGNED_CLI_CASES,
	FIND_INTERESTED_CLI_CASES,
	FIND_CLOSED_CLI_CASES,
	FIND_CASE_BY_ID,
	FIND_CASE_MSGS_FOR_PI,
	FIND_CASE_MSGS_FOR_CLIENT,

	INSERT_USER,
	INSERT_INV_USER,
	INSERT_PI_X_STATE,
	INSERT_PI_X_STATE_X_PRACTICE,
	INSERT_CLIENT_USER,
	INSERT_CASE,
	INSERT_CASE_CONV,
	INSERT_CASE_CONV_PART,
	INSERT_CASE_INTERESTED,
	INSERT_USERAUTH_TOKEN,

	ASSIGN_CASE,
	CLOSE_CASE,
	UPDATE_CASE,
	FIND_PI_IS_INTERESTED,
	DELETE_CASE_INTERESTED,
	ACCEPT_CASE_INTEREST,
	FIND_TOKEN_FOR_USER
}

// OTHER CONSTANTS
const CLOSED = 'closed';
const OPEN = 'open';
const ACTIVE = 'active';
const ASSIGNED = 'assigned';
const INVESTIGATOR = 'investigator';
const CLIENT = 'client';
const X_TOKEN = "x-token";

const Constants = {
	// Header
	X_TOKEN,
	// App
	CLOSED,
	OPEN,
	ACTIVE,
	ASSIGNED,
	INVESTIGATOR,
	CLIENT
}

module.exports = {
	SqlStmts,
	Constants
}