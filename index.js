var path = require('path');
var util = require('./lib/util');
var ConfigMiddleware = require('./lib/ConfigMiddleware');
var DataMiddleware = require('./lib/DataMiddleware');

exports = module.exports = function(root) {
	root = root || path.join(process.cwd(), 'mock');
	var configMdl = new ConfigMiddleware(root);
	var dataMdl = new DataMiddleware(root);
	return function(req, res, next) {
		configMdl.handle(req, res, () => {
			dataMdl.handle(req, res, next);
		});
	}
};

exports.ConfigMiddleware = ConfigMiddleware;
exports.DataMiddleware = DataMiddleware;
exports.requireNoCache = util.requireNoCache;
exports.getRequestBody = util.getRequestBody;