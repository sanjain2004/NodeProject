var UserService = {}

/*UserService.findUserByUserName = function(conn, userName) {
			conn.query('SELECT count(*) as cnt from User where userName = ?', [userName], function(err, rows) {
                       	connection.release();
 							console.log("count = " + rows[0].cnt);
 							rows.forEach(function(entry) {
 								console.log('----'  + entry.last + ',' + entry.createdDate + ',' + moment(entry.createdDate).utc().format('YYYY-MM-DD HH:mm:ss'));
 							});
                           	reply([{
                                   statusCode: 200,
                                   message: 'count=rows[0].cnt' , 
                               }]);
                         	if(err) {
                         		throw new Error(err);
                         	}

                       });

}*/

module.exports = UserService;