document.getElementById('action').addEventListener('click', function () {
	var url = document.getElementById('url').value
	var method = document.getElementById('method').value
	var elResult = document.getElementById('output')
	elResult.textContent = '请求中...'
	fetch(url, {method: method}).then(res => res.text()).then(text => {
		elResult.textContent = text
	}, () => {
		elResult.textContent = '请求失败'
	})
}, false)