const fs = require('fs')
const path = require('path')
const util = require('./lib/util')
const ConfigMiddleware = require('./lib/ConfigMiddleware')
const DataMiddleware = require('./lib/DataMiddleware')

class Mock {
  constructor(root) {
    root = this.$root = root || path.join(process.cwd(), 'mock')
    // 监听根目录下文件变更，从而在 mock 模块修改后清除原有模块缓存
    // 使得新的请求到来时，可以使用新的 mock 模块进行处理
    // 由于通过监听方式进行统一处理，DataMiddleware 可以不处理模块缓存问题
    watchMockRoot(root)
    this.configMiddleware = new ConfigMiddleware(root)
    this.dataMiddleware = new DataMiddleware(root, {
      // 在调用mock模块前，向 req.$mock 注入辅助方法，以便于 mock 模块使用
      before_invoke_mock_module: (req) => {
        this.initPlugins(req.$mock)
      }
    })
  }

  handleRequest(req, res, next) {
    // 在请求对象上注入 $mock
    req.$mock = {}

    // 依次通过 ConfigMiddleware、DataMiddleware 的处理
		this.configMiddleware.handle(req, res, () => {
			this.dataMiddleware.handle(req, res, next)
		})
  }

  // 从 plugins 模块执行安装插件
  initPlugins(instance) {
    const plugins = path.join(this.$root, 'plugins')
    try {
      const install = require(plugins)
      if (typeof install === 'function') {
        try {
          install(instance)
        } catch (e) {
          console.log('error - install mock plugins', e)
        }
      }
    } catch (e) {
      // 忽略错误
    }
  }
}

function watchMockRoot(root) {
  fs.watch(root, {recursive: true}, (type, filename) => {
    const filePath = path.join(root, filename)
    clearModuleCacheLater(filePath)
  })
}

/**
 * 监听目录下文件变更时，一次修改会触发多次事件，所以延迟处理
 */
function clearModuleCacheLater(modulepath) {
  const timers = clearModuleCacheLater.$timers || (clearModuleCacheLater.$timers = {})
  // 如果当前模块已经标记过会延迟进行处理，本次就直接返回好了
  if (timers[modulepath]) return
  // 执行操作，然后清除当前模块标记
  timers[modulepath] = setTimeout(() => {
    util.clearModuleCache(modulepath)
    delete timers[modulepath]
  }, 100)
}

exports = module.exports = function(root) {
  const mockInstance = new Mock(root)
	return function(req, res, next) {
    mockInstance.handleRequest(req, res, next)
	}
}

exports.ConfigMiddleware = ConfigMiddleware
exports.DataMiddleware = DataMiddleware
exports.requireNoCache = util.requireNoCache
exports.getRequestBody = util.getRequestBody