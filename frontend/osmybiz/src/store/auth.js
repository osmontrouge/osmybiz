var osmAuth = require('osm-auth')

var auth = osmAuth({
  oauth_consumer_key: 'deem7DGxX11rEQZ1SjYQ2lL0O9JCCNtqBzFUePjA',
  oauth_secret: 'umPZIExDrNP4KvcXkhwBNIlH9J8jByPSCSwwL4w9',
  singlepage: true,
  landing: '/#/'
})

const state = {
  user: {
    id: ''
  }
}

const actions = {
  authenticate () {
    auth.authenticate((res) => {
      console.log(res)
      getDetails()
    })
  },
  deauthenticate () {
    auth.logout()
  } /* ,
  getDetails () {
    console.log(auth.authenticated())
    auth.xhr({
      method: 'GET',
      path: '/api/0.6/user/details'
    }, done)
  } */
}

const mutations = {

}

const getters = {
  user (state) {
    return state.user
  }
}

function done (err, res) {
  if (err) {
    console.log(err)
  }
  console.log(res)
  // state.user = res
}

function getDetails () {
  auth.xhr({
    method: 'GET',
    path: '/api/0.6/user/details'
  }, done)
}

export default {
  state,
  actions,
  mutations,
  getters
}
