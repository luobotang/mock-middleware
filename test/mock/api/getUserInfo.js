module.exports = (req, res) => {
  if (req.$config.GetUserInfo === 'Fail') {
    res.json(req.$mock.fail('5001', '服务器异常'))
    return
  }

  res.json(req.$mock.success(req.$mock.getUserInfo()))
}