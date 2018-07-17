const path = require('path')

class DataMiddleware {
  constructor (root, options) {
    this.$root = root
    this.$options = options || {}
		this.$mapFileName = 'map'
		this.$mapFilePath = path.join(this.$root, this.$mapFileName)
  }

  handle(req, res, next) {
    let mockModule
    let mockModulePath

    let map
    try {
      /**
       * map 结构：
       * {
       *   '/api/foo': './ajax/foo',
       *   '/api/bar': './ajax/bar'
       * }
       */
      map = require(this.$mapFilePath)
    } catch(e) {
      map = {}
    }

    // map 文件中 ajax 下的配置
    mockModulePath = map[req.path]
    if (mockModulePath) {
      try {
        mockModule = require(path.join(this.$root, mockModulePath))
      } catch(e) {
        console.error(`error - require mock module fail ["${req.path}": "${mockModulePath}"]`, e)
        mockModule = null
      }
    }

    // 请求地址与mock目录下文件直接匹配的情况，例如 "/user/getUserName" -> "mock/user/getUserName.js"
    mockModulePath = path.join(this.$root, req.path)
    try {
      mockModule = require(mockModulePath)
    } catch (e) {
      mockModule = null
    }

    if (mockModule) {
      this.invokeHook('before_invoke_mock_module', req)
      if (typeof mockModule === 'function') {
        try {
          mockModule(req, res, next)
          this.invokeHook('after_invoke_mock_module', req)
        } catch(e) {
          console.error(`error - invoke mock module fail`, e)
          next()
        }
      } else {
        // 其他都按 JSON 方式返回
        res.json(mockModule)
      }
      return
    }

    next()
  }

  invokeHook(name, ...args) {
    const fn = this.$options[name]
    if (typeof fn !== 'function') return
    try {
      fn.apply(null, args)
    } catch (e) {
      console.error(`error - invoke data-middleware hook [${name}]`, e)
    }
  }
}

module.exports = DataMiddleware
