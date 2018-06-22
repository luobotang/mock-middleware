const path = require('path')

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

    // map 文件中 ajax 下的配置
    if ((mod = map.ajax && map.ajax[req.path])) {
      this.getData(mod, req, data => {
        res.json(data)
      })
      return
    }

    // map 文件中 page 下的配置
    if ((mod = map.page && map.page[req.path])) {
      this.getData(mod, req, data => {
        req.$data = data
        next()
      })
      return
    }

    // 请求地址与mock目录下文件直接匹配的情况，例如：
    // 请求地址为 "/user/getUserName"
    // 对应mock文件模块为 "mock/user/getUserName.js"
    const mockModule = tryMatchRequestMockModule(req, this.$root)
    if (mockModule) {
      // 给予 mock 模块更大的自由度
      mockModule(req, res, next)
      return
    }

    // 非 mock 接口相关请求，交由后续中间件处理
    next()
  }

  getData(mod, req, callback) {
		// 每次重新加载 mock 模块，入口文件统一进行模块变更的缓存清除
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

function tryMatchRequestMockModule(req, root) {
  const mockModulePath = path.join(root, req.path)
  try {
    return require(mockModulePath)
  } catch (e) {
    return null
  }
}
