function InvestigatorCaseVO() {
	this.id = null;
	this.desc = null;
	this.budget = null;
	this.status = null;
	this.createdDate = null;
	this.interests = []; // should be an array of objects {piId, pi company name, isInterested, isAccepted, interest created date}
	this.assignedToId = null;
	this.assignedToFirstName = null;
	this.assignedToLastName = null;
	this.assignedToCompanyName = null;
}

module.exports = InvestigatorCaseVO;
