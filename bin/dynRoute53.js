#!/usr/bin/env node

(function() {

	const dynRoute53 = require('../lib/dynRoute53');
	const fs = require('fs');
	const args = require('minimist')(process.argv.slice(2));
	
	var config;

	if (args['f']) {

		//File Configurations
		var configPath = args['f'];

		if (!fs.existsSync(configPath) || fs.lstatSync(configPath).isDirectory()) {
			console.log("Error: The configuration file " + configPath + " is not a valid file.");
			return;
		}

		var Config = require('../lib/controllers/config');
		Config.load(configPath)
		config = Config.env;
	}
	else {

	 	config = {
			AWS_ACCESS_KEY_ID: args['accessKeyID'],
			AWS_SECRET_ACCESS_KEY: args['secretAccessKey'],
			AWS_ROUTE53_HOSTEDZONEID: args['route53HostedZone'],
			AWS_ROUTE53_RECORDSETNAMES: args['recordSetNames'],
			SCHEDULE: args['schedule'],
			LOGS_PATH: args['logsPath']
		}
	}

	var mandatoryConfig = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_ROUTE53_HOSTEDZONEID', 'AWS_ROUTE53_RECORDSETNAMES'];
	const configKeys = Object.keys(config);

	var filtered = mandatoryConfig.filter( n => !configKeys.includes(n) || config[n] === undefined );

	if (filtered.length != 0)
		console.log('Missing', filtered[0], 'in the configuration.');
	else
		dynRoute53(config);
})()