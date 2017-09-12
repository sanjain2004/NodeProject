import requests
import json
import time

base_url = "http://localhost:3000"
clientUsername = 'c-1476494116'
clientPass = 'a'
piUsername = 'p-1476494934'
piPass = 'a'
clientToken = '5cf7fb13f268f18f76f15be5b1712d48938f90c3c34f90dc6cd066d538c964ce'
piToken = '95229e9c439f8d1fb626e22fa770d7540a2e0d0d0d71b4e26114526605c295f7'
clientId = '26'
piId = '29'
caseId = '8'


def clientSignUp():
	global clientUsername, clientPass, clientId
	url = base_url + "/user/client/signup"
	ts = str(int(time.time()))
	name = 'c-' + ts;
	data = {}
	#name = 'c3'
	clientUsername = data['firstName'] = data['lastName'] = data['userName'] = name
	data['email'] = 'a@a.com'
	clientPass = data['password'] = 'a';
	data['state'] = 'MA'
	data['phone'] = '123'

	json_data = json.dumps(data) #'{"firstName":name,"lastName":"c3", "userName":"c3", "email":"b@a.com", "password":"a", "state":"MA", "phone":"123"}'
	response = requests.post(url, data=json_data)
	print 'status_code=' + str(response.status_code)

	parsed_json = out(response)

	if parsed_json['appCode'] == 200:
		clientId = str(parsed_json['data'])

def piSignUp():
	global piUsername, piPass, piId
	url = base_url + "/user/investigator/signup"
	ts = str(int(time.time()))
	name = 'p-' + ts;
	data = {}
	piUsername = data['firstName'] = data['lastName'] = data['userName'] = name
	data['email'] = 'a@a.com'
	piPass = data['password'] = 'a';
	data['state'] = 'MA'
	data['phone'] = '123'
	data['licNumber'] = '1'
	data['licExpiry'] = '2016-01-01'
	data['companyName'] = 'comp-of-' + name
	data['practice'] = 'personal'

	json_data = json.dumps(data) 
	response = requests.post(url, data=json_data)

	parsed_json = out(response);

	if parsed_json['appCode'] == 200:
		piId = str(parsed_json['data'])

def clientLogin():
	global clientToken
	clientToken = userLogin(clientUsername, clientPass)

def piLogin():
	global piToken
	piToken = userLogin(piUsername, piPass)


def userLogin(username, passwd):
	url = base_url + "/user/login"
	data = {}
	data['userName'] = username
	data['password'] = passwd

	json_data = json.dumps(data)
	response = requests.post(url, data=json_data)

	parsed_json = out(response)

	if parsed_json['appCode'] == 200:
		return str(parsed_json['data'])
	else:
		return null;	

def findClientById():
	global clientId
	findUserById(clientId)

def findPIById():
	global piId
	findUserById(piId)

def findNonUserById():
	findUserById('-1')

def findUserById(uid):
	url = base_url + '/user/' + uid
	headers = {}
	headers['X-Token'] = clientToken

	response = requests.get(url, headers=headers)
	out(response)


def createCase():

	global caseId
	url = base_url + '/case'
	data = {}
	data['budget'] = 123	
	data['desc'] = 'this is the case desc'
	data['type'] = 'personal'

	headers = {}
	headers['X-Token'] = clientToken

	json_data = json.dumps(data)
	response = requests.post(url, headers=headers, data=json_data)

	parsed_json = out(response)
	caseId = str(parsed_json['data'])

def updateCase():

	global caseId
	url = base_url + '/case/' + caseId
	data = {}
	data['budget'] = 1234	
	data['desc'] = 'this is the updated case desc'

	headers = {}
	headers['X-Token'] = clientToken

	json_data = json.dumps(data)
	response = requests.put(url, headers=headers, data=json_data)

	parsed_json = out(response)

def assignCase():

	url = base_url + '/case/' + caseId + '/assign/' + piId

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.post(url, headers=headers)

	parsed_json = out(response)

def unassignCase():

	url = base_url + '/case/' + caseId + '/assign'
	print url

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.delete(url, headers=headers)

	parsed_json = out(response)

def interestedInCase():

	url = base_url + '/user/interest/' + caseId

	headers = {}
	headers['X-Token'] = piToken

	response = requests.post(url, headers=headers)

	parsed_json = out(response)

def uninterestedInCase():

	url = base_url + '/user/interest/' + caseId

	headers = {}
	headers['X-Token'] = piToken

	response = requests.delete(url, headers=headers)

	parsed_json = out(response)


def acceptInterestInCase():

	url = base_url + '/case/' + caseId + '/acceptInterest/' + piId

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.post(url, headers=headers)

	parsed_json = out(response) 

def unacceptInterestInCase():

	url = base_url + '/case/' + caseId + '/acceptInterest/' + piId

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.delete(url, headers=headers)

	parsed_json = out(response)

def createMessageFromP2C():

	global caseId
	url = base_url + '/case/' + caseId + '/message'

	data = {}
	data['text'] = 'conv from p 2 c'

	headers = {}
	headers['X-Token'] = piToken

	json_data = json.dumps(data)
	response = requests.post(url, headers=headers, data=json_data)

	parsed_json = out(response) 

def createMessageFromC2P():

	global caseId
	url = base_url + '/case/' + caseId + '/message'

	data = {}
	data['text'] = 'conv from c 2 p'
	data['to'] = [piId]

	headers = {}
	headers['X-Token'] = clientToken

	json_data = json.dumps(data)
	response = requests.post(url, headers=headers, data=json_data)

	parsed_json = out(response)

def createMessageFromC2P():

	global caseId
	url = base_url + '/case/' + caseId + '/message'

	data = {}
	data['text'] = 'conv from c 2 p'
	data['to'] = [piId]

	headers = {}
	headers['X-Token'] = clientToken

	json_data = json.dumps(data)
	response = requests.post(url, headers=headers, data=json_data)

	parsed_json = out(response) 

def getMessagesForClient():

	global caseId
	url = base_url + '/case/' + caseId + '/messages'

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.get(url, headers=headers)

	parsed_json = out(response)

def getMessagesForPI():

	global caseId
	url = base_url + '/case/' + caseId + '/messages'

	headers = {}
	headers['X-Token'] = piToken

	response = requests.get(url, headers=headers)

	parsed_json = out(response)


def closeCase():

	global caseId
	url = base_url + '/case/' + caseId + '/close'

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.put(url, headers=headers)

	parsed_json = out(response)

def findCases():

	url = base_url + '/user/cases'

	headers = {}
	headers['X-Token'] = clientToken

	response = requests.get(url, headers=headers)

	parsed_json = out(response)


def out(response):
	parsed_json = json.loads(response.text);

	print('=' * 20 + 'RESPONSE TEXT' + '=' * 20)
	print response.text
	
	return parsed_json


########### Working
#clientSignUp()
#piSignUp()
#clientLogin()
#piLogin()
#findClientById()
#findPIById()
#findNonUserById()
#createCase()
#updateCase()
#assignCase()
#unassignCase()
#interestedInCase()
#uninterestedInCase()
#acceptInterestInCase()
#unacceptInterestInCase()
#createMessageFromP2C()
#createMessageFromC2P()
#getMessagesForClient()
#getMessagesForPI()
#closeCase()
#findCases()
########### TODO

#findCases()

#print 'client token = ' + clientToken
#print 'pi token = ' + piToken

#print 'Client - ' + '*'.join([clientId, clientUsername, clientPass]) 
#print 'Client - ' + '-'.join([piId, piUsername, piPass]) 
#print clientUsername
#print clientPass

