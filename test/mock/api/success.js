module.exports = (req, res) => {
  res.json({
    code: 200,
    msg: '成功',
    data: {
      text: '成功返回'
    }
  })
}
