var osmAuth = require('osm-auth')

var auth = osmAuth({
  oauth_consumer_key: 'WLwXbm6XFMG7WrVnE8enIF6GzyefYIN6oUJSxG65',
  oauth_secret: '9WfJnwQxDvvYagx1Ut0tZBsOZ0ZCzAvOje3u1TV0',
  landing: '/'
})

const state = {
  user: {
    id: ''
  }
}

const actions = {
  authenticate () {
    auth.authenticate(() => {
      auth.xhr({
        method: 'GET',
        path: '/api/0.6/user/details'
      }, done)
      console.log(state.user)
    })
  },
  deauthenticate () {
    auth.logout()
  }
}

const mutations = {

}

const getters = {
  user (state) {
    return state.user
  }
}

function done (err, res) {
  console.log(err)
  state.user = res
}

export default {
  state,
  actions,
  mutations,
  getters
}
