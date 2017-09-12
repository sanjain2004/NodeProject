var schedule = require('node-schedule');
const UserController = require('../controllers/UserController.js');
//var SchedulerService = {}

schedule.scheduleJob('30 * * * * *', function() {
	UserController.scheduleProcess1();
});

schedule.scheduleJob('45 * * * * *', function() {
	UserController.scheduleProcess2();
});

//module.exports = SchedulerService;