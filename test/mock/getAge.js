module.exports = (req, res) => {
	var age = req.$config.Age === 'Young' ? 18 : 38
	setTimeout(() => res.json(age), 1000)
}