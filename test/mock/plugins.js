module.exports = (mock) => {
  mock.success = (data) => {
    return {
      code: '0000',
      data,
      result: 'success'
    }
  }
  mock.fail = (code = '9999', message) => {
    return {
      code,
      result: 'fail',
      message
    }
  }
  mock.getUserInfo = () => (
    mock.$config.UserType === 'Admin' ?
      {userName: 'huanggua', type: 'admin'} :
      {userName: 'luobotang', type: 'developer'}
  )
}
