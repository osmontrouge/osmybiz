import testApi from './../api/testApi'
import * as _ from 'lodash'
/* var osmAuth = require('osm-auth')

  var auth = osmAuth({
  oauth_consumer_key: 'WLwXbm6XFMG7WrVnE8enIF6GzyefYIN6oUJSxG65',
  oauth_secret: '9WfJnwQxDvvYagx1Ut0tZBsOZ0ZCzAvOje3u1TV0',
  auto: true // show a login form if the user is not authenticated and
             // you try to do a call
}) */

const state = {
  testCollection: [],
  text: ''
}

const actions = {
  load ({commit}) {
    testApi.loadTests().then(ps => {
      commit('set', ps)
    })
  },
  login ({commit}) {
    console.log('login: ')
    commit('setUser', 'test')
    /* auth.xhr({
      method: 'GET',
      path: '/api/0.6/user/details'
    }, function (err, details) {
      console.log(err, details)
    }) */
  }
}

const mutations = {
  add (state, item) {
    if (!_.find(state.testCollection, i => i.id === item.id)) {
      state.testCollection = [...state.testCollection, item]
    }
  },
  set (state, items) {
    state.testCollection = items
  },

  remove (state, item) {
    state.testCollection = state.testCollection.filter(i => i.id !== item.id)
  },
  setText (state, text) {
    state.text = text
  }
}

const getters = {
  count (state) {
    return state.testCollection.length
  },
  all (state) {
    return state.testCollection
  },
  nextId (state) {
    const oldMax = _(state.testCollection).map(i => i.id).max()
    return oldMax + 1
  },
  text (state) {
    return state.text
  },
  canAdd (state) {
    return state.text.length
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
