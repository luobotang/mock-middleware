module.exports = (req, callback) => {
	var age = req.$config.Age === 'Young' ? 18 : 38
	setTimeout(() => callback(age), 1000)
}