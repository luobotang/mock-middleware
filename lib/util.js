/**
 * @param {string} mod absolute path of module
 */
exports.requireNoCache = function(mod) {
	const modulePath = require.resolve(mod)
	clearModuleCache(modulePath)
  return require(modulePath)
}

exports.clearModuleCache = clearModuleCache

/**
 * @param {Object} req express request object
 * @param {Function} callback
 */
exports.getRequestBody = function(req, callback) {
  var body = ''
  req.on('data', data => body += data)
  req.on('end', data => {
    if (data) {
      body += data
    }
    callback(null, body)
  })
  req.on('error', err => callback(err))
}

function clearModuleCache(modulePath) {
	/*
	 * 比较简单的移除模块缓存的方式，印象中不是很完善，但可以解决常见问题
	 * 如果发现更好的方式再进行优化
	 */
	delete require.cache[modulePath]
	return modulePath
}