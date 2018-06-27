module.exports = (req, res) => {
	if (req.method === 'POST') {
		getReqData(req, (e, data) => {
			if (e) {
				res.json({
					error: e
				})
			} else {
				res.json({
					data: data
				})
			}
		})
	} else {
		res.json({
			error: '只能通过 POST 方法调用！'
		})
	}
}

function getReqData(req, callback) {
	var data = ''
	req.on('data', chunk => {
		data += chunk
	})
	req.on('end', () => {
		callback(null, data)
	})
	req.on('error', (e) => {
		callback(e)
	})
}