/**
 * @param {string} mod absolute path of module
 */
exports.requireNoCache = function(mod) {
	var modulePath = require.resolve(mod);
	delete require.cache[modulePath];
	return require(modulePath);
};

/**
 * @param {Object} req express request object
 * @param {Function} callback
 */
exports.getRequestBody = function(req, callback) {
	var body = '';
	req.on('data', data => body += data);
	req.on('end', data => {
		if (data) {
			body += data;
		}
		callback(null, body);
	});
	req.on('error', err => callback(err));
};