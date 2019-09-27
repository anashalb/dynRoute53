function init(config) {

	const publicIP = require('public-ip');
	const cron = require('node-cron');

	const logger = require('./controllers/logger')(config.LOGS_PATH);
	const route53 = require('./controllers/route53')(config);
	
	const NodeCache = require( "node-cache" );
	const cache = new NodeCache();

	cron.schedule(config.SCHEDULE, () => {

		logger.info('------------------------');
	  	logger.info(new Date() + '');
	  	
	  	var ip;

	  	publicIP.v4().then(function(publicIp){
			
			ip = publicIp;

			logger.info('Public IP: ' + ip);
			let existingIP = cache.get("ip-address");

			if (existingIP === ip) {
				return Promise.resolve({
					Message: `IP ${ip} already updated`,
				});
			}
			else {
				return route53.update(ip);	
			}
		})
		.then(function(data) {

			cache.set("ip-address", ip);
		    logger.info(data);
		})
		.catch(function(error, some) {
			logger.error(error);
		});
	});
}

module.exports = init;