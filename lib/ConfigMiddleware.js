/**
 * @typedef ConfigDesc
 * @type {Object}
 * @property {string} desc
 * @property {?string} value
 * @property {{value: string, desc: string}[]} options
 */

const path = require('path')
const util = require('./util')

class ConfigMiddleware {
  /**
   * 
   * @param {string} root 
   */
  constructor (root) {
    this.$root = root
		this.$configFileName = 'config'
		this.$configFilePath = path.join(this.$root, this.$configFileName)
  }

  handle(req, res, next) {
		this._handle(req, res, next)
  }

  _handle(req, res, next) {
    // mock 配置页面相关资源请求
    if (req.path.startsWith('/mock-config/')) {
      var fileName = req.path.substr('/mock-config/'.length)
			res.sendFile(path.join(__dirname, '../assets/' + (fileName || 'index.html')))
			return
		}

		// mock 配置接口，GET 获取配置，POST 更新配置
		if (req.path === '/mock-config') {
      if (req.method === 'GET') {
				res.json(this.get(req))
				return
			}

			if (req.method === 'POST') {
        util.getRequestBody(req, (err, body) => {
          if (err) {
            return next(err)
          }
          res.json(this.set(JSON.parse(body), req))
				})
				return
			}

			res.status(405)
			res.send('405 Method Not Allowed')
			return
    }
    
    // 其他请求交由后面的中间件进行处理，通过 req.$config 暴露当前配置
    // 也将当前配置信息注入到 req.$mock 中，方便插件获取配置数据
    req.$config = req.$mock.$config = this._getConfig(req)
		next()
  }

  _getConfig(req) {
    return this.$config || {}
  }

  _setConfig(config, req) {
    this.$config = config
  }

  /**
   * 
   * @param {{key: string, value: string}|{key: string, value: string}[]} config 
   */
  set(config, req) {
    const $config = this._getConfig(req)
    if (Array.isArray(config)) {
      config.forEach(cfg => $config[cfg.key] = cfg.value)
    } else if (config) {
      $config[config.key] = config.value
    }
    this._setConfig($config, req)
    return this.get(req)
  }

  /**
   * @return {Object.<string, ConfigDesc>}
   */
  get(req) {
		// 为确保获取最新配置，每次都重新加载
		// 注意：../index.js 中统一处理了模块缓存，这里不需要进行处理
    var configMap
    var $config = this._getConfig(req)
    try {
      configMap = require(this.$configFilePath)
    } catch(e) {
      configMap = {}
    }
    Object.keys(configMap).forEach(key => {
      configMap[key].value = $config[key] || 'Normal'
    })
    return configMap
  }
}

module.exports = ConfigMiddleware