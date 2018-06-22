module.exports = (mock) => {
  mock.getUserInfo = () => ({
    name: mock.$config.Name,
    age: mock.$config.Age === 'Young' ? 18 : 38
  })
}
