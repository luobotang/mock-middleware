module.exports = (req, callback) => {
	if (req.method === 'POST') {
		getReqData(req, (e, data) => {
			if (e) {
				callback({
					error: e
				})
			} else {
				callback({
					data: data
				})
			}
		})
	} else {
		callback({
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