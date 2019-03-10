function init(config) {

	const publicIP = require('public-ip');
	const cron = require('node-cron');

	const logger = require('./controllers/logger')(config.LOGS_PATH);
	const route53 = require('./controllers/route53')(config);
	
	cron.schedule(config.SCHEDULE, () => {

		logger.info('------------------------');
	  	logger.info(new Date() + '');
	  	
	  	publicIP.v4({https: true}).then(function(publicIp){
			logger.info('Public IP: ' + publicIp);
			return publicIp;
		})
		.then(function(ip) {
			return route53.update(ip);
		})
		.then(function(data) {
		    logger.info(data);
		})
		.catch(function(error, some) {
			logger.error(error);
		});
	});
}

module.exports = init;