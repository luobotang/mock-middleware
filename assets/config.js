(function() {
  const ConfigItem = {
    template: '#config-item',
    props: {
      config: Object,
      value: String
    },
    computed: {
      opt_list() {
        const opts = this.config.options
        if (Array.isArray(opts)) return opts
        return Object.keys(opts).map((key) => ({value: key, desc: opts[key]}))
      }
    },
    methods: {
      onInput(value) {
        this.$emit('change', {key: this.config.key, value})
      }
    }
  }

  new Vue({
    el: '#app',
    data: {
      configs: null,
      active_type: 'Default'
    },
    components: {
      ConfigItem
    },
    computed: {
      config_groups() {
        const configs = this.configs
        if (!configs || configs.length === 0) return null
        const groups = []
        const group_map = {}
        for (let key of Object.keys(configs)) {
          let item = configs[key]
          item.key = key
          let type = item.type || 'Default'
          let group = group_map[type]
          if (!group) {
            group = {type: type, configs: []}
            group_map[type] = group
            groups.push(group)
          }
          group.configs.push(item)
        }
        return groups
      },
      active_group() {
        const active_type = this.active_type
        return this.config_groups && this.config_groups.find((group) => group.type === active_type)
      }
    },
    created() {
      getConfig(data => {
        this.configs = data
      })
    },
    methods: {
      onConfigChange({key, value}) {
        postConfig({key: key, value: value}, (data) => this.configs = data)
      }
    }
  })

  function getConfig(done) {
    return fetch('/mock-config')
      .then(res => res.json())
      .then(done, () => {
        alert('get config failed!')
      })
  }

  function postConfig(config, done) {
    return fetch('/mock-config', {
      method: 'POST',
      body: JSON.stringify(config)
    }).then(res => res.json()).then(done, () => {
      alert('post config failed!')
    })
  }
})()