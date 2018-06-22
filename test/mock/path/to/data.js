module.exports = (req, res, next) => {
  res.json(req.$mock.getUserInfo())
}