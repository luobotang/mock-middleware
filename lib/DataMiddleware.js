var path = require('path')

class DataMiddleware {
  constructor (root) {
    this.$root = root
		this.$mapFileName = 'map'
		this.$mapFilePath = path.join(this.$root, this.$mapFileName)
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
    var map = require(this.$mapFilePath)
    var mod
    if ((mod = map.ajax && map.ajax[req.path])) {
      this.getData(mod, req, data => {
        res.json(data)
      })
    } else if ((mod = map.page && map.page[req.path])) {
      this.getData(mod, req, data => {
        req.$data = data
        next()
      })
    } else {
      next()
    }
  }

  getData(mod, req, callback) {
    var data = require(path.join(this.$root, mod))
    if (typeof data === 'function') {
      if (data.length < 2) {
        callback(data(req))
      } else {
        data(req, callback)
      }
    } else {
      callback(data)
    }
  }
}

module.exports = DataMiddleware