const winston = require('winston');
const path = require('path');

module.exports = function(logPath) {

	const logger = winston.createLogger({
	  level: 'info',
	  format: winston.format.json(),
	  transports: [
	    //
	    // - Write to all logs with level `info` and below to `combined.log` 
	    // - Write all logs error (and below) to `error.log`.
	    //
	    new winston.transports.File({
	    	filename: path.join(logPath, 'error.log'),
	    	level: 'error',
	    }),
	    new winston.transports.File({
	    	filename: path.join(logPath, 'info.log'),
	    })
	  ]
	});

	if (process.env.NODE_ENV !== 'production') {
	  logger.add(new winston.transports.Console({
	    format: winston.format.json()
	  }));
	}

	return logger;
};