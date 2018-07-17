document.querySelector('#action').addEventListener('click', function () {
	fetch('/api/getUserInfo').then(res => res.json()).then(data => {
		document.querySelector('#output').textContent = JSON.stringify(data, null, '  ')
	})
}, false)