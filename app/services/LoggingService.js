'use strict';

var moment = require('moment');
const winston = require('winston');

//const fs = require('fs');
//const env = process.env.NODE_ENV || 'development';
//const logDir = 'log';

// Create the log directory if it does not exist
//if (!fs.existsSync(logDir)) {
//  fs.mkdirSync(logDir);
//}

const tsFormat = () => moment().format();

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      silent: true, // Will not output
      level: 'info'
    }),

    new (winston.transports.File)({
      //filename: `${logDir}/results.log`,
      filename: '../logs/app.log',
      timestamp: tsFormat,
      //level: env === 'development' ? 'debug' : 'info'
      level: 'error'
    })
  ]
});

module.exports = logger;

//logger.info('Hello world');
//logger.warn('Warning message');
//logger.debug('Debugging info');