'use strict';

const Hapi = require('hapi');
//var UserController = require('./controllers/UserController.js');

//require('./services/SchedulerService.js');

const server = new Hapi.Server();
server.connection({ port: 3000 });

require('./routes.js')(server);

/*
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: UserController.count
});

server.route({
    method: 'POST',
    path: '/user/create',
    handler: UserController.createMultipleNew
});

server.route({
    method: 'PUT',
    path: '/user/update',
    handler: UserController.update
});
*/
// var j = schedule.scheduleJob('42 * * * * *', function() {
//   console.log('The answer to life, the universe, and everything!' + new Date());
// });

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

   // var j = schedule.scheduleJob('* * * * *', function() {
  //console.log('The answer to life, the universe, and everything!');
//});

});