var path = require('path');
var util = require('./util');

class DataMiddleware {
	constructor (root) {
		this.$root = root;
		this.$mapFileName = 'map';
	}

	handle(req, res, next) {
		/**
		 * map:
		 * {
		 *   page: {
		 *     '/page/one': './page/one',
		 *     '/page/two': './page/two'
		 *   },
		 *   ajax: {
		 *     '/api/foo': './ajax/foo',
		 *     '/api/bar': './ajax/bar'
		 *   }
		 * }
		 */
		var map = util.requireNoCache(path.join(this.$root, this.$mapFileName));
		var mod;
		if ((mod = map.ajax[req.path])) {
			res.json(this.getData(mod, req));
		} else if ((mod = map.page[req.path])) {
			req.$data = this.getData(mod, req);
			next();
		} else {
			next();
		}
	}

	getData(mod, req) {
		var data = util.requireNoCache(path.join(this.$root, mod));
		if (typeof data === 'function') {
			data = data(req);
		}
		return data;
	}
}

module.exports = DataMiddleware;