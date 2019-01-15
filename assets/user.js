(function() {

  const KEY_USER_ID = '__mock_user_id__'

  function getUserIdFromCookie() {
    const m = /__mock_user_id__=([^;]+)/.exec(document.cookie)
    return m && m[1] || 'default'
  }

  function setUserIdToCookie(id) {
    document.cookie = KEY_USER_ID + '=' + encodeURIComponent(id)
  }

  new Vue({
    el: '#root',
    data() {
      const user = getUserIdFromCookie()
      return {
        user,
        user_new: user
      }
    },
    computed: {
      changed() {
        return this.user !== this.user_new
      }
    },
    methods: {
      save() {
        setUserIdToCookie(this.user = this.user_new)
      }
    }
  })
})()
