var mysql = require('mysql');  // include the mysql plugin

var Promise = require("bluebird");
Promise.config({
	cancellatiion: true
});

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype); 
//setup the connection 
// var connection = mysql.createConnection({
//  host     : 'localhost',
//  user     : 'root',
//  database : 'piltest'
// });

//  debug	  : true

var pool = mysql.createPool({
 connectionLimit : 10,
 host     : 'localhost',
 user     : 'root',
 database : 'pil',
 debug    : ['ComQueryPacket'] //, 'RowDataPacket']
});
 
function getSqlConnection() {
    return pool.getConnectionAsync().disposer(function(connection) {
    	console.log("Releasing connection");
        connection.release();
    });
}

// connection.connect(function(err) { 
//    if (err) {
//      console.error('error connecting: ' + err.stack);
//      return;
//    }
//    else{
//         console.log('mysql started');
//    }
// });
 
//export this module , then only we can use this in other files 
//module.exports = getSqlConnection;

module.exports = { 
//  pool: pool 
	getSqlConnection : getSqlConnection
}