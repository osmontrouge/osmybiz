import {login, isLoggedIn, setOauthToken, loadUser} from './../api/osmApi'
import * as _ from 'lodash'

const state = {
  isLoggedIn: false,
  user: null
}

const actions = {
  authenticate () {
    login()
  },
  isLoggedIn () {
    return isLoggedIn()
  },
  setToken (state, token) {
    return setOauthToken(token)
  },
  loadUser ({commit}) {
    loadUser().then(user => {
      commit('setUser', user)
    })
  }
}

const mutations = {
  setUser (state, user) {
    if (_.isObject(user)) {
      state.user = user
      state.isLoggedIn = true
    } else {
      state.isLoggedIn = false
    }
  }
}

const getters = {
  user (state) {
    return state.user
  },
  isLoggedIn (state) {
    return state.isLoggedIn
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
