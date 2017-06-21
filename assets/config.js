(function() {
	new Vue({
		el: '#app',
		data: {
			configs: null
		},
		created: function() {
			this.getConfig();
		},
		methods: {
			getConfig: function() {
				getConfig(data => {
					this.configs = data;
				});
			},
			postConfig: function(key, value) {
				postConfig({key: key, value: value}, data => {
					this.configs = data;
				});
			}
		}
	});

	function getConfig(done) {
		return fetch('/mock-config')
			.then(res => res.json())
			.then(done, () => {
				alert('get config failed!');
			});
	}

	function postConfig(config, done) {
		return fetch('/mock-config', {
			method: 'POST',
			body: JSON.stringify(config)
		}).then(res => res.json()).then(done, () => {
			alert('post config failed!');
		});
	}
})();