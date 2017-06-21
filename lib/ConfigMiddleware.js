/**
 * @typedef ConfigDesc
 * @type {Object}
 * @property {string} desc
 * @property {?string} value
 * @property {{value: string, desc: string}[]} options
 */

var path = require('path');
var util = require('./util');

class ConfigMiddleware {
	/**
	 * 
	 * @param {string} root 
	 */
	constructor (root) {
		this.$root = root;
		this.$configFileName = 'config';
		this.$config = {};
	}

	handle(req, res, next) {
		if (req.path.startsWith('/mock-config/')) {
			var fileName = req.path.substr('/mock-config/'.length);
			res.sendFile(path.join(__dirname, '../assets/' + (fileName || 'index.html')));
		} else if (req.path === '/mock-config') {
			if (req.method === 'GET') {
				res.json(this.get());
			} else if (req.method === 'POST') {
				util.getRequestBody(req, (err, body) => {
					if (err) {
						return next(err);
					}
					res.json(this.set(JSON.parse(body)));
				});
			} else {
				res.status(405);
				res.send('405 Method Not Allowed');
			}
		} else {
			req.$config = this.$config;
			next();
		}
	}

	/**
	 * 
	 * @param {{key: string, value: string}|{key: string, value: string}[]} config 
	 */
	set(config) {
		if (Array.isArray(config)) {
			config.forEach(cfg => this.$config[cfg.key] = cfg.value);
		} else if (config) {
			this.$config[config.key] = config.value;
		}
		return this.get();
	}

	/**
	 * @return {Object.<string, ConfigDesc>}
	 */
	get() {
		var configMap = util.requireNoCache(path.join(this.$root, this.$configFileName));
		Object.keys(configMap).forEach(key => {
			configMap[key].value = this.$config[key] || 'Normal';
		});
		return configMap;
	}
}

module.exports = ConfigMiddleware;