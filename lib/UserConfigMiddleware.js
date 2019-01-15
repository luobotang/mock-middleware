const ConfigMiddleware = require('./ConfigMiddleware')
const KEY_USER_ID = '__mock_user_id__'
const store = {}

class UserConfigMiddleware extends ConfigMiddleware {
  constructor(root) {
    super(root)
  }

  handle(req, res, next) {
    req[KEY_USER_ID] = getOrSetUserId(req, res)
    this._handle(req, res, next)
  }

  _getConfig(req) {
    return store[req[KEY_USER_ID]] || {}
  }

  _setConfig(config, req) {
    store[req[KEY_USER_ID]] = config
  }
}

function getOrSetUserId(req, res) {
  let userId = parseCookie(req.headers.cookie || '')[KEY_USER_ID]
  if (!userId) {
    userId = 'default'
    res.set('Set-Cookie', KEY_USER_ID + '=' + userId)
  }
  return userId
}

// 参考：github.com/jshttp/cookie
function parseCookie(str) {
  var obj = {}
  var pairs = str.split(/; */)

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i]
    var eq_idx = pair.indexOf('=')

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue
    }

    var key = pair.substr(0, eq_idx).trim()
    var val = pair.substr(++eq_idx, pair.length).trim()

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1)
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = decodeURIComponent(val)
    }
  }

  return obj
}

module.exports = UserConfigMiddleware