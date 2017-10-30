(function() {
	window.app = new Vue({
		el: '#app',
		data: {
			configs: null,
			activeType: 'Default'
		},
		computed: {
			configTypes: function() {
				var configs = this.configs;
				if (!configs || configs.length === 0) return null;
				var keys = Object.keys(configs);
				var list = [];
				var map = {};
				var i = 0;
				var configItem;
				var type;
				var configType;
				for (let key of Object.keys(configs)) {
					configItem = configs[key];
					configItem.key = key;
					type = configItem.type || 'Default';
					configType = map[type];
					if (!configType) {
						configType = {type: type, configs: []};
						map[type] = configType;
						list.push(configType);
					}
					configType.configs.push(configItem);
				}
				return list;
			}
		},
		created: function() {
			this.getConfig();
		},
		methods: {
			getConfig: function() {
				getConfig(data => {
					this.configs = data;
					if (this.activeType === 'Default') {
						this.activeType = this.configTypes[0].type;
					}
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