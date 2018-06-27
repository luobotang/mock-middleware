module.exports = (req, res) => {
	res.json(req.$config.Name)
}