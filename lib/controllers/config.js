const dotenv = require('dotenv');

var loadConfig = function() {

	return {
		load: function(path) {
			
			this.env = dotenv.config({
				path: path,
				debug: process.env.NODE_ENV !== 'production'
			}).parsed;
		},
		env: {

		}
	}
}();

module.exports = loadConfig;