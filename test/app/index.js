document.getElementById('action').addEventListener('click', function () {
	var url = document.getElementById('url').value
	var method = document.getElementById('method').value
	var data = document.getElementById('data').value
	var elResult = document.getElementById('output')
	elResult.textContent = '请求中...'
	fetch(url, {method: method, body: method === 'POST' ? data : null}).then(res => res.text()).then(text => {
		elResult.textContent = text || '无返回数据'
	}, () => {
		elResult.textContent = '请求失败'
	})
}, false)